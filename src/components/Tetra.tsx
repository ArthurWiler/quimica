import type { Ligand, Slot } from '../chem/stereo';

// posições na tela (C central em 100,95)
const C = { x: 100, y: 92 };
const END: Record<Slot, { x: number; y: number; lx: number; ly: number; anchor: 'middle' | 'end' | 'start' }> = {
  T: { x: 100, y: 34, lx: 100, ly: 20, anchor: 'middle' },
  L: { x: 44, y: 112, lx: 36, ly: 118, anchor: 'end' },
  R: { x: 156, y: 112, lx: 164, ly: 118, anchor: 'start' },
  B: { x: 100, y: 152, lx: 100, ly: 172, anchor: 'middle' },
};

interface Props {
  place: Partial<Record<Slot, Ligand>>;
  onSlot?: (s: Slot) => void;
  activeSlots?: boolean;
  marks?: Partial<Record<Slot, 'ok' | 'bad'>>;
  width?: number;
}

export function Tetra({ place, onSlot, activeSlots, marks = {}, width = 240 }: Props) {
  return (
    <svg viewBox="-20 0 240 190" style={{ width: '100%', maxWidth: width, height: 'auto', display: 'block', overflow: 'visible' }}>
      {/* tracejado (para trás) */}
      {Array.from({ length: 7 }, (_, i) => {
        const t = (i + 1) / 8;
        const y = C.y + (END.T.y - C.y) * t;
        const half = 1 + 6 * t;
        return <line key={i} x1={C.x - half} y1={y} x2={C.x + half} y2={y} stroke="var(--ink)" strokeWidth={2} />;
      })}
      {/* cunhas (para frente) */}
      {(['L', 'R'] as Slot[]).map((s) => {
        const e = END[s];
        const dx = e.x - C.x;
        const dy = e.y - C.y;
        const len = Math.hypot(dx, dy);
        const px = (-dy / len) * 7;
        const py = (dx / len) * 7;
        return <polygon key={s} points={`${C.x},${C.y} ${e.x + px},${e.y + py} ${e.x - px},${e.y - py}`} fill="var(--ink)" />;
      })}
      {/* plano */}
      <line x1={C.x} y1={C.y} x2={END.B.x} y2={END.B.y} stroke="var(--ink)" strokeWidth={2.5} />
      <circle cx={C.x} cy={C.y} r={11} fill="var(--card)" />
      <text x={C.x} y={C.y + 1} textAnchor="middle" dominantBaseline="central" fontWeight={900} fontSize={18} fill="var(--el-C)">
        C
      </text>
      {(Object.keys(END) as Slot[]).map((s) => {
        const e = END[s];
        const lig = place[s];
        const m = marks[s];
        const color = m === 'ok' ? 'var(--ok)' : m === 'bad' ? 'var(--bad)' : 'var(--primary)';
        return (
          <g key={s} onClick={() => onSlot?.(s)} style={{ cursor: onSlot ? 'pointer' : 'default' }}>
            {lig ? (
              <text x={e.lx} y={e.ly} textAnchor={e.anchor} dominantBaseline="central" fontWeight={900} fontSize={17} fill={m ? color : 'var(--ink)'}>
                {lig.label}
              </text>
            ) : (
              <>
                <circle cx={e.lx + (e.anchor === 'end' ? -14 : e.anchor === 'start' ? 14 : 0)} cy={e.ly} r={15} fill={activeSlots ? 'var(--primary-soft)' : 'var(--bg)'} stroke={color} strokeDasharray="4 3" strokeWidth={2} />
                <text x={e.lx + (e.anchor === 'end' ? -14 : e.anchor === 'start' ? 14 : 0)} y={e.ly + 1} textAnchor="middle" dominantBaseline="central" fill={color} fontWeight={900}>
                  ?
                </text>
              </>
            )}
            {/* área de toque maior */}
            {onSlot && <rect x={e.anchor === 'end' ? e.lx - 75 : e.anchor === 'start' ? e.lx - 5 : e.lx - 40} y={e.ly - 18} width={80} height={36} fill="transparent" />}
          </g>
        );
      })}
    </svg>
  );
}
