// Compara a molécula montada com o gabarito e explica o que está errado.
import {
  type Graph, type El, overValence, bondSum, valence, EL_NAME, formulaCounts, components,
  longestCarbonChain, neighbors,
} from './graph';
import { canonicalOfGraph, canonicalOfSmiles, smilesToGraph } from './ocl';
import { detectGroups, groupCounts, GROUP_EXPLAIN, type Group } from './groups';

export interface CommonMistake {
  smiles: string;
  msg: string;
}

export interface Verdict {
  ok: boolean;
  messages: string[];
  highlight: number[]; // ids de átomos para destacar em vermelho
}

const ION = (el: El) => el === 'Na' || el === 'K';

function branchCount(g: Graph): number {
  let n = 0;
  for (const a of g.atoms) {
    if (a.el !== 'C') continue;
    const deg = neighbors(g, a.id).filter((x) => x.atom.el === 'C').length;
    if (deg >= 3) n += deg - 2;
  }
  return n;
}

function realComponents(g: Graph): number {
  return components(g).filter((c) => !(c.length === 1 && ION(g.atoms.find((a) => a.id === c[0])!.el))).length;
}

const article = (grp: Group) => (['amida', 'amina', 'ligação', 'cetona'].some((w) => grp.startsWith(w)) ? 'uma' : 'um');

/** Questão aberta: vale qualquer molécula com a fórmula do exemplo e o grupo pedido. */
export function diagnoseOpen(user: Graph, exampleSmiles: string, grupo: Group): Verdict {
  if (user.atoms.length === 0) return { ok: false, messages: ['Ainda não tem nada montado!'], highlight: [] };
  const bad = user.atoms.filter((a) => overValence(user, a));
  if (bad.length) return diagnose(user, exampleSmiles);
  const ex = smilesToGraph(exampleSmiles);
  const messages: string[] = [];
  if (realComponents(user) !== realComponents(ex)) messages.push('Tem pedaço solto! Tudo precisa estar ligado numa molécula só.');
  const fu = formulaCounts(user);
  const fa = formulaCounts(ex);
  const keys = Array.from(new Set([...Object.keys(fu), ...Object.keys(fa)]));
  const diffs = keys.filter((k) => (fu[k] ?? 0) !== (fa[k] ?? 0)).map((k) => {
    const d = (fa[k] ?? 0) - (fu[k] ?? 0);
    return d > 0 ? `falta${d > 1 ? 'm' : ''} ${d} ${k}` : `tem ${-d} ${k} a mais`;
  });
  if (diffs.length) messages.push(`A fórmula não bate: ${diffs.join(', ')}. (Lembra que os H contam também: dupla ligação tira 2 H.)`);
  const groups = detectGroups(user).map((h) => h.group);
  if (!groups.includes(grupo)) {
    messages.push(`A sua molécula não tem ${article(grupo)} **${grupo}**: ${GROUP_EXPLAIN[grupo]}.` + (groups.length ? ` (O que eu achei nela: ${Array.from(new Set(groups)).join(', ')}.)` : ''));
  }
  return { ok: messages.length === 0, messages, highlight: [] };
}

