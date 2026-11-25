import { useMemo } from 'react';
import { type Graph, type Atom, hCount, neighbors, sub } from '../chem/graph';
import { smilesToGraph } from '../chem/ocl';

export const EL_COLOR = (el: string) => `var(--el-${el}, var(--ink))`;

interface Props {
  smiles?: string;
  graph?: Graph;
  /** true = mostra todos os C com seus H (CH₃, CH₂...) */
  completo?: boolean;
  highlight?: number[];
  /** modo "tocar nos átomos" */
  pick?: {
    selected: number[];
    onToggle: (id: number) => void;
    marks?: Record<number, 'ok' | 'bad' | 'missed'>;
    disabled?: boolean;
  };
  maxWidth?: number;
  scale?: number;
}

export function chargeStr(c: number) {
  if (!c) return '';
  const n = Math.abs(c) > 1 ? String(Math.abs(c)) : '';
  return n + (c > 0 ? '⁺' : '⁻');
}

/** Texto do átomo com H implícitos: OH, NH₂, CH₃, O⁻, Na⁺ */
export function atomText(g: Graph, a: Atom, completo: boolean): string | null {
  const h = hCount(g, a);
  const deg = neighbors(g, a.id).length;
  if (a.el === 'C' && !completo && deg > 0) return null;
  const hs = h === 0 ? '' : h === 1 ? 'H' : 'H' + sub(h);
  return a.el + hs + chargeStr(a.charge);
}

export function MoleculeView({ smiles, graph, completo = false, highlight = [], pick, maxWidth = 420, scale = 40 }: Props) {
  const g = useMemo(() => graph ?? smilesToGraph(smiles!, scale), [graph, smiles, scale]);

  const pad = 28;
  const xs = g.atoms.map((a) => a.x);
  const ys = g.atoms.map((a) => a.y);
  const minX = Math.min(...xs) - pad;
  const minY = Math.min(...ys) - pad;
  const w = Math.max(...xs) - minX + pad;
  const h = Math.max(...ys) - minY + pad;
  const byId = new Map(g.atoms.map((a) => [a.id, a]));
  const labels = new Map(g.atoms.map((a) => [a.id, atomText(g, a, completo)]));
  const hl = new Set(highlight);

  const trim = (a: Atom) => (labels.get(a.id) ? (labels.get(a.id)!.length > 2 ? 15 : 11) : 0);

  return (
    <svg
      viewBox={`${minX} ${minY} ${w} ${h}`}
      style={{ width: '100%', maxWidth: Math.min(maxWidth, w * 1.15), height: 'auto', display: 'block', overflow: 'visible' }}
      role="img"
      aria-label={smiles ?? 'molécula'}
    >
      {g.bonds.map((b, i) => {
        const A = byId.get(b.a)!;
        const B = byId.get(b.b)!;
        const dx = B.x - A.x;
        const dy = B.y - A.y;
        const len = Math.hypot(dx, dy) || 1;
        const ux = dx / len;
        const uy = dy / len;
        const ta = trim(A);
        const tb = trim(B);
        const x1 = A.x + ux * ta;
        const y1 = A.y + uy * ta;
        const x2 = B.x - ux * tb;
        const y2 = B.y - uy * tb;
        const px = -uy;
        const py = ux;
        const offs = b.order === 1 ? [0] : b.order === 2 ? [-3.2, 3.2] : [-5, 0, 5];
        const red = hl.has(A.id) && hl.has(B.id);
        return (
          <g key={i} stroke={red ? 'var(--bad)' : 'var(--ink)'} strokeWidth={2.2} strokeLinecap="round">
            {offs.map((o, k) => (
              <line key={k} x1={x1 + px * o} y1={y1 + py * o} x2={x2 + px * o} y2={y2 + py * o} />
            ))}
          </g>
        );
      })}
      {g.atoms.map((a) => {
        const t = labels.get(a.id);
        const mark = pick?.marks?.[a.id];
        const sel = pick?.selected.includes(a.id);
        const ring = mark === 'ok' ? 'var(--ok)' : mark === 'bad' ? 'var(--bad)' : mark === 'missed' ? 'var(--warn)' : sel ? 'var(--primary)' : hl.has(a.id) ? 'var(--bad)' : null;
        return (
          <g key={a.id}>
            {ring && <circle cx={a.x} cy={a.y} r={t && t.length > 2 ? 17 : 13} fill={ring} opacity={0.25} stroke={ring} strokeWidth={2} />}
            {t && (
              <>
                <rect x={a.x - t.length * 4.6} y={a.y - 10} width={t.length * 9.2} height={20} fill="var(--card)" opacity={ring ? 0 : 0.9} rx={6} />
                <text
                  x={a.x}
                  y={a.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={16}
                  fontWeight={800}
                  fill={EL_COLOR(a.el)}
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                >
                  {t}
                </text>
              </>
            )}
            {pick && !pick.disabled && (
              <circle
                cx={a.x}
                cy={a.y}
                r={18}
                fill="transparent"
                style={{ cursor: 'pointer' }}
                onClick={() => pick.onToggle(a.id)}
              />
            )}
            {pick && !t && !ring && <circle cx={a.x} cy={a.y} r={3.5} fill="var(--ink-3)" />}
          </g>
        );
      })}
    </svg>
  );
}
