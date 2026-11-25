// Detecta grupos funcionais num grafo (H implícitos).
import { type Graph, type Atom, neighbors, hCount } from './graph';

export type Group =
  | 'ácido carboxílico'
  | 'sal de ácido carboxílico'
  | 'éster'
  | 'anidrido'
  | 'cloreto de acila'
  | 'amida primária'
  | 'amida secundária'
  | 'amida terciária'
  | 'aldeído'
  | 'cetona'
  | 'álcool'
  | 'fenol'
  | 'éter'
  | 'epóxido'
  | 'amina primária'
  | 'amina secundária'
  | 'amina terciária'
  | 'haleto'
  | 'anel aromático'
  | 'ligação dupla C=C'
  | 'ligação tripla C≡C';

export const GROUP_EXPLAIN: Record<Group, string> = {
  'ácido carboxílico': 'C=O com um OH no mesmo carbono (–COOH)',
  'sal de ácido carboxílico': 'C=O com um O⁻ no mesmo carbono, e o cátion (Na⁺/K⁺) do lado (–COO⁻ Na⁺)',
  'éster': 'C=O com um O ligado a outro carbono (–COO–C)',
  'anidrido': 'dois C=O ligados pelo mesmo O no meio (–CO–O–CO–)',
  'cloreto de acila': 'C=O com um Cl no mesmo carbono (–COCl)',
  'amida primária': 'C=O ligado a um NH₂',
  'amida secundária': 'C=O ligado a um NH que tem mais um carbono (–CO–NH–C)',
  'amida terciária': 'C=O ligado a um N com mais dois carbonos (–CO–N(C)–C)',
  'aldeído': 'C=O na PONTA da cadeia (o carbono do C=O tem um H)',
  'cetona': 'C=O no MEIO da cadeia (carbono do C=O ligado a dois carbonos)',
  'álcool': 'OH ligado num carbono comum (sem dupla)',
  'fenol': 'OH ligado direto no anel benzênico',
  'éter': 'O no meio de dois carbonos (C–O–C), sem C=O',
  'epóxido': 'O fazendo uma ponte entre dois carbonos vizinhos (triângulo C–C–O)',
  'amina primária': 'N com só um carbono (–NH₂)',
  'amina secundária': 'N com dois carbonos (–NH–)',
  'amina terciária': 'N com três carbonos e nenhum H',
  'haleto': 'halogênio (F, Cl, Br, I) ligado num carbono',
  'anel aromático': 'anel benzênico (6 C com duplas alternadas)',
  'ligação dupla C=C': 'carbono ligado em outro carbono com ligação dupla',
  'ligação tripla C≡C': 'carbono ligado em outro carbono com ligação tripla',
};

function isCarbonylC(g: Graph, a: Atom): boolean {
  return a.el === 'C' && neighbors(g, a.id).some((n) => n.atom.el === 'O' && n.order === 2);
}

function aromaticAtoms(g: Graph): Set<number> {
  // anéis de 6 carbonos com duplas alternadas
  const out = new Set<number>();
  const carbons = g.atoms.filter((a) => a.el === 'C');
  const adj = (id: number) => neighbors(g, id).filter((n) => n.atom.el === 'C');
  const ringFrom = (start: number) => {
    const path: { id: number; order: number }[] = [];
    const found: number[][] = [];
    const dfs = (cur: number, depth: number, prevOrder: number) => {
      if (found.length) return;
      for (const n of adj(cur)) {
        if (n.order === prevOrder) continue; // precisa alternar
        if (n.atom.id === start && depth === 6) {
          found.push(path.map((p) => p.id));
          return;
        }
        if (depth >= 6 || n.atom.id === start || path.some((p) => p.id === n.atom.id)) continue;
        path.push({ id: n.atom.id, order: n.order });
        dfs(n.atom.id, depth + 1, n.order);
        path.pop();
      }
    };
    path.push({ id: start, order: 0 });
    dfs(start, 1, 0);
    return found[0];
  };
  for (const c of carbons) {
    if (out.has(c.id)) continue;
    const r = ringFrom(c.id);
    if (r && r.length === 6) r.forEach((x) => out.add(x));
  }
  return out;
}

export interface GroupHit {
  group: Group;
  atoms: number[];
}

