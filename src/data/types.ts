import type { CommonMistake } from '../chem/compare';
import type { Group } from '../chem/groups';
import type { Ligand, Slot } from '../chem/stereo';

export type Nivel = 1 | 2 | 3 | 4 | 5;

export type PieceKind = 'C' | 'O' | 'N' | 'Cl' | 'Br' | 'F' | 'I' | 'S' | 'O-' | 'Na+' | 'K+' | 'benzeno';

interface Base {
  id: string;
  nivel: Nivel;
  enunciado: string;
  /** passo a passo mostrado depois de 3 erros (estilo "ache a cobrinha...") */
  passos: string[];
  /** id da lição para o botão "revisar isso" */
  licao?: string;
}

export interface BuildEx extends Base {
  tipo: 'build';
  smiles: string;
  formula: string; // dupla checagem do gabarito (Hill, sem índices: C4H8O)
  /** peças extras (pegadinha) além das necessárias */
  extras?: Partial<Record<PieceKind, number>>;
  /** bandeja livre (todas as peças, sem limite) */
  livre?: boolean;
  erros?: CommonMistake[];
  /** aceita qualquer molécula com essa fórmula e esse grupo (questões abertas) */
  aberta?: { grupo: Group };
}

export interface NameEx extends Base {
  tipo: 'name';
  smiles: string;
  formula: string;
  aceitos: string[];
  erros?: { name: string; msg: string }[];
}

export interface ChoiceEx extends Base {
  tipo: 'choice';
  opcoes: { txt: string; porque?: string }[];
  certa: number;
  smiles?: string;
  /** desenhos 3D (cunhas) para mostrar no enunciado */
  tetras?: Record<Slot, Ligand>[];
  /** só para o teste do gabarito: R/S esperado do tetras[0] */
  rsCheck?: 'R' | 'S';
  /** só para o teste do gabarito: relação esperada entre tetras[0] e tetras[1] */
  parCheck?: 'enantiômeros' | 'mesmo';
}

export interface OrderEx extends Base {
  tipo: 'order';
  /** itens JÁ na ordem certa */
  itens: { txt: string; smiles?: string; porque?: string }[];
  de: string; // rótulo do começo (ex.: "menor PE")
  ate: string; // rótulo do fim (ex.: "maior PE")
}

export interface PickEx extends Base {
  tipo: 'pick';
  smiles: string;
  formula: string;
  alvo: number[]; // índices dos átomos no SMILES
  alvoEl: string; // elemento esperado dos alvos (checagem do gabarito)
  quiral?: boolean; // alvo = todos os carbonos quirais (checado no teste)
  completo?: boolean; // desenhar com todos os C e H
}

export interface NumberEx extends Base {
  tipo: 'number';
  resposta: number;
  tol: number;
  unidade?: string;
  smiles?: string;
  erros?: { valor: number; tol?: number; msg: string }[];
}

export interface StereoEx extends Base {
  tipo: 'stereo';
  ligantes: [Ligand, Ligand, Ligand, Ligand];
  alvo: 'R' | 'S';
  /** ids dos ligantes da maior para a menor prioridade */
  prioridade: [string, string, string, string];
}

export type Exercise = BuildEx | NameEx | ChoiceEx | OrderEx | PickEx | NumberEx | StereoEx;

export type Block =
  | { t: 'p'; s: string }
  | { t: 'h'; s: string }
  | { t: 'mol'; smiles: string; legenda?: string; completo?: boolean }
  | { t: 'mols'; itens: { smiles: string; legenda: string; completo?: boolean }[] }
  | { t: 'passo'; s: string }
  | { t: 'dica'; s: string }
  | { t: 'atencao'; s: string }
  | { t: 'tabela'; head: string[]; rows: string[][] }
  | { t: 'lista'; itens: string[] }
  | { t: 'tetra'; place: Record<Slot, Ligand>; legenda?: string };

export interface Lesson {
  id: string;
  titulo: string;
  blocos: Block[];
}

export interface Module {
  id: string;
  titulo: string;
  emoji: string;
  cor: string;
  descricao: string;
  licoes: Lesson[];
  exercicios: Exercise[];
}
