import { useRef, useState, type PointerEvent as RPointerEvent } from 'react';
import { type Graph, type Atom, type El, cloneGraph, findBond, overValence, hCount, sub } from '../chem/graph';
import type { PieceKind } from '../data/types';
import { EL_COLOR, chargeStr } from './MoleculeView';

// Grade triangular: vizinhos a S px em 6 direções (zigue-zague na horizontal, galhos na vertical).
// A área cresce sozinha quando a molécula chega perto da borda.
const S = 56;
const DX = S * Math.cos(Math.PI / 6); // 43.3
const DY = S / 2; // 25
const W = 420;
const H = 340;
const R_NEAR = S * 1.3; // distância de "vizinho" pra ligar com um toque

export const PIECE_INFO: Record<PieceKind, { el: El; charge: number; label: string }> = {
  C: { el: 'C', charge: 0, label: 'C' },
  O: { el: 'O', charge: 0, label: 'O' },
  N: { el: 'N', charge: 0, label: 'N' },
  Cl: { el: 'Cl', charge: 0, label: 'Cl' },
  Br: { el: 'Br', charge: 0, label: 'Br' },
  F: { el: 'F', charge: 0, label: 'F' },
  I: { el: 'I', charge: 0, label: 'I' },
  S: { el: 'S', charge: 0, label: 'S' },
  'O-': { el: 'O', charge: -1, label: 'O⁻' },
  'Na+': { el: 'Na', charge: 1, label: 'Na⁺' },
  'K+': { el: 'K', charge: 1, label: 'K⁺' },
  benzeno: { el: 'C', charge: 0, label: '⬡' },
};

const PIECE_ORDER: PieceKind[] = ['C', 'benzeno', 'O', 'O-', 'N', 'Cl', 'Br', 'F', 'I', 'S', 'Na+', 'K+'];

function pieceOf(a: Atom): PieceKind {
  if (a.el === 'O' && a.charge === -1) return 'O-';
  if (a.el === 'Na') return 'Na+';
  if (a.el === 'K') return 'K+';
  return a.el as PieceKind;
}

export function usedPieces(g: Graph): Partial<Record<PieceKind, number>> {
  const u: Partial<Record<PieceKind, number>> = {};
  const tpls = new Set<number>();
  for (const a of g.atoms) {
    if (a.tpl !== undefined) {
      tpls.add(a.tpl);
      continue;
    }
    const p = pieceOf(a);
    u[p] = (u[p] ?? 0) + 1;
  }
  if (tpls.size) u.benzeno = tpls.size;
  return u;
}

function lattice(i: number, j: number) {
  return { x: 14 + i * DX, y: 14 + j * DY };
}

interface Dims {
  w: number;
  h: number;
  cols: number;
  rows: number;
}

function dimsFor(g: Graph): Dims {
  const maxX = Math.max(0, ...g.atoms.map((a) => a.x));
  const maxY = Math.max(0, ...g.atoms.map((a) => a.y));
  const w = Math.max(W, maxX + DX * 1.6);
  const h = Math.max(H, maxY + DY * 2.6);
  return { w, h, cols: Math.floor((w - 14) / DX), rows: Math.floor((h - 14) / DY) };
}

let DIMS: Dims = { w: W, h: H, cols: Math.floor((W - 14) / DX), rows: Math.floor((H - 14) / DY) };

function snap(x: number, y: number) {
  const COLS = DIMS.cols;
  const ROWS = DIMS.rows;
  let best = { i: 0, j: 0, d: Infinity };
  const i0 = Math.round((x - 14) / DX);
  const j0 = Math.round((y - 14) / DY);
  for (let i = i0 - 1; i <= i0 + 1; i++) {
    for (let j = j0 - 1; j <= j0 + 1; j++) {
      if ((i + j) % 2 !== 0) continue;
      if (i < 1 || j < 1 || i > COLS || j > ROWS) continue;
      const p = lattice(i, j);
      const d = Math.hypot(p.x - x, p.y - y);
      if (d < best.d) best = { i, j, d };
    }
  }
  if (best.d === Infinity) {
    const i = Math.min(COLS, Math.max(1, i0));
    let j = Math.min(ROWS, Math.max(1, j0));
    if ((i + j) % 2) j = j > 1 ? j - 1 : j + 1;
    return lattice(i, j);
  }
  return lattice(best.i, best.j);
}

