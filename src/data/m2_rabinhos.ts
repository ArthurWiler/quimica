import type { Module } from './types';

export const m2: Module = {
  id: 'rabinhos',
  titulo: 'Os rabinhos (ramificações)',
  emoji: '🌿',
  cor: '#12a594',
  descricao: 'Metil, etil, isopropil, sec-butil, terc-butil, fenil, benzil... e como dar nome com eles.',
  licoes: [
    {
      id: 'r-oque',
      titulo: 'O que é um rabinho?',
      blocos: [
        { t: 'p', s: 'Rabinho (ou **ramificação**, ou **radical**) é um pedaço de carbono pendurado na cobrinha principal. O nome dele usa o mesmo prefixo, mas termina em **-il**:' },
        {
          t: 'tabela',
          head: ['Rabinho', 'Tamanho', 'Desenho'],
          rows: [
            ['**metil**', '1 C', '–CH₃'],
            ['**etil**', '2 C', '–CH₂–CH₃'],
            ['**propil**', '3 C', '–CH₂–CH₂–CH₃'],
            ['**butil**', '4 C', '–CH₂–CH₂–CH₂–CH₃'],
          ],
        },
        { t: 'passo', s: '2-metilbutano:\n\n  1   2   3   4\n  C - C - C - C       ← cobrinha (butano)\n      |\n      CH₃             ← rabinho metil no carbono 2' },
        { t: 'mols', itens: [{ smiles: 'CC(C)CC', legenda: '2-metilbutano' }, { smiles: 'CCC(CC)CC', legenda: '3-etilpentano' }] },
      ],
    },
    {
      id: 'r-especiais',
      titulo: 'Os rabinhos com apelido',
      blocos: [
        { t: 'p', s: 'Alguns rabinhos de 3 e 4 carbonos têm nome especial. O segredo é **por qual carbono** eles se grudam na cadeia (marcado com ✱):' },
        {
          t: 'passo',
          s: `
isopropil      ✱CH – CH₃         gruda pelo C do MEIO
                 |
                 CH₃

sec-butil      ✱CH – CH₂ – CH₃   gruda pelo C2 do butil
                 |               ("sec" = secundário)
                 CH₃

isobutil       ✱CH₂ – CH – CH₃   gruda pela ponta, e a
                      |          bifurcação fica no fim
                      CH₃

terc-butil          CH₃          gruda pelo C do centro,
                    |            que tem 3 CH₃
               ✱C – CH₃          ("terc" = terciário)
                    |
                    CH₃`,
        },
        {
          t: 'mols',
          itens: [
            { smiles: 'CC(C)C1=CC=CC=C1', legenda: 'isopropilbenzeno' },
            { smiles: 'CCC(C)C1=CC=CC=C1', legenda: 'sec-butilbenzeno' },
            { smiles: 'CC(C)CC1=CC=CC=C1', legenda: 'isobutilbenzeno' },
            { smiles: 'CC(C)(C)C1=CC=CC=C1', legenda: 'terc-butilbenzeno' },
          ],
        },
        { t: 'h', s: 'Fenil × benzil' },
        { t: 'passo', s: 'fenil:   ⬡–           o anel gruda DIRETO\nbenzil:  ⬡–CH₂–       tem um CH₂ entre o anel e a cadeia' },
        { t: 'dica', s: 'Benzil tem a letra "b" de "bônus": um CH₂ a mais.' },
      ],
    },
    {
      id: 'r-nome',
      titulo: 'Dando nome com rabinhos',
      blocos: [
        { t: 'p', s: 'Receita para dar nome:' },
        {
          t: 'lista',
          itens: [
            '**Ache a cobrinha:** a MAIOR fila de carbonos seguidos. Cuidado, ela pode fazer curva no desenho!',
            '**Numere** a partir da ponta que deixa os rabinhos com os **menores números**.',
            '**Escreva os rabinhos** com o número deles, em **ordem alfabética** (etil vem antes de metil).',
            'Rabinho repetido: use **di** (2), **tri** (3), **tetra** (4). Ex.: 2,3-dimetil. O "di" não conta na ordem alfabética.',
            '**Termine** com o nome da cobrinha.',
          ],
        },
        { t: 'passo', s: '        CH₃\n        |\nCH₃ – CH – CH₂ – CH – CH₃       5 C na cobrinha → pentano\n                  |             metil no 2 e no 4\n                  CH₃           → 2,4-dimetilpentano' },
        { t: 'atencao', s: 'Número com número: vírgula (2,4). Número com letra: hífen (2-metil). Ex.: **3-etil-2-metilexano**.' },
        { t: 'dica', s: 'Quando o nome fica "metil" + "hexano", pode escrever **metilexano** ou **metil-hexano**. O app aceita os dois.' },
      ],
    },
  ],
  exercicios: [
    {
      id: 'r01', tipo: 'build', nivel: 1, licao: 'r-oque',
      enunciado: 'Monte o **2-metilpropano**',
      smiles: 'CC(C)C', formula: 'C4H10',
      passos: ['Cobrinha: "propano" = 3 C → C – C – C.', 'Númerozinho: 2 → o carbono do meio.', 'Rabinho: metil = 1 C. Pendura no C2.\n```\nC - C - C\n    |\n    CH₃\n```'],
    },
    {
      id: 'r02', tipo: 'build', nivel: 1, licao: 'r-oque',
      enunciado: 'Monte o **2-metilbutano**',
      smiles: 'CC(C)CC', formula: 'C5H12',
      passos: ['Cobrinha: butano = 4 C.', 'Metil (1 C) no carbono 2.\n```\nC - C - C - C\n    |\n    CH₃\n```'],
    },
    {
      id: 'r03', tipo: 'name', nivel: 2, licao: 'r-nome',
      enunciado: 'Dê o nome:',
      smiles: 'CC(C)CC', formula: 'C5H12', aceitos: ['2-metilbutano'],
      erros: [{ name: '3-metilbutano', msg: 'Numerou pelo lado errado. Começa pela ponta **mais perto** do rabinho: aí ele fica no 2.' }, { name: 'pentano', msg: 'Pentano é tudo em fila. Aqui tem um galho! A maior fila tem 4 C, e sobra 1 C de rabinho.' }],
      passos: ['Maior fila de C seguidos: **4** → butano.', 'Sobrou 1 C pendurado → metil.', 'Numera pela ponta mais perto do metil: ele fica no **2**.', '**2-metilbutano**.'],
    },
    {
      id: 'r04', tipo: 'build', nivel: 2, licao: 'r-oque',
      enunciado: 'Monte o **3-etilpentano**',
      smiles: 'CCC(CC)CC', formula: 'C7H16',
      passos: ['Cobrinha: pentano = 5 C.', 'Etil = rabinho de **2** C, pendurado no C3 (o do meio).\n```\nC - C - C - C - C\n        |\n        CH₂ - CH₃\n```'],
    },
    {
      id: 'r05', tipo: 'name', nivel: 2, licao: 'r-nome',
      enunciado: 'Dê o nome:',
      smiles: 'CC(C)C(C)C', formula: 'C6H14', aceitos: ['2,3-dimetilbutano'],
      erros: [{ name: '2-metil-3-metilbutano', msg: 'Quando o rabinho repete, junta tudo com "di": **2,3-dimetil**...' }],
      passos: ['Maior fila: **4** C → butano.', 'Dois metis, nos carbonos 2 e 3.', 'Dois iguais → "di": **2,3-dimetilbutano**.'],
    },
    {
      id: 'r06', tipo: 'build', nivel: 2, licao: 'r-oque',
      enunciado: 'Monte o **2,2-dimetilpropano**',
      smiles: 'CC(C)(C)C', formula: 'C5H12',
      erros: [{ smiles: 'CC(C)CC', msg: 'O "2,2" quer dizer que os **dois** metis vão no **mesmo** carbono (o C2).' }],
      passos: ['Cobrinha: propano = 3 C.', '"2,2-dimetil" = dois metis, os dois no C2.\n```\n    CH₃\n    |\nC - C - C\n    |\n    CH₃\n```', 'O C do meio fica sem nenhum H (4 carbonos em volta).'],
    },
    {
      id: 'r07', tipo: 'choice', nivel: 2, licao: 'r-especiais',
      enunciado: 'Qual desses é o **isopropil**?',
      opcoes: [
        { txt: '–CH₂–CH₂–CH₃', porque: 'Esse é o propil normal, que gruda pela ponta.' },
        { txt: '–CH(CH₃)₂' },
        { txt: '–C(CH₃)₃', porque: 'Esse tem 4 C: é o terc-butil.' },
        { txt: '–CH₂–CH(CH₃)₂', porque: 'Esse tem 4 C: é o isobutil.' },
      ],
      certa: 1,
      passos: ['Isopropil tem 3 C e gruda pelo carbono **do meio**.', 'Esse C do meio tem dois CH₃ pendurados: –CH(CH₃)₂.'],
    },
    {
      id: 'r08', tipo: 'choice', nivel: 2, licao: 'r-especiais',
      enunciado: 'O **sec-butil** se gruda na cadeia por qual carbono?',
      opcoes: [
        { txt: 'Pelo C1 (a ponta)', porque: 'Pela ponta é o butil normal.' },
        { txt: 'Pelo C2 (o segundo carbono)' },
        { txt: 'Por um C que tem três CH₃', porque: 'Esse é o terc-butil.' },
      ],
      certa: 1,
      passos: ['"sec" vem de **secundário**: o carbono que gruda está ligado a 2 outros carbonos.', 'No butil, esse é o **C2**: –CH(CH₃)–CH₂–CH₃.'],
    },
    {
      id: 'r09', tipo: 'build', nivel: 3, licao: 'r-especiais',
      enunciado: 'Monte o **sec-butilbenzeno**',
      smiles: 'CCC(C)C1=CC=CC=C1', formula: 'C10H14',
      erros: [{ smiles: 'CCCCC1=CC=CC=C1', msg: 'Esse é o butilbenzeno normal (gruda pela ponta). O **sec**-butil gruda no anel pelo **C2** dele.' }, { smiles: 'CC(C)(C)C1=CC=CC=C1', msg: 'Esse é o terc-butil. O sec-butil gruda pelo C2: o carbono que encosta no anel tem um H, um CH₃ e um CH₂CH₃.' }],
      passos: ['Coloca o anel benzênico (⬡).', 'sec-butil: CH – CH₂ – CH₃ com um CH₃ pendurado no primeiro CH.', 'É esse CH que gruda no anel.\n```\n⬡ – CH – CH₂ – CH₃\n     |\n     CH₃\n```'],
    },
    {
      id: 'r10', tipo: 'build', nivel: 3, licao: 'r-especiais',
      enunciado: 'Monte o **terc-butilbenzeno**',
      smiles: 'CC(C)(C)C1=CC=CC=C1', formula: 'C10H14',
      passos: ['Anel benzênico (⬡).', 'terc-butil: um C central com **três** CH₃. Esse C central gruda no anel.\n```\n     CH₃\n     |\n⬡ – C – CH₃\n     |\n     CH₃\n```'],
    },
    {
      id: 'r11', tipo: 'choice', nivel: 2, licao: 'r-especiais',
      enunciado: 'Qual a diferença entre **fenil** e **benzil**?',
      opcoes: [
        { txt: 'Benzil tem um CH₂ entre o anel e a cadeia' },
        { txt: 'Fenil tem um CH₂ entre o anel e a cadeia', porque: 'É o contrário: o fenil gruda direto.' },
        { txt: 'São a mesma coisa', porque: 'Não são! Um tem um carbono a mais.' },
        { txt: 'Benzil tem dois anéis', porque: 'Os dois têm um anel só.' },
      ],
      certa: 0,
      passos: ['Fenil: ⬡– (o anel gruda direto).', 'Benzil: ⬡–CH₂– (um CH₂ no meio). "b" de bônus!'],
    },
    {
      id: 'r12', tipo: 'build', nivel: 3, licao: 'r-nome',
      enunciado: 'Monte o **4-etil-2-metilexano**',
      smiles: 'CC(C)CC(CC)CC', formula: 'C9H20',
      passos: ['Cobrinha: hexano = 6 C.', 'metil no C2, etil no C4.\n```\n1   2   3   4   5   6\nC - C - C - C - C - C\n    |       |\n    CH₃     CH₂-CH₃\n```'],
    },
    {
      id: 'r13', tipo: 'name', nivel: 3, licao: 'r-nome',
      enunciado: 'Dê o nome:',
      smiles: 'CC(C)CC(CC)CC', formula: 'C9H20', aceitos: ['4-etil-2-metilexano', '4-etil-2-metil-hexano'],
      erros: [{ name: '2-metil-4-etilexano', msg: 'Os números estão certos! Mas os rabinhos vão em **ordem alfabética**: **e**til vem antes de **m**etil.' }, { name: '3-etil-5-metilexano', msg: 'Numerou pelo lado errado: do outro lado os números ficam menores (2 e 4).' }],
      passos: ['Maior fila: **6** C → hexano.', 'Rabinhos: um metil e um etil.', 'Numerando pela esquerda: metil no 2, etil no 4 (pelo outro lado ficaria 3 e 5, maior).', 'Ordem alfabética: etil antes de metil → **4-etil-2-metilexano**.'],
    },
    {
      id: 'r14', tipo: 'build', nivel: 4, licao: 'r-nome',
      enunciado: 'Monte o **3-etil-2,4-dimetilpentano**',
      smiles: 'CC(C)C(CC)C(C)C', formula: 'C9H20',
      passos: ['Cobrinha: pentano = 5 C.', 'metil no C2 e no C4; etil no C3.\n```\n    CH₃     CH₃\n    |       |\nC - C - C - C - C\n        |\n        CH₂-CH₃\n```'],
    },
    {
      id: 'r15', tipo: 'name', nivel: 4, licao: 'r-nome',
      enunciado: 'Dê o nome (essa é a famosa "isoctana" da gasolina):',
      smiles: 'CC(C)(C)CC(C)C', formula: 'C8H18', aceitos: ['2,2,4-trimetilpentano'],
      erros: [{ name: '2,4,4-trimetilpentano', msg: 'Numerou do lado errado. Pela outra ponta os números são 2,2,4, que é menor (compara o primeiro número diferente: 2 < 4).' }],
      passos: ['Maior fila: **5** C → pentano.', 'Três metis → "tri".', 'Numera pela ponta do C que tem 2 metis: 2, 2 e 4.', '**2,2,4-trimetilpentano**.'],
    },
  ],
};
