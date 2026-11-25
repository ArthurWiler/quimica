// Confere nomes digitados com tolerância (acentos, hífens, espaços, vírgulas) e explica o erro.

export function normalizeName(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/tert/g, 'terc')
    .replace(/[^a-z0-9]/g, '')
    // "metil-hexano" = "metilexano", "ciclo-hexano" = "cicloexano"
    .replace(/([a-z])h(ex|ept)/g, '$1$2');
}

export type NameClass =
  | 'anidrido' | 'cloreto de acila' | 'ácido carboxílico' | 'sal de ácido carboxílico' | 'éster'
  | 'amida' | 'amina' | 'cetona' | 'aldeído' | 'álcool' | 'éter' | 'epóxido' | 'hidrocarboneto' | '?';

export function nameClass(n: string): NameClass {
  if (n.startsWith('anidrido')) return 'anidrido';
  if (n.startsWith('cloretode') && n.endsWith('oila')) return 'cloreto de acila';
  if (n.startsWith('acido')) return 'ácido carboxílico';
  if (/oatode(sodio|potassio|litio|amonio)$/.test(n)) return 'sal de ácido carboxílico';
  if (/oatode[a-z0-9]*ila$/.test(n)) return 'éster';
  if (n.endsWith('amida')) return 'amida';
  if (n.endsWith('amina')) return 'amina';
  if (n.endsWith('cetona')) return 'cetona';
  if (n.startsWith('eter')) return 'éter';
  if (n.endsWith('ona')) return 'cetona';
  if (n.endsWith('al') || n.endsWith('carbaldeido')) return 'aldeído';
  if (n.endsWith('ol')) return 'álcool';
  if (n.includes('epoxi')) return 'epóxido';
  if (n.includes('oxi') && /(ano|eno|ino)$/.test(n)) return 'éter';
  if (/(ano|eno|ino)$/.test(n)) return 'hidrocarboneto';
  return '?';
}

const CLASS_RULE: Record<NameClass, string> = {
  'anidrido': 'anidrido começa com "anidrido" e termina em "-oico" (ex.: anidrido etanoico)',
  'cloreto de acila': 'cloreto de acila é "cloreto de ...-oíla" (ex.: cloreto de etanoíla)',
  'ácido carboxílico': 'ácido carboxílico é "ácido ...-oico" (ex.: ácido etanoico)',
  'sal de ácido carboxílico': 'sal é "...-oato de sódio/potássio" (ex.: etanoato de sódio)',
  'éster': 'éster é "...-oato de ...-ila" (ex.: etanoato de metila)',
  'amida': 'amida termina em "-amida" (ex.: etanamida)',
  'amina': 'amina termina em "-amina" (ex.: etanamina)',
  'cetona': 'cetona termina em "-ona" (ex.: propanona)',
  'aldeído': 'aldeído termina em "-al" (ex.: etanal)',
  'álcool': 'álcool termina em "-ol" (ex.: etanol)',
  'éter': 'éter no IUPAC é "alcoxi + alcano" (ex.: metoxietano)',
  'epóxido': 'epóxido é "x,y-epoxi + alcano" (ex.: 2,3-epoxibutano)',
  'hidrocarboneto': 'hidrocarboneto termina em -ano, -eno ou -ino',
  '?': '',
};

const MULT = ['tetra', 'tri', 'di', ''];
const MULT_N: Record<string, number> = { tetra: 4, tri: 3, di: 2, '': 1 };
const TOKENS = [
  'secbutoxi', 'tercbutoxi', 'isopropoxi', 'isobutoxi', 'metoxi', 'etoxi', 'propoxi', 'butoxi', 'fenoxi', 'pentoxi', 'epoxi',
  'isopropil', 'isobutil', 'secbutil', 'tercbutil', 'ciclopentil', 'cicloexil',
  'metil', 'etil', 'propil', 'butil', 'pentil', 'hexil', 'fenil', 'benzil', 'vinil',
  'cloro', 'bromo', 'fluoro', 'iodo', 'hidroxi', 'amino', 'oxo',
].sort((a, b) => b.length - a.length);

/** Conta as ramificações/prefixos ("dimetil" => metil x2) e devolve o resto do texto. */
export function substituents(n: string): { counts: Map<string, number>; rest: string } {
  const counts = new Map<string, number>();
  let rest = '';
  let i = 0;
  outer: while (i < n.length) {
    for (const t of TOKENS) {
      for (const m of MULT) {
        if (n.startsWith(m + t, i)) {
          // não confundir "metil" dentro de "metila" no fim de ésteres: ainda conta igual dos dois lados
          counts.set(t, (counts.get(t) ?? 0) + MULT_N[m]);
          i += m.length + t.length;
          continue outer;
        }
      }
    }
    rest += n[i];
    i++;
  }
  return { counts, rest };
}

