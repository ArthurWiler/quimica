import { describe, it, expect } from 'vitest';
import type { Graph, El } from './graph';
import { diagnose } from './compare';
import { checkName, normalizeName } from './nameCheck';
import { rsOfPlacement, type Ligand } from './stereo';
import { detectGroups } from './groups';
import { smilesToGraph } from './ocl';

// helper: monta grafo a partir de lista de átomos e ligações
function G(atoms: (El | [El, number])[], bonds: [number, number, (1 | 2 | 3)?][]): Graph {
  return {
    atoms: atoms.map((a, i) => (Array.isArray(a) ? { id: i, el: a[0], charge: a[1], x: i * 40, y: 0 } : { id: i, el: a, charge: 0, x: i * 40, y: 0 })),
    bonds: bonds.map(([a, b, o]) => ({ a, b, order: o ?? 1 })),
  };
}

describe('compare', () => {
  it('2,3-epoxibutano montado bate com o SMILES', () => {
    const g = G(['C', 'C', 'C', 'C', 'O'], [[0, 1], [1, 2], [2, 3], [1, 4], [2, 4]]);
    expect(diagnose(g, 'CC1OC1C').ok).toBe(true);
  });

  it('éter no lugar de cetona gera mensagem de grupo', () => {
    // butanona pedida, montou metoxipropano? usa C-O-C com mesma fórmula? -> metoxipropeno não; usa éter genérico
    const g = G(['C', 'C', 'O', 'C', 'C'], [[0, 1], [1, 2], [2, 3], [3, 4]]); // etoxietano C4H10O
    const v = diagnose(g, 'CCC(=O)C'); // butanona C4H8O
    expect(v.ok).toBe(false);
    expect(v.messages.join(' ')).toMatch(/cetona/);
    expect(v.messages.join(' ')).toMatch(/éter/);
  });

  it('benzeno com duplas trocadas continua batendo', () => {
    const g = G(['C', 'C', 'C', 'C', 'C', 'C', 'C'], [[0, 1, 1], [1, 2, 2], [2, 3, 1], [3, 4, 2], [4, 5, 1], [5, 0, 2], [0, 6]]);
    expect(diagnose(g, 'Cc1ccccc1').ok).toBe(true);
    expect(diagnose(g, 'CC1=CC=CC=C1').ok).toBe(true);
  });

  it('valência estourada', () => {
    const g = G(['C', 'C'], [[0, 1, 3]]);
    g.atoms.push({ id: 2, el: 'C', charge: 0, x: 0, y: 0 }, { id: 3, el: 'C', charge: 0, x: 0, y: 0 });
    g.bonds.push({ a: 0, b: 2, order: 1 }, { a: 0, b: 3, order: 1 });
    const v = diagnose(g, 'CC');
    expect(v.messages[0]).toMatch(/5 ligações/);
  });

  it('sal de sódio montado', () => {
    const g = G(['C', 'C', 'C', 'C', 'O', ['O', -1], ['Na', 1]], [[0, 1], [1, 2], [2, 3], [3, 4, 2], [3, 5]]);
    expect(diagnose(g, 'CCCC(=O)[O-].[Na+]').ok).toBe(true);
  });

  it('falta carbono', () => {
    const g = G(['C', 'C', 'C'], [[0, 1], [1, 2]]);
    expect(diagnose(g, 'CCCC').messages[0]).toMatch(/falta 1 C/);
  });

  it('isômero de posição', () => {
    const g = G(['C', 'C', 'C', 'C', 'C', 'O'], [[0, 1], [1, 2], [2, 3], [3, 4], [2, 5, 2]]); // pentan-3-ona
    const v = diagnose(g, 'CCCC(=O)C');
    expect(v.ok).toBe(false);
    expect(v.messages[0]).toMatch(/lugar errado|localizadores/);
  });
});

describe('grupos', () => {
  const groupsOf = (s: string) => detectGroups(smilesToGraph(s)).map((h) => h.group).sort();
  it('detecta funções', () => {
    expect(groupsOf('CCOC(=O)C')).toEqual(['éster']);
    expect(groupsOf('CC(=O)OC(=O)C')).toEqual(['anidrido']);
    expect(groupsOf('CC(=O)Cl')).toEqual(['cloreto de acila']);
    expect(groupsOf('CC(=O)N(C)C')).toEqual(['amida terciária']);
    expect(groupsOf('CCNC')).toEqual(['amina secundária']);
    expect(groupsOf('CC=O')).toEqual(['aldeído']);
    expect(groupsOf('C1CO1')).toEqual(['epóxido']);
    expect(groupsOf('OC1=CC=CC=C1')).toEqual(['anel aromático', 'fenol']);
    expect(groupsOf('CC(=O)O')).toEqual(['ácido carboxílico']);
  });
});

describe('nomes', () => {
  it('tolerância', () => {
    expect(normalizeName('Pentan-2-ona')).toBe(normalizeName('pentan 2 ona'));
    expect(checkName('2-metil-propan-1-ol', ['2-metilpropan-1-ol']).ok).toBe(true);
    expect(checkName('Ácido Etanóico', ['ácido etanoico']).ok).toBe(true);
  });
  it('sufixo errado', () => {
    const v = checkName('pentan-2-al', ['pentan-2-ona']);
    expect(v.ok).toBe(false);
    expect(v.messages.join(' ')).toMatch(/cetona/);
  });
  it('cadeia errada', () => {
    const v = checkName('butan-2-ona', ['pentan-2-ona']);
    expect(v.messages.join(' ')).toMatch(/Cobrinha/);
  });
  it('ramificação faltando', () => {
    const v = checkName('pentan-2-ona', ['4-metilpentan-2-ona']);
    expect(v.messages.join(' ')).toMatch(/metil/);
  });
});

describe('estereo', () => {
  const L = (label: string, smiles: string): Ligand => ({ id: label, label, smiles });
  it('slide VII a (H em cima, Br esq., F dir., Cl baixo) é S', () => {
    expect(rsOfPlacement({ T: L('H', '[H]'), L: L('Br', 'Br'), R: L('F', 'F'), B: L('Cl', 'Cl') })).toBe('S');
  });
  it('trocar dois ligantes inverte', () => {
    expect(rsOfPlacement({ T: L('H', '[H]'), L: L('F', 'F'), R: L('Br', 'Br'), B: L('Cl', 'Cl') })).toBe('R');
  });
});
