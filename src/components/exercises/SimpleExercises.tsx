import { useMemo, useState } from 'react';
import type { ChoiceEx, NameEx, NumberEx, OrderEx, PickEx } from '../../data/types';
import type { ExProps } from './types';
import { checkName } from '../../chem/nameCheck';
import { MoleculeView } from '../MoleculeView';
import { Tetra } from '../Tetra';
import { Rich } from '../Rich';

function MolToggle({ smiles }: { smiles: string }) {
  const [full, setFull] = useState(false);
  return (
    <div className="mol-box" style={{ background: 'var(--bg)', borderRadius: 16, padding: 10 }}>
      <MoleculeView smiles={smiles} completo={full} maxWidth={340} />
      <button className="btn ghost" style={{ fontSize: 14, padding: '6px 10px' }} onClick={() => setFull(!full)}>
        {full ? '🦴 ver em bastão' : '🔍 mostrar todos os C e H'}
      </button>
    </div>
  );
}

// ---------- Nome ----------
export function NameExercise({ ex, locked, revealed, submit }: ExProps<NameEx>) {
  const [txt, setTxt] = useState('');
  const check = () => {
    if (!txt.trim()) return submit({ ok: false, messages: ['Digita o nome primeiro 🙂'], semTentativa: true });
    submit(checkName(txt, ex.aceitos, ex.erros));
  };
  return (
    <div>
      <MolToggle smiles={ex.smiles} />
      <div style={{ marginTop: 12 }}>
        <input
          className="name-input"
          placeholder="digita o nome aqui…"
          value={txt}
          disabled={locked}
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          onChange={(e) => setTxt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !locked && check()}
        />
        <div className="tiny" style={{ marginTop: 4 }}>
          Não precisa se preocupar com acento, maiúscula, espaço ou hífen.
        </div>
      </div>
      {!locked && (
        <button className="btn primary big" style={{ marginTop: 12 }} onClick={check}>
          Conferir ✔️
        </button>
      )}
      {revealed && (
        <div className="card" style={{ marginTop: 12, background: 'var(--ok-soft)' }}>
          <b>Resposta:</b> <span style={{ fontSize: 20, fontWeight: 900 }}>{ex.aceitos[0]}</span>
          {ex.aceitos.length > 1 && <div className="small">Também vale: {ex.aceitos.slice(1).join(' · ')}</div>}
        </div>
      )}
    </div>
  );
}

// ---------- Múltipla escolha ----------
export function ChoiceExercise({ ex, locked, revealed, submit }: ExProps<ChoiceEx>) {
  const [sel, setSel] = useState<number | null>(null);
  const [wrong, setWrong] = useState<number[]>([]);
  const check = () => {
    if (sel === null) return submit({ ok: false, messages: ['Escolhe uma opção 🙂'], semTentativa: true });
    if (sel === ex.certa) return submit({ ok: true, messages: [] });
    setWrong([...wrong, sel]);
    const why = ex.opcoes[sel].porque;
    submit({ ok: false, messages: [why ? why : 'Essa não é. Pensa de novo com calma!'] });
    setSel(null);
  };
  return (
    <div>
      {ex.smiles && <MolToggle smiles={ex.smiles} />}
      {ex.tetras && (
        <div className="row" style={{ justifyContent: 'center', margin: '8px 0' }}>
          {ex.tetras.map((t, i) => (
            <div key={i} style={{ flex: '1 1 160px', maxWidth: 240 }}>
              {ex.tetras!.length > 1 && <div className="order-label" style={{ textAlign: 'center' }}>{i === 0 ? 'A' : 'B'}</div>}
              <Tetra place={t} width={220} />
            </div>
          ))}
        </div>
      )}
      <div style={{ marginTop: 10 }}>
        {ex.opcoes.map((o, i) => {
          const isWrong = wrong.includes(i);
          const isRight = revealed || locked ? i === ex.certa : false;
          return (
            <button
              key={i}
              className={'choice' + (isRight ? ' right' : isWrong ? ' wrong' : sel === i ? ' sel' : '')}
              disabled={locked || isWrong}
              onClick={() => setSel(i)}
            >
              <Rich s={o.txt} />
              {(isWrong || (revealed && o.porque && i !== ex.certa)) && o.porque && <span className="why">{o.porque}</span>}
            </button>
          );
        })}
      </div>
      {!locked && (
        <button className="btn primary big" onClick={check}>
          Conferir ✔️
        </button>
      )}
    </div>
  );
}