export function diagnose(user: Graph, answerSmiles: string, mistakes: CommonMistake[] = []): Verdict {
  if (user.atoms.length === 0) return { ok: false, messages: ['Ainda não tem nada montado! Toque numa peça e depois na área de montagem.'], highlight: [] };

  // 1) valência
  const bad = user.atoms.filter((a) => overValence(user, a));
  if (bad.length) {
    const a = bad[0];
    return {
      ok: false,
      messages: [
        `O ${EL_NAME[a.el]} destacado está com ${bondSum(user, a.id)} ligações, mas ${EL_NAME[a.el]} só tem ${valence(a.el, a.charge)} mãozinha${valence(a.el, a.charge) > 1 ? 's' : ''}. Conta os tracinhos (dupla vale 2, tripla vale 3).`,
      ],
      highlight: bad.map((x) => x.id),
    };
  }

  const userCanon = canonicalOfGraph(user);
  if (userCanon === canonicalOfSmiles(answerSmiles)) return { ok: true, messages: [], highlight: [] };

  // 2) erros comuns previstos no exercício
  for (const m of mistakes) {
    if (canonicalOfSmiles(m.smiles) === userCanon) return { ok: false, messages: [m.msg], highlight: [] };
  }

  const ans = smilesToGraph(answerSmiles);
  const messages: string[] = [];
  const highlight: number[] = [];

  // 3) pedaços soltos
  const uc = realComponents(user);
  const ac = realComponents(ans);
  if (uc > ac) messages.push(ac === 1 ? 'Tem pedaço solto! Todos os átomos precisam estar ligados numa molécula só (só os íons Na⁺/K⁺ podem ficar separados).' : `Tem pedaço solto: a resposta tem ${ac} moléculas separadas e a sua tem ${uc}.`);
  else if (uc < ac) messages.push(`A resposta tem ${ac} partes separadas, a sua tem ${uc}.`);

  // 4) fórmula
  const fu = formulaCounts(user);
  const fa = formulaCounts(ans);
  const els = Array.from(new Set([...Object.keys(fu), ...Object.keys(fa)])).filter((e) => e !== 'H');
  const diffs: string[] = [];
  for (const e of els) {
    const d = (fa[e] ?? 0) - (fu[e] ?? 0);
    if (d > 0) diffs.push(`falta${d > 1 ? 'm' : ''} ${d} ${e}`);
    if (d < 0) diffs.push(`tem ${-d} ${e} a mais`);
  }
  if (diffs.length) {
    messages.push(`Conta as peças: ${diffs.join(', ')}.`);
  } else if ((fu.H ?? 0) !== (fa.H ?? 0)) {
    messages.push(
      (fu.H ?? 0) > (fa.H ?? 0)
        ? 'As peças estão certas, mas sobram H: está faltando uma ligação dupla (ou fechar um anel/ponte).'
        : 'As peças estão certas, mas faltam H: tem ligação dupla (ou anel/ponte) a mais.',
    );
  }

  // 5) grupos funcionais
  const ug = detectGroups(user);
  const ag = groupCounts(detectGroups(ans));
  const ugc = groupCounts(ug);
  for (const [grp, n] of ag) {
    if ((ugc.get(grp) ?? 0) < n) messages.push(`A resposta tem ${article(grp)} **${grp}** (${GROUP_EXPLAIN[grp]}) e isso está faltando na sua.`);
  }
  for (const [grp, n] of ugc) {
    if ((ag.get(grp) ?? 0) < n) {
      messages.push(`A sua molécula tem ${article(grp)} **${grp}** (${GROUP_EXPLAIN[grp]}), que não era pra estar aí.`);
      ug.filter((h) => h.group === grp).forEach((h) => highlight.push(...h.atoms));
    }
  }

  // 6) cobrinha e ramificações
  const lu = longestCarbonChain(user).length;
  const la = longestCarbonChain(ans).length;
  if (!diffs.length && lu !== la) messages.push(`A maior sequência de carbonos seguidos (a cobrinha) na sua tem ${lu} C, na resposta tem ${la} C.`);
  const bu = branchCount(user);
  const ba = branchCount(ans);
  if (!diffs.length && bu !== ba) messages.push(ba === 0 ? 'A resposta não tem ramificação: os carbonos ficam todos em fila.' : `Ramificações: a resposta tem ${ba}, a sua tem ${bu}.`);

  if (!messages.length) {
    messages.push('Quase! As peças e os grupos estão certos, mas alguma coisa está no lugar errado. Confere os números (localizadores): em qual carbono cada coisa está grudada?');
  }
  return { ok: false, messages, highlight };
}
