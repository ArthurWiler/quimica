// Montagem 3D com cunhas: 4 posições fixas em volta do carbono central.
//   T = cima (tracejado, vai para trás)
//   L = esquerda (cunha cheia, vem para frente)
//   R = direita (cunha cheia, vem para frente)
//   B = baixo (linha normal, no plano)
// Geometria (tetraedro): olhando a partir de T, L→R→B gira no sentido anti-horário,
// então o SMILES equivalente é [C@](T)(L)(R)B.
import { cipOfAtom } from './ocl';

export type Slot = 'T' | 'L' | 'R' | 'B';
export const SLOTS: Slot[] = ['T', 'L', 'R', 'B'];

export interface Ligand {
  id: string;
  label: string; // como aparece na tela (ex.: "CH₃", "OH", "C₂H₅")
  smiles: string; // fragmento começando pelo átomo ligado ao centro (ex.: "CC", "O", "[H]")
}

export function placementSmiles(place: Record<Slot, Ligand>): string {
  return `[C@](${place.T.smiles})(${place.L.smiles})(${place.R.smiles})${place.B.smiles}`;
}

export function rsOfPlacement(place: Record<Slot, Ligand>): 'R' | 'S' | null {
  return cipOfAtom(placementSmiles(place), 0);
}
