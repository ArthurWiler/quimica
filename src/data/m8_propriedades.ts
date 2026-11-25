import type { Module } from './types';

export const m8: Module = {
  id: 'propriedades',
  titulo: 'Ponto de ebulição e solubilidade',
  emoji: '🔥',
  cor: '#f76b15',
  descricao: 'As forças entre as moléculas e o "checklist" pra ordenar PE e prever quem dissolve.',
  licoes: [
    {
      id: 'p-forcas',
      titulo: 'As forças entre moléculas',
      blocos: [
        { t: 'p', s: 'Ferver = **separar as moléculas umas das outras**. Quanto mais forte elas se "abraçam", mais calor precisa, e maior o PE.' },
        {
          t: 'tabela',
          head: ['Força', 'Quem tem', 'Força do abraço'],
          rows: [
            ['**dispersão** (London)', 'todo mundo (alcano só tem essa)', 'fraquinha, cresce com o tamanho'],
            ['**dipolo-dipolo**', 'moléculas polares sem O–H/N–H (cetona, aldeído, éter, éster, cloreto de acila)', 'média'],
            ['**ligação de hidrogênio**', 'H grudado em **O, N ou F** (álcool, ácido, amina 1ª/2ª, amida)', 'forte'],
            ['**íon-dipolo / iônica**', 'sais (–COO⁻ Na⁺)', 'muito forte'],
          ],
        },
        { t: 'passo', s: 'dispersão  <  dipolo-dipolo  <  ligação de H  <  íons\n (alcano)     (C=O, C–O–C)      (O–H, N–H)     (sal)' },
      ],
    },
    {
      id: 'p-checklist',
      titulo: 'Checklist do ponto de ebulição',
      blocos: [
        { t: 'p', s: 'Pra ordenar PE, responde as perguntas **nessa ordem**:' },
        {
          t: 'lista',
          itens: [
            '**1. Tem íon (sal)?** → fica no topo.',
            '**2. Faz ligação de H?** (tem O–H ou N–H) → vem logo abaixo. Quem tem **mais** grupos O–H/N–H ganha. Ácido (–COOH, faz dímero) > álcool > amina.',
            '**3. É polar** (tem O, N, Cl), mas sem O–H/N–H? → dipolo-dipolo, fica no meio.',
            '**4. Só C e H?** → fica embaixo.',
            '**Empate?** Molécula **maior** (mais massa) ganha. Mesmo tamanho: a **menos ramificada** ganha (tem mais superfície de contato).',
          ],
        },
        { t: 'passo', s: 'Exemplo (massas parecidas, ~72-74):\n\npentano  <  butanona  <  butan-1-ol  <  ác. propanoico  <  propanoato de sódio\n (apolar)    (C=O)      (O–H)          (COOH, dímero)      (iônico)' },
        { t: 'mols', itens: [{ smiles: 'CCCCC', legenda: 'pentano: 36 °C' }, { smiles: 'CC(C)(C)C', legenda: '2,2-dimetilpropano: 9,5 °C' }] },
        { t: 'dica', s: 'Pentano × 2,2-dimetilpropano: mesma fórmula (C₅H₁₂)! O ramificado é "bolinha" e encosta menos nas vizinhas: PE menor.' },
      ],
    },
    {
      id: 'p-solub',
      titulo: 'Quem dissolve na água?',
      blocos: [
        { t: 'p', s: '**Semelhante dissolve semelhante.** Água é muito polar e faz ligação de H. Pra dissolver nela, a molécula precisa:' },
        {
          t: 'lista',
          itens: [
            'ter uma parte que **conversa com a água** (O–H, C=O, O do éter, N, ou íons), e',
            'ter a parte **apolar pequena** (até uns 3-4 C por grupo polar).',
          ],
        },
        { t: 'passo', s: 'etanol (2 C)       → dissolve em qualquer quantidade\nbutan-1-ol (4 C)   → dissolve um pouco\nhexan-1-ol (6 C)   → quase nada\n\nquanto maior a "cauda" apolar, menos dissolve' },
        { t: 'p', s: 'Mais grupos polares = mais solúvel (ácido propanodioico com 2 COOH dissolve muito). Sal (íons) = íon-dipolo, dissolve muito bem.' },
        { t: 'p', s: 'E o contrário: molécula com cadeia grande e só um C=O (tipo decan-2-ona) dissolve bem em solvente **apolar** (hexano), porque a maior parte dela é apolar.' },
      ],
    },
  ],
  exercicios: [
    {
      id: 'p01', tipo: 'choice', nivel: 1, licao: 'p-forcas',
      enunciado: 'Qual força o **etanol** faz entre as moléculas dele, e o **etano** não?',
      opcoes: [{ txt: 'ligação de hidrogênio' }, { txt: 'dispersão de London', porque: 'Dispersão todo mundo tem, até o etano.' }, { txt: 'ligação iônica', porque: 'Nenhum dos dois tem íons.' }],
      certa: 0,
      passos: ['O etanol tem **O–H**: H grudado em O → ligação de hidrogênio.', 'O etano só tem C e H → só dispersão.'],
    },
    {
      id: 'p02', tipo: 'choice', nivel: 1, licao: 'p-checklist',
      enunciado: '**Pentano** ou **2,2-dimetilpropano** (mesma fórmula, C₅H₁₂): quem tem o maior PE?',
      opcoes: [{ txt: 'pentano' }, { txt: '2,2-dimetilpropano', porque: 'Ramificado = mais "bolinha" = menos superfície de contato = PE **menor**.' }, { txt: 'iguais, porque a fórmula é a mesma', porque: 'A massa é igual, mas o formato muda o contato entre as moléculas.' }],
      certa: 0,
      passos: ['Os dois são apolares (só dispersão) e têm a mesma massa.', 'Desempate: o **menos ramificado** tem mais contato → **pentano** (36 °C contra 9,5 °C).'],
    },
    {
      id: 'p03', tipo: 'order', nivel: 2, licao: 'p-checklist',
      enunciado: 'Ordem **crescente de PE** (massas parecidas, ~58-60):',
      de: 'menor PE', ate: 'maior PE',
      itens: [
        { txt: '2-metilpropano', smiles: 'CC(C)C', porque: 'Apolar e ramificado: −12 °C.' },
        { txt: 'butano', smiles: 'CCCC', porque: 'Apolar, sem ramificação: −0,5 °C.' },
        { txt: 'metoxietano', smiles: 'COCC', porque: 'Éter: polar, sem O–H. 7 °C.' },
        { txt: 'propan-1-ol', smiles: 'CCCO', porque: 'O–H: ligação de H. 97 °C.' },
      ],
      passos: ['Ligação de H? → propan-1-ol (o maior).', 'Polar sem O–H? → metoxietano.', 'Sobram dois apolares: o ramificado (2-metilpropano) é o menor.'],
    },
    {
      id: 'p04', tipo: 'order', nivel: 3, licao: 'p-checklist',
      enunciado: 'Ordem **crescente de PE** (massas parecidas):',
      de: 'menor PE', ate: 'maior PE',
      itens: [
        { txt: 'pentano', porque: 'Só dispersão: 36 °C.' },
        { txt: 'butan-2-ona', porque: 'Dipolo-dipolo (C=O): 80 °C.' },
        { txt: 'butan-1-ol', porque: 'Ligação de H (O–H): 118 °C.' },
        { txt: 'ácido propanoico', porque: 'Ligação de H mais forte e forma dímeros: 141 °C.' },
        { txt: 'propanoato de sódio', porque: 'Iônico! É um sólido que só derrete acima de 280 °C.' },
      ],
      passos: ['Íon? → propanoato de sódio no topo.', 'Ligação de H: ácido (COOH, dímero) > álcool.', 'Polar sem O–H: a cetona.', 'Apolar: pentano embaixo.'],
    },
    {
      id: 'p05', tipo: 'choice', nivel: 2, licao: 'p-solub',
      enunciado: 'Por que o **ácido etanoico** é tão solúvel em água?',
      opcoes: [
        { txt: 'Ele faz ligação de H com a água (doa pelo O–H e recebe pelos O) e a cadeia é curta' },
        { txt: 'Porque ele é apolar', porque: 'Ele é bem polar! E a água também.' },
        { txt: 'Porque ele é um sal', porque: 'O ácido não é sal. O sal seria o etanoato de sódio.' },
      ],
      certa: 0,
      passos: ['O –COOH doa H (O–H) e recebe nos dois O.', 'Só 2 C: a parte apolar é minúscula.', 'Resultado: dissolve em qualquer quantidade.'],
    },
    {
      id: 'p06', tipo: 'choice', nivel: 3, licao: 'p-solub',
      enunciado: 'A **octan-2-ona** dissolve bem em hexano (apolar). Por quê?',
      opcoes: [
        { txt: 'A maior parte da molécula é uma cadeia apolar de carbonos, parecida com o hexano' },
        { txt: 'Porque o C=O faz ligação de H com o hexano', porque: 'O hexano não tem H em O/N, ele não faz ligação de H.' },
        { txt: 'Porque cetona é sempre apolar', porque: 'O C=O é polar. Mas aqui ele é só um pedacinho no meio de 8 C.' },
      ],
      certa: 0,
      passos: ['8 C de cadeia + um único C=O.', 'A "cara" da molécula é apolar → semelhante ao hexano → dissolve.'],
    },
    {
      id: 'p07', tipo: 'choice', nivel: 2, licao: 'p-solub',
      enunciado: 'O **etanoato de metila** (CH₃COOCH₃) é solúvel em água?',
      opcoes: [
        { txt: 'Sim, razoavelmente: os O do éster recebem ligação de H da água e a molécula é pequena' },
        { txt: 'Não, porque éster não tem O–H', porque: 'Ele não **doa** ligação de H, mas **recebe**! A água doa o H pros O do éster.' },
        { txt: 'Sim, porque ele é iônico', porque: 'Éster não é iônico.' },
      ],
      certa: 0,
      passos: ['O éster tem O com pares livres → recebe ligação de H da água.', 'Só 3 C → parte apolar pequena.', 'Dissolve razoavelmente (~25 g em 100 mL).'],
    },
    {
      id: 'p08', tipo: 'order', nivel: 2, licao: 'p-solub',
      enunciado: 'Ordene pela **solubilidade em água**:',
      de: 'menos solúvel', ate: 'mais solúvel',
      itens: [
        { txt: 'hexan-1-ol', smiles: 'CCCCCCO', porque: '6 C de cauda: quase nada (6 g/L).' },
        { txt: 'butan-1-ol', smiles: 'CCCCO', porque: '4 C: um pouco (73 g/L).' },
        { txt: 'etanol', smiles: 'CCO', porque: '2 C: mistura em qualquer quantidade.' },
      ],
      passos: ['Os três têm um OH só.', 'O que muda é o tamanho da cauda apolar.', 'Menor cauda = mais solúvel.'],
    },
    {
      id: 'p09', tipo: 'choice', nivel: 2, licao: 'p-forcas',
      enunciado: 'Quando o metanoato de sódio dissolve na água, que interação segura o **Na⁺** às moléculas de água?',
      opcoes: [
        { txt: 'íon-dipolo: o Na⁺ fica cercado pelos O (δ−) das águas' },
        { txt: 'íon-dipolo: o Na⁺ fica cercado pelos H (δ+) das águas', porque: 'Cátion (+) atrai o lado **negativo** da água, que é o O (δ−).' },
        { txt: 'ligação covalente', porque: 'O Na⁺ não compartilha elétrons com a água, é só atração de cargas.' },
      ],
      certa: 0,
      passos: ['Na⁺ é positivo → atrai o lado negativo da água: o **O** (δ−).', 'O HCOO⁻ é negativo → atrai os **H** (δ+) da água.', 'Isso é **íon-dipolo** (solvatação).'],
    },
    {
      id: 'p10', tipo: 'pick', nivel: 2, licao: 'p-forcas',
      enunciado: 'No metoxietano, toque no átomo que **recebe** a ligação de hidrogênio da água.',
      smiles: 'COCC', formula: 'C3H8O', alvo: [1], alvoEl: 'O',
      passos: ['Quem recebe ligação de H é um átomo eletronegativo com par livre: O ou N.', 'Aqui só tem um O: o do meio.'],
    },
    {
      id: 'p11', tipo: 'order', nivel: 2, licao: 'p-checklist',
      enunciado: 'Ordem **crescente de PE** (massas ~44-46):',
      de: 'menor PE', ate: 'maior PE',
      itens: [
        { txt: 'propano', smiles: 'CCC', porque: '−42 °C.' },
        { txt: 'etanal', smiles: 'CC=O', porque: 'C=O polar: 20 °C.' },
        { txt: 'etanol', smiles: 'CCO', porque: 'O–H: 78 °C.' },
      ],
      passos: ['O–H → etanol (maior).', 'C=O sem O–H → etanal (meio).', 'Só C e H → propano (menor).'],
    },
    {
      id: 'p12', tipo: 'choice', nivel: 3, licao: 'p-checklist',
      enunciado: 'Por que aminas **terciárias** fervem mais baixo que aminas primárias parecidas?',
      opcoes: [
        { txt: 'Não têm H no N, então não fazem ligação de H entre elas' },
        { txt: 'Porque elas são mais pesadas', porque: 'Mais pesado aumentaria o PE, não diminuiria.' },
        { txt: 'Porque elas são iônicas', porque: 'Amina não é iônica.' },
      ],
      certa: 0,
      passos: ['Ligação de H precisa de H grudado no N.', 'Amina 3ª: o N tem 3 C e nenhum H.', 'Sem ligação de H → PE mais baixo.'],
    },
    {
      id: 'p13', tipo: 'choice', nivel: 3, licao: 'p-forcas',
      enunciado: 'Por que anidridos de cadeia curta são **líquidos**, enquanto alcanos de cadeia curta são **gases**?',
      opcoes: [
        { txt: 'O anidrido é bem polar (dois C=O): faz dipolo-dipolo forte, e ainda é mais pesado' },
        { txt: 'O anidrido faz ligação de H entre si', porque: 'Anidrido não tem O–H.' },
        { txt: 'O alcano é iônico', porque: 'Alcano só tem C e H, é apolar.' },
      ],
      certa: 0,
      passos: ['Anidrido: –CO–O–CO–, muito polar → dipolo-dipolo forte.', 'Alcano: apolar → só dispersão (fraquinha).', 'Abraço mais forte → precisa de mais calor → líquido na temperatura ambiente.'],
    },
    {
      id: 'p14', tipo: 'choice', nivel: 3, licao: 'p-forcas',
      enunciado: 'O cloreto de etanoíla dissolve em água, mas **não** faz ligação de H entre as próprias moléculas. Por quê?',
      opcoes: [
        { txt: 'Ele não tem H grudado em O/N pra doar, mas o O do C=O pode **receber** ligação de H da água' },
        { txt: 'Porque o Cl faz ligação de H', porque: 'O Cl não tem H grudado nele, e na prática não forma ligação de H.' },
        { txt: 'Porque ele é um sal', porque: 'É covalente, não é sal.' },
      ],
      certa: 0,
      passos: ['Pra fazer ligação de H entre iguais, precisa de quem **doa** (H em O/N) e quem **recebe**.', 'O cloreto de acila só tem quem recebe (O do C=O), não tem H pra doar.', 'Com a água funciona: a água doa o H. (E, além disso, ele reage com a água.)'],
    },
    {
      id: 'p15', tipo: 'order', nivel: 5, licao: 'p-checklist',
      enunciado: 'Desafio: ordem **crescente de PE** de 6 substâncias com massa quase igual (58-60):',
      de: 'menor PE', ate: 'maior PE',
      itens: [
        { txt: '2-metilpropano', porque: 'Apolar e ramificado: −12 °C.' },
        { txt: 'butano', porque: 'Apolar, linear: −0,5 °C.' },
        { txt: 'metoxietano', porque: 'Éter, dipolo fraco: 7 °C.' },
        { txt: 'propanal', porque: 'C=O, dipolo forte: 48 °C.' },
        { txt: 'propan-1-ol', porque: 'O–H, ligação de H: 97 °C.' },
        { txt: 'ácido etanoico', porque: 'COOH, ligações de H e dímeros: 118 °C.' },
      ],
      passos: ['Ligação de H: ácido (forma dímero) > álcool.', 'Polares sem O–H: o C=O (aldeído) é bem mais polar que o C–O–C (éter).', 'Apolares: o ramificado fica por último.'],
    },
    {
      id: 'p16', tipo: 'choice', nivel: 4, licao: 'p-solub',
      enunciado: 'Os ésteres do biodiesel têm cadeias de ~16-18 C. O que se espera deles?',
      opcoes: [
        { txt: 'Insolúveis em água e com PE bem acima de 100 °C (maior que o da água)' },
        { txt: 'Solúveis em água, porque éster tem O', porque: 'Com 16-18 C de cauda, a parte apolar manda.' },
        { txt: 'PE menor que o da água, porque não fazem ligação de H', porque: 'Não fazem ligação de H, mas são **enormes**: a dispersão de uma molécula gigante é forte. Fervem acima de 300 °C.' },
      ],
      certa: 0,
      passos: ['Cadeia gigante apolar → não dissolve em água.', 'Moléculas grandes → muita dispersão → PE alto (> 300 °C), maior que o da água.'],
    },
  ],
};