export function detectGroups(g: Graph): GroupHit[] {
  const hits: GroupHit[] = [];
  const used = new Set<number>(); // O/N já explicados por grupos carbonílicos
  const arom = aromaticAtoms(g);
  const byId = (id: number) => g.atoms.find((a) => a.id === id)!;

  // anéis aromáticos (conta por anel de 6)
  if (arom.size) {
    const rings = Math.max(1, Math.round(arom.size / 6));
    for (let i = 0; i < rings; i++) hits.push({ group: 'anel aromático', atoms: [...arom] });
  }

  // anidridos primeiro (O ligado a dois C=O)
  for (const o of g.atoms.filter((a) => a.el === 'O')) {
    const ns = neighbors(g, o.id);
    if (ns.length === 2 && ns.every((n) => n.order === 1 && isCarbonylC(g, n.atom))) {
      hits.push({ group: 'anidrido', atoms: [o.id, ...ns.map((n) => n.atom.id)] });
      used.add(o.id);
      ns.forEach((n) => {
        used.add(n.atom.id);
        neighbors(g, n.atom.id).forEach((x) => x.atom.el === 'O' && x.order === 2 && used.add(x.atom.id));
      });
    }
  }

  for (const c of g.atoms) {
    if (!isCarbonylC(g, c) || used.has(c.id)) continue;
    const ns = neighbors(g, c.id);
    const dblO = ns.find((n) => n.atom.el === 'O' && n.order === 2)!.atom;
    const others = ns.filter((n) => n.atom.id !== dblO.id);
    const singleO = others.find((n) => n.atom.el === 'O' && n.order === 1)?.atom;
    const n = others.find((x) => x.atom.el === 'N')?.atom;
    const cl = others.find((x) => ['Cl', 'Br', 'F', 'I'].includes(x.atom.el))?.atom;
    used.add(dblO.id);
    if (singleO) {
      used.add(singleO.id);
      const oNs = neighbors(g, singleO.id).filter((x) => x.atom.id !== c.id);
      if (singleO.charge === -1) hits.push({ group: 'sal de ácido carboxílico', atoms: [c.id, dblO.id, singleO.id] });
      else if (oNs.length === 0) hits.push({ group: 'ácido carboxílico', atoms: [c.id, dblO.id, singleO.id] });
      else hits.push({ group: 'éster', atoms: [c.id, dblO.id, singleO.id] });
    } else if (n) {
      used.add(n.id);
      const nC = neighbors(g, n.id).filter((x) => x.atom.el === 'C').length;
      const grp = nC <= 1 ? 'amida primária' : nC === 2 ? 'amida secundária' : 'amida terciária';
      hits.push({ group: grp, atoms: [c.id, dblO.id, n.id] });
    } else if (cl) {
      used.add(cl.id);
      hits.push({ group: 'cloreto de acila', atoms: [c.id, dblO.id, cl.id] });
    } else {
      const cNeighbors = others.filter((x) => x.atom.el === 'C').length;
      hits.push({ group: cNeighbors >= 2 ? 'cetona' : 'aldeído', atoms: [c.id, dblO.id] });
    }
  }

  for (const a of g.atoms) {
    if (used.has(a.id)) continue;
    const ns = neighbors(g, a.id);
    if (a.el === 'O' && a.charge === 0) {
      const cs = ns.filter((x) => x.atom.el === 'C');
      if (hCount(g, a) === 1 && cs.length === 1) {
        hits.push({ group: arom.has(cs[0].atom.id) ? 'fenol' : 'álcool', atoms: [a.id, cs[0].atom.id] });
      } else if (cs.length === 2) {
        const [x, y] = cs.map((q) => q.atom.id);
        const ring3 = neighbors(g, x).some((q) => q.atom.id === y);
        hits.push({ group: ring3 ? 'epóxido' : 'éter', atoms: [a.id, x, y] });
      }
    } else if (a.el === 'N' && a.charge === 0) {
      const cs = ns.filter((x) => x.atom.el === 'C').length;
      if (cs === 1) hits.push({ group: 'amina primária', atoms: [a.id] });
      else if (cs === 2) hits.push({ group: 'amina secundária', atoms: [a.id] });
      else if (cs === 3) hits.push({ group: 'amina terciária', atoms: [a.id] });
    } else if (['Cl', 'Br', 'F', 'I'].includes(a.el) && ns.some((x) => x.atom.el === 'C')) {
      hits.push({ group: 'haleto', atoms: [a.id] });
    }
  }

  for (const b of g.bonds) {
    const A = byId(b.a);
    const B = byId(b.b);
    if (A.el !== 'C' || B.el !== 'C') continue;
    if (arom.has(A.id) && arom.has(B.id)) continue;
    if (b.order === 2) hits.push({ group: 'ligação dupla C=C', atoms: [A.id, B.id] });
    if (b.order === 3) hits.push({ group: 'ligação tripla C≡C', atoms: [A.id, B.id] });
  }
  return hits;
}

export function groupCounts(hits: GroupHit[]): Map<Group, number> {
  const m = new Map<Group, number>();
  for (const h of hits) m.set(h.group, (m.get(h.group) ?? 0) + 1);
  return m;
}
