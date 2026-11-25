import { useMemo, useState } from 'react';
import type { BuildEx, PieceKind } from '../../data/types';
import type { ExProps } from './types';
import { type Graph, emptyGraph } from '../../chem/graph';
import { smilesToGraph } from '../../chem/ocl';
import { detectGroups } from '../../chem/groups';
import { diagnose, diagnoseOpen } from '../../chem/compare';
import { MoleculeBuilder } from '../MoleculeBuilder';
import { MoleculeView } from '../MoleculeView';

export function answerPieces(smiles: string): Partial<Record<PieceKind, number>> {
  const g = smilesToGraph(smiles);
  const rings = detectGroups(g).filter((h) => h.group === 'anel aromático').length;
  const p: Partial<Record<PieceKind, number>> = {};
  for (const a of g.atoms) {
    const k: PieceKind = a.el === 'O' && a.charge === -1 ? 'O-' : a.el === 'Na' ? 'Na+' : a.el === 'K' ? 'K+' : (a.el as PieceKind);
    p[k] = (p[k] ?? 0) + 1;
  }
  if (rings) {
    p.benzeno = rings;
    p.C = (p.C ?? 0) - 6 * rings;
  }
  return p;
}

export function BuildExercise({ ex, locked, revealed, submit }: ExProps<BuildEx>) {
  const [graph, setGraph] = useState<Graph>(emptyGraph);
  const [highlight, setHighlight] = useState<number[]>([]);
  const pieces = useMemo(() => {
    if (ex.livre) return 'livre' as const;
    const p = answerPieces(ex.smiles);
    for (const [k, v] of Object.entries(ex.extras ?? {})) p[k as PieceKind] = (p[k as PieceKind] ?? 0) + (v ?? 0);
    return p;
  }, [ex]);

  const check = () => {
    if (!graph.atoms.length) return submit({ ok: false, messages: ['Monta a molécula primeiro 🙂'], semTentativa: true });
    const v = ex.aberta ? diagnoseOpen(graph, ex.smiles, ex.aberta.grupo) : diagnose(graph, ex.smiles, ex.erros);
    setHighlight(v.highlight);
    submit(v);
  };

  return (
    <div>
      <MoleculeBuilder
        graph={graph}
        onChange={(g) => {
          setGraph(g);
          setHighlight([]);
        }}
        pieces={pieces}
        highlight={highlight}
        disabled={locked}
      />
      {!locked && (
        <button className="btn primary big" style={{ marginTop: 12 }} onClick={check}>
          Conferir ✔️
        </button>
      )}
      {revealed && (
        <div className="card" style={{ marginTop: 12, background: 'var(--ok-soft)' }}>
          <b>{ex.aberta ? 'Um exemplo de resposta certa:' : 'Resposta:'}</b>
          <div className="mols" style={{ marginTop: 8 }}>
            <div className="mol-box">
              <MoleculeView smiles={ex.smiles} completo maxWidth={300} />
              <div className="legenda">com todos os C e H</div>
            </div>
            <div className="mol-box">
              <MoleculeView smiles={ex.smiles} maxWidth={260} />
              <div className="legenda">em bastão (zigue-zague)</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
