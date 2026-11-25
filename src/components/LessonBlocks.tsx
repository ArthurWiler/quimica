import type { Block } from '../data/types';
import { MoleculeView } from './MoleculeView';
import { Rich } from './Rich';
import { Tetra } from './Tetra';

export function LessonBlocks({ blocos }: { blocos: Block[] }) {
  return (
    <>
      {blocos.map((b, i) => {
        switch (b.t) {
          case 'p':
            return <p key={i}><Rich s={b.s} /></p>;
          case 'h':
            return <h3 key={i}><Rich s={b.s} /></h3>;
          case 'passo':
            return <div key={i} className="passo">{b.s.replace(/^\n/, '')}</div>;
          case 'dica':
            return <div key={i} className="dica"><span>💡</span><div><Rich s={b.s} /></div></div>;
          case 'atencao':
            return <div key={i} className="atencao"><span>⚠️</span><div><Rich s={b.s} /></div></div>;
          case 'lista':
            return <ul key={i}>{b.itens.map((it, k) => <li key={k}><Rich s={it} /></li>)}</ul>;
          case 'tabela':
            return (
              <div key={i} className="tab-wrap">
                <table className="tab">
                  <thead><tr>{b.head.map((h, k) => <th key={k}>{h}</th>)}</tr></thead>
                  <tbody>{b.rows.map((r, k) => <tr key={k}>{r.map((c, j) => <td key={j}><Rich s={c} /></td>)}</tr>)}</tbody>
                </table>
              </div>
            );
          case 'mol':
            return (
              <div key={i} className="mol-box">
                <MoleculeView smiles={b.smiles} completo={b.completo} maxWidth={320} />
                {b.legenda && <div className="legenda"><Rich s={b.legenda} /></div>}
              </div>
            );
          case 'mols':
            return (
              <div key={i} className="mols">
                {b.itens.map((m, k) => (
                  <div key={k} className="mol-box">
                    <MoleculeView smiles={m.smiles} completo={m.completo} maxWidth={220} />
                    <div className="legenda"><Rich s={m.legenda} /></div>
                  </div>
                ))}
              </div>
            );
          case 'tetra':
            return (
              <div key={i} className="mol-box">
                <Tetra place={b.place} width={220} />
                {b.legenda && <div className="legenda"><Rich s={b.legenda} /></div>}
              </div>
            );
        }
      })}
    </>
  );
}