// ---------- Ordenar ----------
function shuffled<T>(arr: T[], seed: string): T[] {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) | 0;
  const rnd = () => {
    h = (h * 1103515245 + 12345) & 0x7fffffff;
    return h / 0x7fffffff;
  };
  for (let attempt = 0; attempt < 10; attempt++) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    if (a.some((x, i) => x !== arr[i])) return a;
  }
  return [...arr].reverse();
}

export function OrderExercise({ ex, locked, revealed, submit }: ExProps<OrderEx>) {
  const initial = useMemo(() => shuffled(ex.itens.map((_, i) => i), ex.id), [ex]);
  const [order, setOrder] = useState<number[]>(initial);
  const [marks, setMarks] = useState<boolean[] | null>(null);
  const show = revealed ? ex.itens.map((_, i) => i) : order;

  const move = (pos: number, d: number) => {
    const np = pos + d;
    if (np < 0 || np >= order.length) return;
    const o = [...order];
    [o[pos], o[np]] = [o[np], o[pos]];
    setOrder(o);
    setMarks(null);
  };
  const check = () => {
    const m = order.map((v, i) => v === i);
    setMarks(m);
    const nRight = m.filter(Boolean).length;
    if (nRight === order.length) return submit({ ok: true, messages: [] });
    const msgs = [`${nRight} de ${order.length} estão no lugar certo (os verdes).`];
    // aponta o primeiro par invertido
    for (let i = 0; i < order.length - 1; i++) {
      if (order[i] > order[i + 1]) {
        const a = ex.itens[order[i]].txt;
        const b = ex.itens[order[i + 1]].txt;
        msgs.push(`Olha esse par: **${a}** está antes de **${b}**, mas deveria vir depois.`);
        break;
      }
    }
    submit({ ok: false, messages: msgs });
  };

  return (
    <div>
      <div className="order-label">⬆ {ex.de}</div>
      {show.map((idx, pos) => {
        const it = ex.itens[idx];
        const mk = revealed ? 'right' : marks ? (marks[pos] ? 'right' : 'wrong') : '';
        return (
          <div key={idx} className={'order-item ' + mk}>
            <span className="pos">{pos + 1}</span>
            <span className="txt">
              <Rich s={it.txt} />
              {revealed && it.porque && <span className="why small" style={{ display: 'block', fontWeight: 600 }}>{it.porque}</span>}
            </span>
            {it.smiles && (
              <span style={{ width: 90, flex: 'none' }}>
                <MoleculeView smiles={it.smiles} maxWidth={90} scale={22} />
              </span>
            )}
            {!locked && (
              <span className="arrows">
                <button onClick={() => move(pos, -1)} aria-label="subir">▲</button>
                <button onClick={() => move(pos, 1)} aria-label="descer">▼</button>
              </span>
            )}
          </div>
        );
      })}
      <div className="order-label">⬇ {ex.ate}</div>
      {!locked && (
        <button className="btn primary big" style={{ marginTop: 8 }} onClick={check}>
          Conferir ✔️
        </button>
      )}
    </div>
  );
}

