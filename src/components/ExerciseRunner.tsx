import { useState } from 'react';
import type { Exercise } from '../data/types';
import type { CheckResult } from './exercises/types';
import { BuildExercise } from './exercises/BuildExercise';
import { ChoiceExercise, NameExercise, NumberExercise, OrderExercise, PickExercise } from './exercises/SimpleExercises';
import { StereoExercise } from './exercises/StereoExercise';
import { Rich } from './Rich';
import { recordExercise } from '../progress';

const MAX = 3;
const YAY = ['Arrasou! 🎉', 'Isso aí! 💜', 'Mandou bem! ✨', 'Perfeito! 🧪', 'Acertou! 🚀', 'Show! 🌟'];
const PAPER: Record<Exercise['tipo'], string> = {
  build: '✏️ Desenha no papel primeiro. Depois monta aqui com as peças.',
  name: '✏️ Descobre o nome no papel primeiro. Depois digita aqui.',
  choice: '✏️ Pensa (ou rabisca no papel) antes de escolher.',
  order: '✏️ Rabisca no papel quem ganha de quem. Depois ordena aqui.',
  pick: '✏️ Olha com calma e marca no papel. Depois toca aqui.',
  number: '✏️ Faz a conta no papel. Depois digita o resultado.',
  stereo: '✏️ Desenha no papel e descobre as prioridades. Depois monta aqui.',
};

export function StepByStep({ passos }: { passos: string[] }) {
  return (
    <ol className="steps">
      {passos.map((p, i) => (
        <li key={i}>
          {p.split('```').map((part, k) =>
            k % 2 === 1 ? (
              <div key={k} className="passo">
                {part.replace(/^\n/, '').replace(/\n$/, '')}
              </div>
            ) : (
              <Rich key={k} s={part.trim()} />
            ),
          )}
        </li>
      ))}
    </ol>
  );
}

function Confetti() {
  const colors = ['#6d4aff', '#ff6bb5', '#18a058', '#f5a524', '#3e63dd'];
  return (
    <div className="confetti" aria-hidden>
      {Array.from({ length: 40 }, (_, i) => (
        <i
          key={i}
          style={{
            left: `${(i * 37) % 100}%`,
            background: colors[i % colors.length],
            animationDelay: `${(i % 10) * 0.05}s`,
            animationDuration: `${1.2 + (i % 5) * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
}

export function ExerciseRunner({ ex }: { ex: Exercise }) {
  const [tries, setTries] = useState(0);
  const [status, setStatus] = useState<'open' | 'ok' | 'fail'>('open');
  const [fb, setFb] = useState<CheckResult | null>(null);
  const [showSteps, setShowSteps] = useState(false);
  const [shake, setShake] = useState(0);
  const [yay] = useState(() => YAY[Math.floor(Math.random() * YAY.length)]);

  const submit = (r: CheckResult) => {
    if (status !== 'open') return;
    if (r.ok) {
      setStatus('ok');
      setFb(r);
      recordExercise(ex.id, { status: 'ok', tries: tries + 1 });
      return;
    }
    if (r.semTentativa) {
      setFb(r);
      return;
    }
    const t = tries + 1;
    setTries(t);
    setFb(r);
    setShake((s) => s + 1);
    if (t >= MAX) {
      setStatus('fail');
      setShowSteps(true);
      recordExercise(ex.id, { status: 'fail', tries: t });
    }
  };

  const locked = status !== 'open';
  const revealed = status === 'fail';
  const props = { locked, revealed, submit };

  let body;
  switch (ex.tipo) {
    case 'build': body = <BuildExercise ex={ex} {...props} />; break;
    case 'name': body = <NameExercise ex={ex} {...props} />; break;
    case 'choice': body = <ChoiceExercise ex={ex} {...props} />; break;
    case 'order': body = <OrderExercise ex={ex} {...props} />; break;
    case 'pick': body = <PickExercise ex={ex} {...props} />; break;
    case 'number': body = <NumberExercise ex={ex} {...props} />; break;
    case 'stereo': body = <StereoExercise ex={ex} {...props} />; break;
  }

  return (
    <div>
      {status === 'ok' && <Confetti />}
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 4 }}>
        <span className="level">NÍVEL {'●'.repeat(ex.nivel)}{'○'.repeat(5 - ex.nivel)}</span>
        <span className="hearts" title="tentativas">
          {Array.from({ length: MAX }, (_, i) => (i < MAX - tries ? '❤️' : '🤍')).join('')}
        </span>
      </div>
      <p className="enunciado">
        <Rich s={ex.enunciado} />
      </p>
      {status === 'open' && <div className="paper">{PAPER[ex.tipo]}</div>}
      {body}

      {fb && !fb.ok && (
        <div key={shake} className={'feedback bad' + (fb.semTentativa ? '' : ' shake')}>
          <h4>
            {fb.semTentativa
              ? 'Opa!'
              : status === 'fail'
                ? 'Não foi dessa vez. O que estava errado:'
                : `Ainda não… (sobra${MAX - tries > 1 ? 'm' : ''} ${MAX - tries} tentativa${MAX - tries > 1 ? 's' : ''})`}
          </h4>
          <ul>
            {fb.messages.slice(0, 3).map((m, i) => (
              <li key={i}>
                <Rich s={m} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {status === 'ok' && (
        <div className="feedback ok pop">
          <h4>{yay}</h4>
          <button className="btn ghost" style={{ padding: '4px 0' }} onClick={() => setShowSteps(!showSteps)}>
            {showSteps ? 'esconder explicação' : 'ver a explicação passo a passo'}
          </button>
        </div>
      )}

      {showSteps && (
        <div className="card" style={{ marginTop: 12, border: '2px solid var(--primary-soft)' }}>
          <h3 style={{ margin: '0 0 6px', fontWeight: 900 }}>🧭 Passo a passo</h3>
          <StepByStep passos={ex.passos} />
        </div>
      )}
    </div>
  );
}
