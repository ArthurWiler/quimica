import { useEffect, useState } from 'react';
import { MODULES } from './data/modules';
import { useProgress, markLesson, resetAll } from './progress';
import { ExerciseRunner } from './components/ExerciseRunner';
import { LessonBlocks } from './components/LessonBlocks';
import type { Module } from './data/types';

function useHash() {
  const [h, setH] = useState(() => window.location.hash.slice(1) || '/');
  useEffect(() => {
    const on = () => {
      setH(window.location.hash.slice(1) || '/');
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return h;
}

const go = (path: string) => (window.location.hash = path);

export default function App() {
  const h = useHash();
  const parts = h.split('/').filter(Boolean);
  const mod = parts[0] === 'm' ? MODULES.find((m) => m.id === parts[1]) : undefined;

  if (mod && parts[2] === 'licao') return <LessonPage mod={mod} idx={Number(parts[3]) || 0} />;
  if (mod && parts[2] === 'ex') return <ExercisePage mod={mod} idx={Number(parts[3]) || 0} />;
  if (mod) return <ModulePage mod={mod} />;
  return <Home />;
}

function TopBar({ title, back }: { title: string; back?: string }) {
  return (
    <div className="topbar">
      {back !== undefined && (
        <a className="icon-btn" href={'#' + back} aria-label="voltar" style={{ textDecoration: 'none' }}>
          ←
        </a>
      )}
      <div className="grow">
        <h1>{title}</h1>
      </div>
      <a className="icon-btn" href="#/" aria-label="início" style={{ textDecoration: 'none' }}>
        🏠
      </a>
    </div>
  );
}

function modStats(m: Module, ex: Record<string, { status: string }>) {
  const ok = m.exercicios.filter((e) => ex[e.id]?.status === 'ok').length;
  const done = m.exercicios.filter((e) => ex[e.id]).length;
  return { ok, done, total: m.exercicios.length };
}

function Home() {
  const p = useProgress();
  const total = MODULES.reduce((s, m) => s + m.exercicios.length, 0);
  const ok = MODULES.reduce((s, m) => s + modStats(m, p.ex).ok, 0);
  return (
    <div className="app">
      <div className="hero">
        <h1>Oi, Sofia! 🧪</h1>
        <p>Química orgânica do zero, no seu ritmo. Primeiro revisa a matéria, depois pratica. Cada exercício tem 3 tentativas. Se errar as 3, aparece o passo a passo.</p>
        <div className="row" style={{ marginTop: 14, gap: 10 }}>
          <div className="bar" style={{ flex: 1 }}>
            <i style={{ width: `${(ok / total) * 100}%` }} />
          </div>
          <b>{ok}/{total}</b>
        </div>
      </div>

      {MODULES.map((m, i) => {
        const s = modStats(m, p.ex);
        return (
          <div key={m.id} className="card module-card">
            <div className="emoji" style={{ background: m.cor + '22' }}>{m.emoji}</div>
            <div className="grow">
              <div className="tiny" style={{ fontWeight: 800 }}>PARTE {i}</div>
              <h2>{m.titulo}</h2>
              <p>{m.descricao}</p>
              <div className="row" style={{ marginBottom: 10 }}>
                <div className="bar" style={{ flex: 1 }}>
                  <i style={{ width: `${(s.ok / s.total) * 100}%` }} />
                </div>
                <span className="small">{s.ok}/{s.total}</span>
              </div>
              <div className="row">
                <a className="btn" href={`#/m/${m.id}/licao/0`}>📖 Revisar</a>
                <a className="btn primary" href={`#/m/${m.id}`}>✏️ Praticar</a>
              </div>
            </div>
          </div>
        );
      })}

      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <button
          className="btn ghost small"
          onClick={() => {
            if (confirm('Apagar todo o progresso e começar do zero?')) resetAll();
          }}
        >
          Recomeçar do zero
        </button>
      </div>
    </div>
  );
}

function ModulePage({ mod }: { mod: Module }) {
  const p = useProgress();
  const s = modStats(mod, p.ex);
  const firstOpen = mod.exercicios.findIndex((e) => p.ex[e.id]?.status !== 'ok');
  return (
    <div className="app">
      <TopBar title={`${mod.emoji} ${mod.titulo}`} back="/" />
      <div className="card">
        <h3 style={{ margin: '0 0 10px', fontWeight: 900 }}>📖 Revisão da matéria</h3>
        {mod.licoes.map((l, i) => (
          <a key={l.id} className="lesson-link" href={`#/m/${mod.id}/licao/${i}`}>
            <span>{i + 1}.</span> {l.titulo}
            {p.lessons[l.id] && <span className="check">✔</span>}
          </a>
        ))}
      </div>
      <div className="card">
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 10 }}>
          <h3 style={{ margin: 0, fontWeight: 900 }}>✏️ Exercícios</h3>
          <span className="small">{s.ok} de {s.total} certos</span>
        </div>
        <p className="small" style={{ marginTop: 0 }}>Começam bem fáceis e vão ficando mais difíceis. As bolinhas embaixo mostram o nível.</p>
        <div className="ex-grid">
          {mod.exercicios.map((e, i) => {
            const st = p.ex[e.id]?.status;
            return (
              <a key={e.id} className={'ex-dot ' + (st ?? '')} href={`#/m/${mod.id}/ex/${i}`}>
                {st === 'ok' ? '✔' : i + 1}
                <span className="lv">{'•'.repeat(e.nivel)}</span>
              </a>
            );
          })}
        </div>
        <div className="row small" style={{ marginTop: 12, gap: 14 }}>
          <span>🟩 acertou</span>
          <span>🟨 viu a resposta (dá pra tentar de novo)</span>
        </div>
      </div>
      <div className="bottom-nav">
        <div className="inner">
          <button className="btn primary big" onClick={() => go(`/m/${mod.id}/ex/${Math.max(0, firstOpen)}`)}>
            {firstOpen === -1 ? 'Tudo certo! Refazer 🔁' : s.done ? 'Continuar ▶' : 'Começar ▶'}
          </button>
        </div>
      </div>
    </div>
  );
}

function LessonPage({ mod, idx }: { mod: Module; idx: number }) {
  const l = mod.licoes[idx];
  useEffect(() => {
    if (l) markLesson(l.id);
  }, [l]);
  if (!l) return <ModulePage mod={mod} />;
  const last = idx === mod.licoes.length - 1;
  return (
    <div className="app">
      <TopBar title={`${mod.emoji} ${mod.titulo}`} back={`/m/${mod.id}`} />
      <div className="tiny" style={{ fontWeight: 800, marginBottom: 6 }}>
        REVISÃO {idx + 1} DE {mod.licoes.length}
      </div>
      <div className="card lesson">
        <h2>{l.titulo}</h2>
        <LessonBlocks blocos={l.blocos} />
      </div>
      <div className="bottom-nav">
        <div className="inner">
          {idx > 0 && (
            <button className="btn" onClick={() => go(`/m/${mod.id}/licao/${idx - 1}`)}>
              ◀ Anterior
            </button>
          )}
          {last ? (
            <button className="btn primary" onClick={() => go(`/m/${mod.id}/ex/0`)}>
              Bora praticar ✏️
            </button>
          ) : (
            <button className="btn primary" onClick={() => go(`/m/${mod.id}/licao/${idx + 1}`)}>
              Próxima ▶
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ExercisePage({ mod, idx }: { mod: Module; idx: number }) {
  const ex = mod.exercicios[idx];
  const [attempt, setAttempt] = useState(0);
  const p = useProgress();
  if (!ex) return <ModulePage mod={mod} />;
  const licaoIdx = ex.licao ? mod.licoes.findIndex((l) => l.id === ex.licao) : -1;
  const st = p.ex[ex.id]?.status;
  const modIdx = MODULES.indexOf(mod);
  const nextMod = MODULES[modIdx + 1];
  const isLast = idx === mod.exercicios.length - 1;
  return (
    <div className="app">
      <TopBar title={`${mod.emoji} Exercício ${idx + 1} de ${mod.exercicios.length}`} back={`/m/${mod.id}`} />
      <div className="row" style={{ marginBottom: 10 }}>
        <a className="btn" style={{ fontSize: 14, padding: '7px 12px' }} href={`#/m/${mod.id}/licao/${Math.max(0, licaoIdx)}`}>
          📖 revisar a matéria
        </a>
        {st && (
          <button className="btn ghost" style={{ fontSize: 14, padding: '7px 12px' }} onClick={() => setAttempt((a) => a + 1)}>
            🔁 tentar de novo do zero
          </button>
        )}
      </div>
      <div className="card">
        <ExerciseRunner key={ex.id + ':' + attempt} ex={ex} />
      </div>
      <div className="bottom-nav">
        <div className="inner">
          <button className="btn" disabled={idx === 0} onClick={() => go(`/m/${mod.id}/ex/${idx - 1}`)}>
            ◀
          </button>
          {isLast ? (
            nextMod ? (
              <button className="btn primary" onClick={() => go(`/m/${nextMod.id}/licao/0`)}>
                Próxima parte: {nextMod.emoji} ▶
              </button>
            ) : (
              <button className="btn primary" onClick={() => go('/')}>
                Fim! 🏆
              </button>
            )
          ) : (
            <button className="btn primary" onClick={() => go(`/m/${mod.id}/ex/${idx + 1}`)}>
              Próximo ▶
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
