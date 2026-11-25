import { describe, it, expect } from 'vitest';
import { MODULES } from './modules';
import { formulaOfSmiles, smilesToGraph, canonicalOfSmiles, stereoCenters } from '../chem/ocl';
import { normalizeName, checkName } from '../chem/nameCheck';
import { rsOfPlacement } from '../chem/stereo';
import { detectGroups } from '../chem/groups';
import { diagnose, diagnoseOpen } from '../chem/compare';
import { correctPlacement } from '../components/exercises/StereoExercise';
import { answerPieces } from '../components/exercises/BuildExercise';
import type { Exercise } from './types';

function counts(f: string): Record<string, number> {
  const c: Record<string, number> = {};
  for (const m of f.matchAll(/([A-Z][a-z]?)(\d*)/g)) {
    if (!m[1]) continue;
    c[m[1]] = (c[m[1]] ?? 0) + (m[2] ? Number(m[2]) : 1);
  }
  return c;
}

const all: { mod: string; ex: Exercise }[] = MODULES.flatMap((m) => m.exercicios.map((ex) => ({ mod: m.id, ex })));

describe('gabarito', () => {
  it('tem 100+ exercícios e ids únicos', () => {
    expect(all.length).toBeGreaterThanOrEqual(100);
    const ids = all.map((a) => a.ex.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('toda lição referenciada existe e todo exercício tem passo a passo', () => {
    for (const m of MODULES) {
      const lids = new Set(m.licoes.map((l) => l.id));
      for (const ex of m.exercicios) {
        if (ex.licao) expect(lids.has(ex.licao), `${ex.id} -> ${ex.licao}`).toBe(true);
        expect(ex.passos.length, ex.id).toBeGreaterThan(0);
      }
    }
  });

  for (const { ex } of all) {
    it(`${ex.id} (${ex.tipo})`, () => {
      if ('formula' in ex && 'smiles' in ex && ex.smiles) {
        expect(counts(formulaOfSmiles(ex.smiles)), `fórmula de ${ex.id}`).toEqual(counts(ex.formula));
      }
      switch (ex.tipo) {
        case 'build': {
          const p = answerPieces(ex.smiles);
          for (const v of Object.values(p)) expect(v).toBeGreaterThanOrEqual(0);
          // a própria resposta, montada, passa
          const g = smilesToGraph(ex.smiles);
          if (ex.aberta) {
            expect(diagnoseOpen(g, ex.smiles, ex.aberta.grupo).ok).toBe(true);
          } else {
            expect(diagnose(g, ex.smiles).ok).toBe(true);
          }
          for (const e of ex.erros ?? []) {
            expect(e.msg.length).toBeGreaterThan(0);
            expect(canonicalOfSmiles(e.smiles), `erro comum igual à resposta em ${ex.id}`).not.toBe(canonicalOfSmiles(ex.smiles));
          }
          break;
        }
        case 'name': {
          expect(checkName(ex.aceitos[0], ex.aceitos).ok).toBe(true);
          for (const e of ex.erros ?? []) {
            expect(ex.aceitos.map(normalizeName)).not.toContain(normalizeName(e.name));
            expect(e.msg.length).toBeGreaterThan(0);
          }
          break;
        }
        case 'choice': {
          expect(ex.certa).toBeGreaterThanOrEqual(0);
          expect(ex.certa).toBeLessThan(ex.opcoes.length);
          if (ex.rsCheck) expect(rsOfPlacement(ex.tetras![0])).toBe(ex.rsCheck);
          if (ex.parCheck) {
            const a = rsOfPlacement(ex.tetras![0]);
            const b = rsOfPlacement(ex.tetras![1]);
            expect(a).not.toBeNull();
            expect(a === b ? 'mesmo' : 'enantiômeros').toBe(ex.parCheck);
          }
          if (ex.smiles) smilesToGraph(ex.smiles);
          break;
        }
        case 'order':
          expect(ex.itens.length).toBeGreaterThanOrEqual(2);
          for (const it of ex.itens) if (it.smiles) smilesToGraph(it.smiles);
          break;
        case 'pick': {
          const g = smilesToGraph(ex.smiles);
          for (const i of ex.alvo) expect(g.atoms[i]?.el, `${ex.id} alvo ${i}`).toBe(ex.alvoEl);
          if (ex.quiral) expect([...stereoCenters(ex.smiles)].sort()).toEqual([...ex.alvo].sort());
          break;
        }
        case 'number':
          if (ex.smiles) smilesToGraph(ex.smiles);
          break;
        case 'stereo': {
          // prioridades conferidas pelo OpenChemLib: menor atrás, 1-2-3 em L-R-B gira no sentido horário => R
          const byId = (id: string) => ex.ligantes.find((l) => l.id === id)!;
          const [p1, p2, p3, p4] = ex.prioridade.map(byId);
          expect(rsOfPlacement({ T: p4, L: p1, R: p2, B: p3 }), `prioridades de ${ex.id}`).toBe('R');
          expect(rsOfPlacement(correctPlacement(ex))).toBe(ex.alvo);
          break;
        }
      }
    });
  }

  it('grupos das questões abertas existem no exemplo', () => {
    for (const { ex } of all) {
      if (ex.tipo === 'build' && ex.aberta) {
        expect(detectGroups(smilesToGraph(ex.smiles)).map((h) => h.group)).toContain(ex.aberta.grupo);
      }
    }
  });

  it('moléculas e desenhos 3D das lições', () => {
    for (const m of MODULES) {
      for (const l of m.licoes) {
        for (const b of l.blocos) {
          if (b.t === 'mol') smilesToGraph(b.smiles);
          if (b.t === 'mols') b.itens.forEach((x) => smilesToGraph(x.smiles));
          if (b.t === 'tetra' && b.legenda) {
            const want = b.legenda.match(/\((R|S)\)/)?.[1];
            if (want) expect(rsOfPlacement(b.place), b.legenda).toBe(want);
          }
        }
      }
    }
  });
});