// ---------- Tocar nos átomos ----------
export function PickExercise({ ex, locked, revealed, submit }: ExProps<PickEx>) {
  const [sel, setSel] = useState<number[]>([]);
  const [marks, setMarks] = useState<Record<number, 'ok' | 'bad' | 'missed'>>({});
  const toggle = (id: number) => {
    setMarks({});
    setSel(sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id]);
  };
  const check = () => {
    if (!sel.length) return submit({ ok: false, messages: ['Toca em algum átomo do desenho 🙂'], semTentativa: true });
    const right = sel.filter((x) => ex.alvo.includes(x));
    const wrongs = sel.filter((x) => !ex.alvo.includes(x));
    const missing = ex.alvo.filter((x) => !sel.includes(x));
    const mk: Record<number, 'ok' | 'bad'> = {};
    right.forEach((x) => (mk[x] = 'ok'));
    wrongs.forEach((x) => (mk[x] = 'bad'));
    setMarks(mk);
    if (!wrongs.length && !missing.length) return submit({ ok: true, messages: [] });
    const msgs: string[] = [];
    if (right.length) msgs.push(`${right.length} certo${right.length > 1 ? 's' : ''} (verde).`);
    if (wrongs.length) msgs.push(`${wrongs.length} que não é (vermelho).`);
    if (missing.length) msgs.push(`Ainda falta${missing.length > 1 ? 'm' : ''} ${missing.length}.`);
    submit({ ok: false, messages: [msgs.join(' ')] });
  };
  const revealMarks: Record<number, 'ok' | 'bad' | 'missed'> = {};
  if (revealed) ex.alvo.forEach((x) => (revealMarks[x] = 'ok'));
  return (
    <div>
      <div className="mol-box" style={{ background: 'var(--bg)', borderRadius: 16, padding: 10 }}>
        <MoleculeView
          smiles={ex.smiles}
          completo={ex.completo}
          maxWidth={380}
          pick={{ selected: revealed ? [] : sel, onToggle: toggle, marks: revealed ? revealMarks : marks, disabled: locked }}
        />
        <div className="tiny">Toque nos átomos (as pontas e curvas do zigue-zague são carbonos).</div>
      </div>
      {!locked && (
        <button className="btn primary big" style={{ marginTop: 12 }} onClick={check}>
          Conferir ✔️
        </button>
      )}
      {revealed && <div className="small" style={{ marginTop: 8 }}>Os átomos certos estão marcados em verde.</div>}
    </div>
  );
}

// ---------- Número ----------
export function NumberExercise({ ex, locked, revealed, submit }: ExProps<NumberEx>) {
  const [txt, setTxt] = useState('');
  const check = () => {
    const v = parseFloat(txt.replace(',', '.').replace(/[^\d.+-]/g, ''));
    if (isNaN(v)) return submit({ ok: false, messages: ['Digita um número 🙂'], semTentativa: true });
    if (Math.abs(v - ex.resposta) <= ex.tol) return submit({ ok: true, messages: [] });
    for (const e of ex.erros ?? []) if (Math.abs(v - e.valor) <= (e.tol ?? ex.tol)) return submit({ ok: false, messages: [e.msg] });
    const msgs: string[] = [];
    if (ex.resposta !== 0 && Math.abs(v + ex.resposta) <= ex.tol) msgs.push('O número está certo, mas o **sinal** não! Pensa: é + ou −?');
    else if (ex.resposta !== 0 && (Math.abs(v * 100 - ex.resposta) <= ex.tol * 2 || Math.abs(v / 100 - ex.resposta) <= ex.tol)) msgs.push('Parece coisa de **porcentagem**: confere se precisa multiplicar ou dividir por 100.');
    else msgs.push(v > ex.resposta ? 'Deu **maior** que a resposta. Refaz a conta com calma.' : 'Deu **menor** que a resposta. Refaz a conta com calma.');
    submit({ ok: false, messages: msgs });
  };
  return (
    <div>
      {ex.smiles && <MolToggle smiles={ex.smiles} />}
      <div className="row" style={{ marginTop: 12, flexWrap: 'nowrap' }}>
        <input
          className="num-input"
          inputMode="decimal"
          placeholder="resposta"
          value={txt}
          disabled={locked}
          onChange={(e) => setTxt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !locked && check()}
        />
        {ex.unidade && <b style={{ fontSize: 20 }}>{ex.unidade}</b>}
      </div>
      {!locked && (
        <button className="btn primary big" style={{ marginTop: 12 }} onClick={check}>
          Conferir ✔️
        </button>
      )}
      {revealed && (
        <div className="card" style={{ marginTop: 12, background: 'var(--ok-soft)' }}>
          <b>Resposta:</b> <span style={{ fontSize: 22, fontWeight: 900 }}>{String(ex.resposta).replace('.', ',')}{ex.unidade ? ' ' + ex.unidade : ''}</span>
        </div>
      )}
    </div>
  );
}
