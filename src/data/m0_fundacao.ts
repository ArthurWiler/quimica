import type { Module } from './types';

export const m0: Module = {
  id: 'fundacao',
  titulo: 'Fundação',
  emoji: '🧱',
  cor: '#6d4aff',
  descricao: 'As mãozinhas dos átomos, os H escondidos e como ler qualquer desenho de molécula.',
  licoes: [
    {
      id: 'f-maos',
      titulo: 'As mãozinhas dos átomos',
      blocos: [
        { t: 'p', s: 'Todo átomo tem um número certinho de **mãozinhas** (ligações), e ele **sempre** usa todas. Decora essa tabelinha, porque ela resolve metade da química orgânica:' },
        {
          t: 'tabela',
          head: ['Átomo', 'Mãozinhas', 'Jeito de lembrar'],
          rows: [
            ['**C** carbono', '**4**', 'quatro braços, tipo um X'],
            ['**N** nitrogênio', '**3**', 'tipo um tripé'],
            ['**O** oxigênio', '**2**', 'fica no meio (C–O–C) ou faz dupla (C=O)'],
            ['**H** hidrogênio', '**1**', 'sempre na ponta'],
            ['**Cl, Br, F, I**', '**1**', 'halogênios: igual ao H'],
          ],
        },
        { t: 'p', s: 'Ligação **dupla** (=) gasta 2 mãozinhas de cada lado. Ligação **tripla** (≡) gasta 3.' },
        {
          t: 'passo',
          s: `
     H
     |
 H - C - H      metano: o C usa as 4 mãozinhas com 4 H
     |
     H

 H - O - H      água: o O usa 2

 O = C = O      CO₂: cada O usa 2 (dupla), o C usa 4 (duas duplas)`,
        },
        { t: 'dica', s: 'Se um carbono ficar com 5 ligações no seu desenho, tem coisa errada. O app pinta ele de **vermelho** pra te avisar!' },
      ],
    },
    {
      id: 'f-h',
      titulo: 'Os H ficam escondidos',
      blocos: [
        { t: 'p', s: 'Como o H sempre fica na ponta, a gente economiza e escreve ele grudado no átomo. É só contar quantas mãozinhas **sobraram**:' },
        {
          t: 'passo',
          s: `
C ligado a 1 carbono  → sobram 3 → CH₃
C ligado a 2 carbonos → sobram 2 → CH₂
C ligado a 3 carbonos → sobra  1 → CH
C ligado a 4 carbonos → sobra  0 → C

O ligado a 1 carbono  → sobra  1 → OH
N ligado a 1 carbono  → sobram 2 → NH₂`,
        },
        { t: 'mol', smiles: 'CCC(C)C', completo: true, legenda: 'repara nos CH₃, CH₂ e CH' },
        { t: 'p', s: 'No app, quando você monta uma molécula, os H aparecem **sozinhos**. Você só monta o esqueleto (C, O, N...) e o app completa os H.' },
        { t: 'dica', s: 'A ligação dupla conta 2! No CH₂=CH₂, cada C tem 2 mãozinhas na dupla + 2 H = 4 ✔' },
      ],
    },
    {
      id: 'f-desenho',
      titulo: 'Três jeitos de desenhar a mesma molécula',
      blocos: [
        { t: 'p', s: 'A lista usa três jeitos de escrever molécula. Você precisa saber ler os três:' },
        { t: 'h', s: '1) Fórmula condensada (numa linha só)' },
        { t: 'passo', s: 'CH₃CH₂OH   =   CH₃ – CH₂ – OH      (etanol)' },
        { t: 'h', s: '2) Estrutural (tudo desenhado)' },
        { t: 'mol', smiles: 'CCO', completo: true, legenda: 'etanol' },
        { t: 'h', s: '3) Bastão ou zigue-zague (o jeito da professora)' },
        { t: 'p', s: 'Cada **ponta** e cada **curva** do zigue-zague é um carbono. Os H dos carbonos **não aparecem**. O que não é carbono aparece escrito (O, N, Cl...).' },
        {
          t: 'mols',
          itens: [
            { smiles: 'CCO', legenda: 'etanol: 2 C + OH' },
            { smiles: 'CCCCC', legenda: 'pentano: 5 C' },
            { smiles: 'CC(=O)C', legenda: 'propanona: o tracinho duplo vai pro O' },
          ],
        },
        { t: 'dica', s: 'Põe o dedo numa ponta e vai andando. Cada vez que a linha muda de direção, é mais um C. Encontro de 3 linhas também é um C (com ramificação).' },
        { t: 'p', s: 'Dentro dos exercícios, o botão **🔍 mostrar todos os C e H** troca o desenho de bastão pelo completo. Usa à vontade!' },
      ],
    },
    {
      id: 'f-parenteses',
      titulo: 'Lendo os parênteses da fórmula',
      blocos: [
        { t: 'p', s: 'Na lista aparecem coisas tipo `CH₃CH₂OCH(CH₃)₂`. O parêntese quer dizer: **pendura isso no átomo que veio logo antes**. O número depois do parêntese diz quantas vezes.' },
        {
          t: 'passo',
          s: `
CH(CH₃)₂  →  o CH tem DOIS CH₃ pendurados

      – CH – CH₃
        |
        CH₃

C(CH₃)₃   →  o C tem TRÊS CH₃ pendurados

(CH₂)₄    →  4 CH₂ em fila: CH₂–CH₂–CH₂–CH₂`,
        },
        { t: 'p', s: 'Então `CH₃CH₂OCH(CH₃)₂` fica assim:' },
        {
          t: 'passo',
          s: `
CH₃ – CH₂ – O – CH – CH₃
                |
                CH₃`,
        },
        { t: 'mol', smiles: 'CCOC(C)C', legenda: 'a mesma molécula, em bastão' },
        { t: 'dica', s: 'Lê da esquerda pra direita, um pedacinho por vez. Cada CH₃, CH₂, CH, O... é uma peça. Monta peça por peça, na ordem.' },
      ],
    },
  ],
  exercicios: [
    {
      id: 'f01', tipo: 'number', nivel: 1, licao: 'f-maos',
      enunciado: 'Quantas mãozinhas (ligações) o **carbono** sempre faz?',
      resposta: 4, tol: 0,
      passos: ['Carbono = **4**, sempre! Pensa num X: 4 braços.', 'É por isso que o metano é CH₄: o C usa as 4 mãozinhas com 4 H.'],
    },
    {
      id: 'f02', tipo: 'choice', nivel: 1, licao: 'f-maos',
      enunciado: 'E o **oxigênio**, faz quantas ligações?',
      opcoes: [{ txt: '1', porque: '1 é do H e dos halogênios (Cl, Br...).' }, { txt: '2' }, { txt: '3', porque: '3 é do nitrogênio.' }, { txt: '4', porque: '4 é do carbono!' }],
      certa: 1,
      passos: ['Oxigênio = **2**. Pensa na água: H–O–H, o O segura 2 H.', 'Por isso o O fica **no meio** (C–O–C, C–O–H) ou faz **dupla** (C=O).'],
    },
    {
      id: 'f03', tipo: 'build', nivel: 1, licao: 'f-h',
      enunciado: 'Monte o **metanol**: CH₃–OH',
      smiles: 'CO', formula: 'CH4O',
      passos: ['Peças: 1 C e 1 O.', 'Liga o C no O. Pronto!', 'O app completa os H: o C fica CH₃ (sobram 3 mãozinhas) e o O fica OH (sobra 1).\n```\nCH₃ – OH\n```'],
    },
    {
      id: 'f04', tipo: 'build', nivel: 1, licao: 'f-h',
      enunciado: 'Monte o **etano**: CH₃–CH₃',
      smiles: 'CC', formula: 'C2H6',
      passos: ['Peças: 2 C.', 'Liga um no outro. Cada C fica com 3 H (CH₃).'],
    },
    {
      id: 'f05', tipo: 'build', nivel: 1, licao: 'f-maos',
      enunciado: 'Monte o **eteno**: CH₂=CH₂ (dois carbonos com ligação **dupla**)',
      smiles: 'C=C', formula: 'C2H4',
      erros: [{ smiles: 'CC', msg: 'Isso é o etano (ligação simples). Toca **na ligação** entre os dois C pra ela virar dupla!' }],
      passos: ['Coloca 2 C ligados.', 'Toca **na ligação** entre eles: ela vira dupla.', 'Repara: cada C ficou CH₂, porque a dupla já gasta 2 das 4 mãozinhas.'],
    },
    {
      id: 'f06', tipo: 'number', nivel: 1, licao: 'f-h',
      enunciado: 'No propano, CH₃–CH₂–CH₃, quantos H tem o carbono **do meio**?',
      smiles: 'CCC', resposta: 2, tol: 0,
      passos: ['O C do meio está ligado a 2 carbonos, um de cada lado.', 'Sobram 4 − 2 = **2** mãozinhas → 2 H → CH₂.'],
    },
    {
      id: 'f07', tipo: 'pick', nivel: 1, licao: 'f-desenho',
      enunciado: 'Nesse desenho em bastão, toque no carbono que tem **só 1 H**.',
      smiles: 'CC(C)C', formula: 'C4H10', alvo: [1], alvoEl: 'C',
      passos: ['Em bastão, cada ponta e cada encontro de linhas é um C.', 'O C do meio está ligado a **3** carbonos → sobra 1 mãozinha → CH.', 'As pontas estão ligadas a 1 carbono só → CH₃.'],
    },
    {
      id: 'f08', tipo: 'number', nivel: 2, licao: 'f-desenho',
      enunciado: 'Quantos carbonos tem essa molécula?',
      smiles: 'CC(C)CCC', resposta: 6, tol: 0,
      passos: ['Conta as **pontas**: 3.', 'Conta as **curvas e encontros**: 3.', '3 + 3 = **6** carbonos. (É o 2-metilpentano.)'],
    },
    {
      id: 'f09', tipo: 'build', nivel: 2, licao: 'f-parenteses',
      enunciado: 'Monte o **CH₃CH₂OCH₃**',
      smiles: 'CCOC', formula: 'C3H8O',
      passos: ['Separa em pedaços: CH₃ | CH₂ | O | CH₃.', 'Liga na ordem: C – C – O – C.\n```\nCH₃ – CH₂ – O – CH₃\n```'],
    },
    {
      id: 'f10', tipo: 'build', nivel: 2, licao: 'f-parenteses',
      enunciado: 'Monte o **CH₃CH(CH₃)₂**',
      smiles: 'CC(C)C', formula: 'C4H10',
      erros: [{ smiles: 'CCCC', msg: 'Você fez uma fila de 4 C. Mas o (CH₃)₂ quer dizer **dois** CH₃ pendurados no mesmo CH: o CH tem que ficar ligado a 3 carbonos.' }],
      passos: ['Pedaços: CH₃ | CH | (CH₃)₂.', 'O (CH₃)₂ quer dizer: **dois** CH₃ pendurados no CH que veio antes.\n```\nCH₃ – CH – CH₃\n      |\n      CH₃\n```'],
    },
    {
      id: 'f11', tipo: 'build', nivel: 2, licao: 'f-parenteses',
      enunciado: 'Monte o **CH₃CH₂OCH(CH₃)₂**',
      smiles: 'CCOC(C)C', formula: 'C5H12O',
      passos: ['Pedaços: CH₃ | CH₂ | O | CH | (CH₃)₂.', 'Monta a fila: C – C – O – C.', 'Pendura **dois** CH₃ no último C (o CH).\n```\nCH₃ – CH₂ – O – CH – CH₃\n                |\n                CH₃\n```'],
    },
    {
      id: 'f12', tipo: 'pick', nivel: 2, licao: 'f-desenho',
      enunciado: 'Toque nos carbonos que estão ligados **direto no oxigênio**.',
      smiles: 'CCOC(C)C', formula: 'C5H12O', alvo: [1, 3], alvoEl: 'C',
      passos: ['Acha o O no desenho.', 'Segue as duas linhas que saem dele: cada uma chega num carbono.', 'Esses dois são a resposta (o O está "no meio" deles).'],
    },
    {
      id: 'f13', tipo: 'build', nivel: 3, licao: 'f-maos',
      enunciado: 'Monte o **CH₂=CHCH₂OH**',
      smiles: 'C=CCO', formula: 'C3H6O',
      passos: ['Pedaços: CH₂ | = | CH | CH₂ | OH.', 'O "=" fica entre o primeiro e o segundo C: toca na ligação pra virar dupla.\n```\nCH₂ = CH – CH₂ – OH\n```'],
    },
    {
      id: 'f14', tipo: 'build', nivel: 3, licao: 'f-parenteses',
      enunciado: 'Monte o **CH₃(CH₂)₄OC(CH₃)₃**',
      smiles: 'CCCCCOC(C)(C)C', formula: 'C9H20O',
      passos: [
        'CH₃(CH₂)₄ = CH₃ + 4 CH₂ = uma fila de **5** C.',
        'Depois vem o O.',
        'C(CH₃)₃ = um C com **três** CH₃ pendurados.\n```\n                         CH₃\n                         |\nCH₃–CH₂–CH₂–CH₂–CH₂–O–C–CH₃\n                         |\n                         CH₃\n```',
      ],
    },
    {
      id: 'f15', tipo: 'number', nivel: 3, licao: 'f-h',
      enunciado: 'Quantos H tem, no total, a molécula **CH₃CH₂CH₂OCH(CH₃)₂**?',
      resposta: 14, tol: 0,
      erros: [{ valor: 11, msg: 'Lembra que (CH₃)₂ são **dois** CH₃: 6 H, não 3!' }],
      passos: ['Soma os H de cada pedaço: CH₃ (3) + CH₂ (2) + CH₂ (2) + CH (1) + (CH₃)₂ (2 × 3 = 6).', '3 + 2 + 2 + 1 + 6 = **14**. A fórmula é C₆H₁₄O.'],
    },
  ],
};
