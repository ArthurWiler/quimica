// Ponte com o OpenChemLib: ler SMILES do gabarito, gerar forma canônica, fórmula, coordenadas e R/S.
import { Molecule, CanonizerUtil } from 'openchemlib';
import { ATOMIC_NO, EL_FROM_NO, type Graph, type El } from './graph';

export function graphToMolecule(g: Graph): Molecule {
  const m = new Molecule(g.atoms.length, g.bonds.length);
  const idx = new Map<number, number>();
  for (const a of g.atoms) {
    const i = m.addAtom(ATOMIC_NO[a.el]);
    if (a.charge) m.setAtomCharge(i, a.charge);
    m.setAtomX(i, a.x / 40);
    m.setAtomY(i, a.y / 40);
    idx.set(a.id, i);
  }
  for (const b of g.bonds) {
    const i = m.addBond(idx.get(b.a)!, idx.get(b.b)!);
    m.setBondOrder(i, b.order);
  }
  return m;
}

/** Forma canônica sem estereoquímica: duas moléculas iguais => mesmo texto. */
export function canonicalOfGraph(g: Graph): string {
  return CanonizerUtil.getIDCode(graphToMolecule(g), CanonizerUtil.NOSTEREO);
}

const cache = new Map<string, string>();
export function canonicalOfSmiles(smiles: string): string {
  let c = cache.get(smiles);
  if (!c) {
    c = CanonizerUtil.getIDCode(Molecule.fromSmiles(smiles), CanonizerUtil.NOSTEREO);
    cache.set(smiles, c);
  }
  return c;
}

/** Forma canônica COM estereoquímica (para comparar enantiômeros). */
export function stereoCanonical(smiles: string): string {
  return Molecule.fromSmiles(smiles).getIDCode();
}

export function formulaOfSmiles(smiles: string): string {
  return Molecule.fromSmiles(smiles).getMolecularFormula().formula;
}

/** Converte SMILES em grafo com coordenadas 2D (escala em px). */
export function smilesToGraph(smiles: string, scale = 40): Graph {
  const m = Molecule.fromSmiles(smiles);
  m.ensureHelperArrays(Molecule.cHelperNeighbours);
  const atoms = [];
  for (let i = 0; i < m.getAllAtoms(); i++) {
    const el = (EL_FROM_NO[m.getAtomicNo(i)] ?? 'C') as El;
    atoms.push({ id: i, el, charge: m.getAtomCharge(i), x: m.getAtomX(i) * scale, y: m.getAtomY(i) * scale });
  }
  const bonds = [];
  for (let i = 0; i < m.getAllBonds(); i++) {
    const o = Math.min(3, Math.max(1, m.getBondOrder(i))) as 1 | 2 | 3;
    bonds.push({ a: m.getBondAtom(0, i), b: m.getBondAtom(1, i), order: o });
  }
  return { atoms, bonds };
}

/** R/S de um átomo de um SMILES com estereoquímica (@/@@). */
export function cipOfAtom(smiles: string, atomIndex: number): 'R' | 'S' | null {
  const m = Molecule.fromSmiles(smiles);
  m.ensureHelperArrays(Molecule.cHelperCIP);
  const p = m.getAtomCIPParity(atomIndex);
  if (p === Molecule.cAtomCIPParityRorM) return 'R';
  if (p === Molecule.cAtomCIPParitySorP) return 'S';
  return null;
}

/** Átomos estereogênicos (carbonos quirais) de um SMILES sem estereo. */
export function stereoCenters(smiles: string): number[] {
  const m = Molecule.fromSmiles(smiles);
  m.ensureHelperArrays(Molecule.cHelperParities);
  const out: number[] = [];
  for (let i = 0; i < m.getAtoms(); i++) if (m.isAtomStereoCenter(i)) out.push(i);
  return out;
}
