// Modelo simples de molécula: átomos + ligações. Os H ficam implícitos (calculados pela valência).

export type El = 'C' | 'O' | 'N' | 'Cl' | 'Br' | 'F' | 'I' | 'S' | 'Na' | 'K' | 'B' | 'H';

export interface Atom {
  id: number;
  el: El;
  charge: number;
  x: number;
  y: number;
  /** id do template (anel benzênico) de onde o átomo veio */
  tpl?: number;
}

export interface Bond {
  a: number; // id do átomo
  b: number; // id do átomo
  order: 1 | 2 | 3;
}

export interface Graph {
  atoms: Atom[];
  bonds: Bond[];
}

export const ATOMIC_NO: Record<El, number> = {
  H: 1, B: 5, C: 6, N: 7, O: 8, F: 9, Na: 11, S: 16, Cl: 17, K: 19, Br: 35, I: 53,
};

export const EL_FROM_NO: Record<number, El> = Object.fromEntries(
  Object.entries(ATOMIC_NO).map(([k, v]) => [v, k as El]),
) as Record<number, El>;

/** Quantas "mãozinhas" (ligações) o átomo faz. */
export function valence(el: El, charge = 0): number {
  if (el === 'Na' || el === 'K') return charge === 1 ? 0 : 1;
  if (el === 'O' || el === 'S') return charge === -1 ? 1 : charge === 1 ? 3 : 2;
  if (el === 'N') return charge === 1 ? 4 : charge === -1 ? 2 : 3;
  if (el === 'C') return 4;
  if (el === 'B') return 3;
  return 1; // H, halogênios
}

export const EL_NAME: Record<El, string> = {
  C: 'carbono', O: 'oxigênio', N: 'nitrogênio', Cl: 'cloro', Br: 'bromo', F: 'flúor',
  I: 'iodo', S: 'enxofre', Na: 'sódio', K: 'potássio', B: 'boro', H: 'hidrogênio',
};

export function bondSum(g: Graph, id: number): number {
  let s = 0;
  for (const b of g.bonds) if (b.a === id || b.b === id) s += b.order;
  return s;
}

export function hCount(g: Graph, atom: Atom): number {
  if (atom.el === 'H') return 0;
  return Math.max(0, valence(atom.el, atom.charge) - bondSum(g, atom.id));
}

export function overValence(g: Graph, atom: Atom): boolean {
  return bondSum(g, atom.id) > valence(atom.el, atom.charge);
}

export function neighbors(g: Graph, id: number): { atom: Atom; order: number }[] {
  const out: { atom: Atom; order: number }[] = [];
  for (const b of g.bonds) {
    const other = b.a === id ? b.b : b.b === id ? b.a : null;
    if (other === null) continue;
    const atom = g.atoms.find((a) => a.id === other);
    if (atom) out.push({ atom, order: b.order });
  }
  return out;
}

export function findBond(g: Graph, a: number, b: number): Bond | undefined {
  return g.bonds.find((x) => (x.a === a && x.b === b) || (x.a === b && x.b === a));
}

/** Contagem de elementos incluindo H implícitos. */
export function formulaCounts(g: Graph): Record<string, number> {
  const c: Record<string, number> = {};
  for (const a of g.atoms) {
    c[a.el] = (c[a.el] ?? 0) + 1;
    const h = hCount(g, a);
    if (h) c.H = (c.H ?? 0) + h;
  }
  return c;
}

const SUB = '₀₁₂₃₄₅₆₇₈₉';
export function sub(n: number): string {
  return String(n).split('').map((d) => SUB[+d]).join('');
}

/** Fórmula molecular em ordem de Hill (C, H, depois alfabético). */
export function formulaString(counts: Record<string, number>, pretty = true): string {
  const keys = Object.keys(counts).filter((k) => counts[k] > 0);
  const order = counts.C ? ['C', 'H', ...keys.filter((k) => k !== 'C' && k !== 'H').sort()] : keys.sort();
  return order
    .filter((k) => counts[k])
    .map((k) => k + (counts[k] > 1 ? (pretty ? sub(counts[k]) : counts[k]) : ''))
    .join('');
}

/** Componentes conectados (lista de listas de ids). */
export function components(g: Graph): number[][] {
  const seen = new Set<number>();
  const out: number[][] = [];
  for (const a of g.atoms) {
    if (seen.has(a.id)) continue;
    const comp: number[] = [];
    const stack = [a.id];
    seen.add(a.id);
    while (stack.length) {
      const cur = stack.pop()!;
      comp.push(cur);
      for (const n of neighbors(g, cur)) {
        if (!seen.has(n.atom.id)) {
          seen.add(n.atom.id);
          stack.push(n.atom.id);
        }
      }
    }
    out.push(comp);
  }
  return out;
}

/** Maior sequência de carbonos ligados (a "cobrinha"). */
export function longestCarbonChain(g: Graph): number[] {
  const carbons = g.atoms.filter((a) => a.el === 'C').map((a) => a.id);
  const adj = new Map<number, number[]>();
  for (const id of carbons) adj.set(id, neighbors(g, id).filter((n) => n.atom.el === 'C').map((n) => n.atom.id));
  let best: number[] = [];
  let budget = 200000; // proteção contra explosão combinatória
  const visit = (path: number[], seen: Set<number>) => {
    if (--budget < 0) return;
    if (path.length > best.length) best = [...path];
    const last = path[path.length - 1];
    for (const n of adj.get(last) ?? []) {
      if (seen.has(n)) continue;
      seen.add(n);
      path.push(n);
      visit(path, seen);
      path.pop();
      seen.delete(n);
    }
  };
  // só começa pelas pontas (ou por todos se não houver pontas, ex.: anel)
  const ends = carbons.filter((c) => (adj.get(c)?.length ?? 0) <= 1);
  for (const s of ends.length ? ends : carbons) visit([s], new Set([s]));
  return best;
}

export function emptyGraph(): Graph {
  return { atoms: [], bonds: [] };
}

export function cloneGraph(g: Graph): Graph {
  return { atoms: g.atoms.map((a) => ({ ...a })), bonds: g.bonds.map((b) => ({ ...b })) };
}

/** Rótulo do átomo com H implícitos: CH3, OH, NH2, O⁻, Na⁺ ... */
export function atomLabel(g: Graph, atom: Atom): { main: string; h: number; charge: string } {
  const h = hCount(g, atom);
  const charge = atom.charge === 0 ? '' : atom.charge > 0 ? (atom.charge === 1 ? '+' : atom.charge + '+') : atom.charge === -1 ? '−' : -atom.charge + '−';
  return { main: atom.el, h, charge };
}