const STEMS: [string, number][] = [
  ['met', 1], ['et', 2], ['prop', 3], ['but', 4], ['pent', 5], ['hex', 6], ['hept', 7], ['ept', 7], ['ex', 6], ['oct', 8], ['non', 9], ['dec', 10],
];

export function mainStem(n: string): [string, number] | null {
  const rest = substituents(n).rest.replace(/[0-9]/g, '');
  const re = /(met|et|prop|but|pent|hept|ept|hex|ex|oct|non|dec)(an|en|in|a[lm])/g;
  let last: RegExpExecArray | null = null;
  let m: RegExpExecArray | null;
  while ((m = re.exec(rest))) last = m;
  if (!last) return null;
  const st = STEMS.find(([s]) => s === last![1]);
  return st ?? null;
}

function numbers(raw: string): string {
  return (raw.match(/\d+/g) ?? []).map(Number).sort((a, b) => a - b).join(',');
}

export interface NameVerdict {
  ok: boolean;
  messages: string[];
}

export function checkName(typed: string, accepted: string[], mistakes: { name: string; msg: string }[] = []): NameVerdict {
  const t = normalizeName(typed);
  if (!t) return { ok: false, messages: ['Digita o nome primeiro 🙂'] };
  if (accepted.some((a) => normalizeName(a) === t)) return { ok: true, messages: [] };

  for (const m of mistakes) if (normalizeName(m.name) === t) return { ok: false, messages: [m.msg] };

  const exp = normalizeName(accepted[0]);
  const msgs: string[] = [];

  const ct = nameClass(t);
  const ce = nameClass(exp);
  if (ct !== ce && ce !== '?') {
    msgs.push(
      ct === '?'
        ? `Pelo jeito do nome, não deu pra saber a função. Lembra: ${CLASS_RULE[ce]}.`
        : `Pelo final, o seu nome é de ${ct === 'éster' || ct === 'éter' || ct === 'epóxido' || ct === 'anidrido' || ct === 'aldeído' || ct === 'álcool' || ct === 'ácido carboxílico' || ct === 'sal de ácido carboxílico' || ct === 'hidrocarboneto' || ct === 'cloreto de acila' ? 'um' : 'uma'} **${ct}**, mas a molécula é ${ce === 'amida' || ce === 'amina' || ce === 'cetona' ? 'uma' : 'um'} **${ce}**. Lembra: ${CLASS_RULE[ce]}.`,
    );
  }

  const st = mainStem(t);
  const se = mainStem(exp);
  if (se && st && st[1] !== se[1]) {
    msgs.push(`Cobrinha principal: você usou **${st[0]}** (${st[1]} C), mas a cadeia principal tem outro tamanho. Conta de novo os carbonos da maior cadeia que tem o grupo principal.`);
  } else if (se && !st && ce !== 'éter') {
    msgs.push('Não achei a cadeia principal no seu nome (met, et, prop, but, pent...). Ela tem que aparecer!');
  }

  const sub_t = substituents(t).counts;
  const sub_e = substituents(exp).counts;
  for (const [k, v] of sub_e) {
    const u = sub_t.get(k) ?? 0;
    if (u === 0) msgs.push(`Faltou um pedaço no nome: tem um **${k}** na molécula que não apareceu. Olha de novo os galhos da cadeia.`);
    else if (u < v) msgs.push(`**${k}** aparece ${v} vezes na molécula. Usa o prefixo ${v === 2 ? '"di"' : v === 3 ? '"tri"' : '"tetra"'} (ex.: di${k}).`);
    else if (u > v) msgs.push(`Você colocou **${k}** mais vezes do que tem na molécula.`);
  }
  for (const [k] of sub_t) {
    if (!sub_e.has(k)) msgs.push(`**${k}** está no seu nome, mas esse rabinho não existe na molécula (ou ele faz parte da cadeia principal).`);
  }

  if (numbers(typed) !== numbers(accepted[0]) && !accepted.some((a) => numbers(a) === numbers(typed))) {
    msgs.push('Os números (localizadores) não batem. Numera a cadeia pela ponta mais perto do grupo principal, e usa os menores números possíveis.');
  }

  if (!msgs.length) {
    msgs.push('Tá muito perto! Confere a ordem dos pedaços (ramificações em ordem alfabética) e se não faltou letrinha (an, ona, ila, oico...).');
  }
  // remove duplicadas
  return { ok: false, messages: Array.from(new Set(msgs)) };
}