const occupied = (g: Graph, x: number, y: number, ignore?: number) =>
  g.atoms.some((a) => a.id !== ignore && Math.hypot(a.x - x, a.y - y) < 10);

function freeNear(g: Graph, x: number, y: number, ignore?: number) {
  const p = snap(x, y);
  if (!occupied(g, p.x, p.y, ignore)) return p;
  for (let r = 1; r < 8; r++) {
    for (let k = 0; k < 6 * r; k++) {
      const ang = (k / (6 * r)) * Math.PI * 2;
      const q = snap(p.x + Math.cos(ang) * r * S, p.y + Math.sin(ang) * r * S);
      if (!occupied(g, q.x, q.y, ignore)) return q;
    }
  }
  return p;
}

const HEX = [
  [0, -S], [DX, -DY], [DX, DY], [0, S], [-DX, DY], [-DX, -DY],
];

interface Props {
  graph: Graph;
  onChange: (g: Graph) => void;
  pieces: Partial<Record<PieceKind, number>> | 'livre';
  highlight?: number[];
  disabled?: boolean;
}

export function MoleculeBuilder({ graph, onChange, pieces, highlight = [], disabled }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const history = useRef<Graph[]>([]);
  const nextId = useRef(1 + Math.max(0, ...graph.atoms.map((a) => a.id)));
  const nextTpl = useRef(1);
  const [tool, setTool] = useState<PieceKind | null>(() => (pieces === 'livre' ? 'C' : PIECE_ORDER.find((k) => (pieces[k] ?? 0) > 0) ?? null));
  const [erase, setErase] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [drag, setDrag] = useState<{ id: number; x: number; y: number; moved: boolean } | null>(null);

  const dims = dimsFor(graph);
  DIMS = dims;
  const used = usedPieces(graph);
  const kinds: PieceKind[] = pieces === 'livre' ? ['C', 'benzeno', 'O', 'O-', 'N', 'Cl', 'Br', 'F', 'Na+', 'K+'] : PIECE_ORDER.filter((k) => (pieces[k] ?? 0) > 0);
  const left = (k: PieceKind) => (pieces === 'livre' ? Infinity : (pieces[k] ?? 0) - (used[k] ?? 0));

  const commit = (g: Graph) => {
    history.current.push(cloneGraph(graph));
    if (history.current.length > 60) history.current.shift();
    onChange(g);
  };

  const toSvg = (e: { clientX: number; clientY: number }) => {
    const svg = svgRef.current!;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const m = svg.getScreenCTM();
    if (!m) return { x: 0, y: 0 };
    const p = pt.matrixTransform(m.inverse());
    return { x: p.x, y: p.y };
  };

  const atomAt = (x: number, y: number, ignore?: number) =>
    graph.atoms.find((a) => a.id !== ignore && Math.hypot(a.x - x, a.y - y) < 20);

  const addBond = (g: Graph, a: number, b: number) => {
    const ex = findBond(g, a, b);
    if (ex) ex.order = ex.order === 3 ? 1 : ((ex.order + 1) as 2 | 3);
    else g.bonds.push({ a, b, order: 1 });
  };

  const place = (x: number, y: number) => {
    if (!tool || left(tool) <= 0) return;
    const g = cloneGraph(graph);
    if (tool === 'benzeno') {
      // acha um centro onde os 6 vértices estejam livres
      let c = snap(x, y);
      const fits = (cx: number, cy: number) => HEX.every(([dx, dy]) => cx + dx > 8 && cx + dx < dims.w - 8 && cy + dy > 8 && cy + dy < dims.h - 8 && !occupied(g, cx + dx, cy + dy));
      if (!fits(c.x, c.y)) {
        let found = false;
        for (let r = 1; r < 6 && !found; r++) {
          for (let k = 0; k < 12 && !found; k++) {
            const q = snap(c.x + Math.cos((k / 12) * 2 * Math.PI) * r * S, c.y + Math.sin((k / 12) * 2 * Math.PI) * r * S);
            if (fits(q.x, q.y)) {
              c = q;
              found = true;
            }
          }
        }
        if (!found) return;
      }
      const tpl = nextTpl.current++;
      const ids = HEX.map(([dx, dy]) => {
        const id = nextId.current++;
        g.atoms.push({ id, el: 'C', charge: 0, x: c.x + dx, y: c.y + dy, tpl });
        return id;
      });
      ids.forEach((id, k) => g.bonds.push({ a: id, b: ids[(k + 1) % 6], order: k % 2 === 0 ? 2 : 1 }));
      if (selected !== null && g.atoms.some((a) => a.id === selected)) {
        const s = g.atoms.find((a) => a.id === selected)!;
        const near = ids.map((id) => g.atoms.find((a) => a.id === id)!).sort((p, q) => Math.hypot(p.x - s.x, p.y - s.y) - Math.hypot(q.x - s.x, q.y - s.y))[0];
        g.bonds.push({ a: s.id, b: near.id, order: 1 });
      }
      setSelected(null);
      commit(g);
      return;
    }
    const info = PIECE_INFO[tool];
    const p = freeNear(g, x, y);
    const id = nextId.current++;
    g.atoms.push({ id, el: info.el, charge: info.charge, x: p.x, y: p.y });
    const isIon = info.el === 'Na' || info.el === 'K';
    if (selected !== null && !isIon) {
      const s = g.atoms.find((a) => a.id === selected);
      if (s && s.el !== 'Na' && s.el !== 'K') addBond(g, s.id, id);
    }
    setSelected(isIon ? null : id);
    commit(g);
    if (left(tool) - 1 <= 0) {
      const nxt = kinds.find((k) => k !== tool && left(k) > 0);
      setTool(nxt ?? null);
    }
  };

  const removeAtom = (id: number) => {
    const g = cloneGraph(graph);
    g.atoms = g.atoms.filter((a) => a.id !== id);
    g.bonds = g.bonds.filter((b) => b.a !== id && b.b !== id);
    if (selected === id) setSelected(null);
    commit(g);
  };

  const onBgDown = (e: RPointerEvent<SVGSVGElement>) => {
    if (disabled) return;
    if (e.target !== svgRef.current && !(e.target as Element).classList?.contains('bg')) return;
    const p = toSvg(e);
    if (erase) return;
    if (tool) place(p.x, p.y);
    else setSelected(null);
  };

  const onAtomDown = (e: RPointerEvent, a: Atom) => {
    if (disabled) return;
    e.stopPropagation();
    svgRef.current?.setPointerCapture(e.pointerId);
    const p = toSvg(e);
    setDrag({ id: a.id, x: p.x, y: p.y, moved: false });
  };

  const onMove = (e: RPointerEvent) => {
    if (!drag) return;
    const p = toSvg(e);
    const a = graph.atoms.find((q) => q.id === drag.id);
    const moved = drag.moved || (a ? Math.hypot(p.x - a.x, p.y - a.y) > 14 : false);
    setDrag({ ...drag, x: p.x, y: p.y, moved });
  };

  const onUp = () => {
    if (!drag) return;
    const d = drag;
    setDrag(null);
    const a = graph.atoms.find((q) => q.id === d.id);
    if (!a) return;
    if (d.moved) {
      const target = atomAt(d.x, d.y, a.id);
      if (target) {
        const g = cloneGraph(graph);
        addBond(g, a.id, target.id);
        setSelected(null);
        commit(g);
      } else {
        const g = cloneGraph(graph);
        const p = freeNear(g, d.x, d.y, a.id);
        const at = g.atoms.find((q) => q.id === a.id)!;
        at.x = p.x;
        at.y = p.y;
        commit(g);
      }
      return;
    }
    // toque
    if (erase) return removeAtom(a.id);
    const s = selected === null ? undefined : graph.atoms.find((q) => q.id === selected);
    if (!s) return setSelected(a.id);
    if (s.id === a.id) return setSelected(null);
    const near = Math.hypot(s.x - a.x, s.y - a.y) <= R_NEAR;
    const ion = (x: Atom) => x.el === 'Na' || x.el === 'K';
    if (!near || findBond(graph, s.id, a.id) || ion(s) || ion(a)) {
      // longe (ou já ligados): só muda a seleção
      setSelected(a.id);
      return;
    }
    const g = cloneGraph(graph);
    addBond(g, s.id, a.id);
    setSelected(a.id);
    commit(g);
  };

  const onBondClick = (e: React.MouseEvent, idx: number) => {
    if (disabled) return;
    e.stopPropagation();
    const g = cloneGraph(graph);
    if (erase) g.bonds.splice(idx, 1);
    else {
      const b = g.bonds[idx];
      b.order = b.order === 3 ? 1 : ((b.order + 1) as 2 | 3);
    }
    commit(g);
  };

  const undo = () => {
    const prev = history.current.pop();
    if (prev) {
      setSelected(null);
      onChange(prev);
    }
  };

  const clear = () => {
    if (!graph.atoms.length) return;
    setSelected(null);
    commit({ atoms: [], bonds: [] });
  };

  const byId = new Map(graph.atoms.map((a) => [a.id, a]));
  const hl = new Set(highlight);
  const dragAtom = drag ? byId.get(drag.id) : undefined;

  return (
    <div className="builder">
      {!disabled && (
        <div className="tray" aria-label="peças">
          {kinds.map((k) => {
            const n = left(k);
            const info = PIECE_INFO[k];
            return (
              <button
                key={k}
                className={'piece' + (tool === k && !erase ? ' sel' : '')}
                disabled={n <= 0}
                onClick={() => {
                  setErase(false);
                  setTool(k);
                }}
                title={k === 'benzeno' ? 'anel benzênico' : info.label}
                style={{ color: k === 'benzeno' ? 'var(--ink)' : EL_COLOR(info.el) }}
              >
                {k === 'benzeno' ? <BenzeneIcon /> : info.label}
                {pieces !== 'livre' && <span className={'cnt' + (n <= 0 ? ' zero' : '')}>{Math.max(0, n)}</span>}
              </button>
            );
          })}
        </div>
      )}
      <svg
        ref={svgRef}
        className="builder-canvas"
        viewBox={`0 0 ${dims.w} ${dims.h}`}
        onPointerDown={onBgDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={() => setDrag(null)}
        style={{ opacity: disabled ? 0.85 : 1 }}
      >
        <rect className="bg" x={0} y={0} width={dims.w} height={dims.h} fill="transparent" />
        {/* pontinhos da grade */}
        {!disabled &&
          Array.from({ length: dims.cols + 1 }, (_, i) =>
            Array.from({ length: dims.rows + 1 }, (_, j) =>
              (i + j) % 2 === 0 && i > 0 && j > 0 ? <circle key={`${i}-${j}`} className="bg" cx={lattice(i, j).x} cy={lattice(i, j).y} r={1.3} fill="var(--line)" /> : null,
            ),
          )}
        {graph.bonds.map((b, idx) => {
          const A = byId.get(b.a);
          const B = byId.get(b.b);
          if (!A || !B) return null;
          const dx = B.x - A.x;
          const dy = B.y - A.y;
          const len = Math.hypot(dx, dy) || 1;
          const px = -dy / len;
          const py = dx / len;
          const offs = b.order === 1 ? [0] : b.order === 2 ? [-4, 4] : [-6.5, 0, 6.5];
          return (
            <g key={idx} onClick={(e) => onBondClick(e, idx)} style={{ cursor: 'pointer' }}>
              <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="transparent" strokeWidth={22} />
              {offs.map((o, k) => (
                <line key={k} x1={A.x + px * o} y1={A.y + py * o} x2={B.x + px * o} y2={B.y + py * o} stroke="var(--ink)" strokeWidth={2.6} strokeLinecap="round" />
              ))}
            </g>
          );
        })}
        {drag?.moved && dragAtom && (
          <line x1={dragAtom.x} y1={dragAtom.y} x2={drag.x} y2={drag.y} stroke="var(--primary)" strokeWidth={3} strokeDasharray="6 5" />
        )}
        {graph.atoms.map((a) => {
          const h = hCount(graph, a);
          const over = overValence(graph, a);
          const bad = over || hl.has(a.id);
          const isSel = selected === a.id;
          const label = a.el + (h ? 'H' + (h > 1 ? sub(h) : '') : '') + chargeStr(a.charge);
          const r = label.length > 2 ? 20 : 17;
          return (
            <g key={a.id} onPointerDown={(e) => onAtomDown(e, a)} style={{ cursor: 'pointer' }}>
              {isSel && <circle cx={a.x} cy={a.y} r={r + 6} fill="var(--primary)" opacity={0.25} />}
              <circle cx={a.x} cy={a.y} r={r} fill="var(--card)" stroke={bad ? 'var(--bad)' : isSel ? 'var(--primary)' : EL_COLOR(a.el)} strokeWidth={bad || isSel ? 3 : 2} />
              <text x={a.x} y={a.y + 1} textAnchor="middle" dominantBaseline="central" fontSize={label.length > 3 ? 13 : 15} fontWeight={900} fill={EL_COLOR(a.el)} style={{ pointerEvents: 'none', fontFamily: 'Nunito, sans-serif' }}>
                {label}
              </text>
              {over && (
                <text x={a.x + r} y={a.y - r} fontSize={16} fontWeight={900} fill="var(--bad)" style={{ pointerEvents: 'none' }}>
                  !
                </text>
              )}
            </g>
          );
        })}
        {!graph.atoms.length && !disabled && (
          <text x={dims.w / 2} y={dims.h / 2} textAnchor="middle" fill="var(--ink-3)" fontSize={15} fontWeight={700} className="bg" style={{ pointerEvents: 'none' }}>
            Escolhe uma peça e toca aqui ✨
          </text>
        )}
      </svg>
      {!disabled && (
        <>
          <div className="tools" style={{ marginTop: 8 }}>
            <button className="tool" onClick={undo}>↩️ Desfazer</button>
            <button className={'tool' + (erase ? ' on' : '')} onClick={() => setErase(!erase)}>🧽 {erase ? 'Apagando…' : 'Apagar'}</button>
            <button className="tool" onClick={clear}>🗑️ Limpar</button>
          </div>
          <div className="builder-help">
            {erase
              ? 'Toque num átomo ou numa ligação pra apagar. Toque em "Apagando…" pra parar.'
              : 'Escolhe a peça e toca na área: ela já gruda no átomo que está brilhando. Toque num átomo pra fazer ele brilhar. Com um brilhando, tocar num vizinho liga os dois. Pra ligar átomos longe, arraste um até o outro. Toque numa ligação pra virar dupla/tripla. Arraste um átomo pra um lugar vazio pra mudar ele de lugar. A área cresce se você for até a borda.'}
          </div>
        </>
      )}
    </div>
  );
}

function BenzeneIcon() {
  return (
    <svg width="26" height="26" viewBox="-14 -14 28 28">
      <polygon points="0,-11 9.5,-5.5 9.5,5.5 0,11 -9.5,5.5 -9.5,-5.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle r="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export type { Atom };
