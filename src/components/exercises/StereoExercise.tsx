import { useState } from 'react';
import type { StereoEx } from '../../data/types';
import type { ExProps } from './types';
import { type Ligand, type Slot, SLOTS, rsOfPlacement } from '../../chem/stereo';
import { Tetra } from '../Tetra';

export function correctPlacement(ex: StereoEx): Record<Slot, Ligand> {
  // menor prioridade em cima (para trás), as outras nas cunhas/baixo
  const byId = (id: string) => ex.ligantes.find((l) => l.id === id)!;
  const [p1, p2, p3, p4] = ex.prioridade.map(byId);
  const a: Record<Slot, Ligand> = { T: p4, L: p1, R: p2, B: p3 };
  if (rsOfPlacement(a) === ex.alvo) return a;
  return { T: p4, L: p2, R: p1, B: p3 };
}

export function StereoExercise({ ex, locked, revealed, submit }: ExProps<StereoEx>) {
  const [place, setPlace] = useState<Partial<Record<Slot, Ligand>>>({});
  const [selLig, setSelLig] = useState<string | null>(null);
  const [tries, setTries] = useState(0);
  const usedIds = Object.values(place).map((l) => l!.id);

  const onSlot = (s: Slot) => {
    if (locked) return;
    if (place[s]) {
      const np = { ...place };
      delete np[s];
      setPlace(np);
      return;
    }
    const lig = ex.ligantes.find((l) => l.id === selLig) ?? ex.ligantes.find((l) => !usedIds.includes(l.id));
    if (!lig || usedIds.includes(lig.id)) return;
    setPlace({ ...place, [s]: lig });
    setSelLig(null);
  };

  const check = () => {
    if (SLOTS.some((s) => !place[s])) return submit({ ok: false, messages: ['Coloca os 4 ligantes nas 4 posições primeiro 🙂'], semTentativa: true });
    const rs = rsOfPlacement(place as Record<Slot, Ligand>);
    if (rs === ex.alvo) return submit({ ok: true, messages: [] });
    const t = tries + 1;
    setTries(t);
    const prio = ex.prioridade.map((id) => ex.ligantes.find((l) => l.id === id)!.label).join(' > ');
    const msgs = [`Do jeito que você montou, dá **${rs}**, mas o pedido é **${ex.alvo}**.`, 'Truque: trocar **dois** ligantes de lugar inverte R ↔ S.'];
    if (t >= 2) msgs.push(`Prioridades: ${prio}. Coloca o de menor prioridade no tracejado (pra trás) e vê se 1→2→3 gira no sentido do relógio (R) ou contra (S).`);
    submit({ ok: false, messages: msgs });
  };

  const shown = revealed ? correctPlacement(ex) : place;

  return (
    <div className="tetra-wrap">
      <Tetra place={shown} onSlot={locked ? undefined : onSlot} activeSlots={!!selLig} width={260} />
      {!locked && (
        <>
          <div className="small" style={{ textAlign: 'center' }}>
            Escolhe um ligante e toca numa posição <b>?</b>. Toque num ligante já colocado pra tirar.
          </div>
          <div className="lig-tray">
            {ex.ligantes.map((l) => (
              <button
                key={l.id}
                className={'lig' + (selLig === l.id ? ' sel' : '') + (usedIds.includes(l.id) ? ' used' : '')}
                disabled={usedIds.includes(l.id)}
                onClick={() => setSelLig(selLig === l.id ? null : l.id)}
              >
                {l.label}
              </button>
            ))}
          </div>
          <div className="tiny" style={{ textAlign: 'center', marginBottom: 6 }}>
            ▲ tracejado = vai pra trás do papel · ◀ ▶ cunha cheia = vem pra frente · ▼ linha = no plano
          </div>
          <button className="btn primary big" onClick={check}>
            Conferir ✔️
          </button>
        </>
      )}
      {revealed && <div className="small">Uma resposta certa (existem outras: é só girar a molécula).</div>}
    </div>
  );
}
