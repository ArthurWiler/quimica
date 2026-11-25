import type { Module } from './types';
import type { Ligand } from '../chem/stereo';

const lg = (id: string, label: string, smiles: string): Ligand => ({ id, label, smiles });
const H = lg('H', 'H', '[H]');
const CH3 = lg('CH3', 'CH₃', 'C');

export const m10: Module = {
  id: 'chefao',
  titulo: 'Chefão final',
  emoji: '🐉',
  cor: '#1e1b3a',
  descricao: 'Tudo misturado e mais difícil que a lista. Se passar daqui, a prova vai parecer fácil.',
  licoes: [
    {
      id: 'x-estrategia',
      titulo: 'Como atacar qualquer questão',
      blocos: [
        { t: 'h', s: 'Desenhar a partir do nome' },
        { t: 'passo', s: '1. Ache o FINAL → função + tamanho da cobrinha\n   (…anoato de…ila = éster, …amida, cloreto de …oíla, anidrido…)\n2. Desenhe a cobrinha e numere.\n3. Ache os NÚMEROS e marque os carbonos.\n4. Ache as PALAVRAS ESTRANHAS (metil, sec-butil, oxi, epoxi, N-…)\n   e pendure cada uma no seu número.\n5. Cole tudo e confira as mãozinhas (C=4, N=3, O=2).' },
        { t: 'h', s: 'Dar nome a partir do desenho' },
        { t: 'passo', s: '1. Qual a função principal? (olha o grupo com O/N/Cl)\n2. Maior cobrinha que PASSA pelo grupo principal.\n3. Numere pela ponta mais perto do grupo principal.\n4. Rabinhos em ordem alfabética, com di/tri se repetir.\n5. Final certo: -al, -ona, -oico, -oato de …ila, -amida, -amina…' },
        { t: 'h', s: 'Comparar PE / solubilidade' },
        { t: 'passo', s: 'íon  >  lig. H (mais grupos O–H/N–H ganha)  >  dipolo  >  só dispersão\nempate → maior massa ganha → menos ramificado ganha' },
        { t: 'h', s: 'Isomeria óptica' },
        { t: 'passo', s: 'C* = 4 ligantes diferentes\nprioridade = número atômico (empate → olha os vizinhos; dupla conta 2×)\nmenor pra trás → 1→2→3 ↻ = R, ↺ = S\nee = [α]amostra / [α]puro × 100  →  % maior = (100 + ee)/2' },
        { t: 'dica', s: 'Travou? Toca em "📖 revisar a matéria" dentro do exercício. E se errar 3 vezes, o passo a passo aparece: lê com calma e depois aperta "tentar de novo do zero".' },
      ],
    },
  ],
  exercicios: [
    {
      id: 'x01', tipo: 'build', nivel: 4, licao: 'x-estrategia',
      enunciado: 'Monte o **2,3-epoxi-4-metilpentano**',
      smiles: 'CC1OC1C(C)C', formula: 'C6H12O',
      passos: ['Final: pentano → 5 C.', '2,3-epoxi → O fazendo ponte entre C2 e C3.', '4-metil → CH₃ no C4.\n```\n      O\n     / \\\nC - C - C - C - C\n            |\n            CH₃\n```'],
    },
    {
      id: 'x02', tipo: 'build', nivel: 4, licao: 'x-estrategia',
      enunciado: 'Monte o **1,4-epoxi-2,2-dimetilbutano**',
      smiles: 'C1C(C)(C)CCO1', formula: 'C6H12O',
      passos: ['butano → 4 C.', '1,4-epoxi → O ligando o C1 e o C4: fecha um anel de 5 (4 C + O).', '2,2-dimetil → dois CH₃ no C2.'],
    },
    {
      id: 'x03', tipo: 'build', nivel: 5, licao: 'x-estrategia',
      enunciado: 'Monte a **N-terc-butil-N-etilbutanamida**',
      smiles: 'CCCC(=O)N(CC)C(C)(C)C', formula: 'C10H21NO',
      passos: ['butanamida: CH₃CH₂CH₂–C(=O)–N.', 'N-etil: CH₂CH₃ no N.', 'N-terc-butil: C(CH₃)₃ também no N (gruda pelo C central).', 'O N fica sem H (amida terciária).'],
    },
    {
      id: 'x04', tipo: 'build', nivel: 4, licao: 'x-estrategia',
      enunciado: 'Monte o **anidrido benzoico etanoico**',
      smiles: 'CC(=O)OC(=O)C1=CC=CC=C1', formula: 'C9H8O3',
      passos: ['Anidrido: –CO–O–CO–.', 'Um lado: benzoico → anel–C(=O)–.', 'Outro lado: etanoico → CH₃–C(=O)–.', 'anel–C(=O)–O–C(=O)–CH₃.'],
    },
    {
      id: 'x05', tipo: 'build', nivel: 5, licao: 'x-estrategia',
      enunciado: 'Monte o **cloreto de 3-etil-2-metilpentanoíla**',
      smiles: 'ClC(=O)C(C)C(CC)CC', formula: 'C8H15ClO',
      passos: ['pentanoíla: 5 C, com o C1 sendo o C(=O)Cl.', '2-metil: CH₃ no C2.', '3-etil: CH₂CH₃ no C3.\n```\nCl–C(=O)–CH–CH–CH₂–CH₃\n          |   |\n         CH₃  CH₂CH₃\n```'],
    },
    {
      id: 'x06', tipo: 'name', nivel: 5, licao: 'x-estrategia',
      enunciado: 'Dê o nome IUPAC:',
      smiles: 'CC(C)OC(C)(C)CC', formula: 'C8H18O', aceitos: ['2-isopropoxi-2-metilbutano', '2-(isopropoxi)-2-metilbutano'],
      erros: [{ name: '2-metil-2-isopropoxibutano', msg: 'Tudo certo, menos a ordem: **i**sopropoxi vem antes de **m**etil (ordem alfabética).' }],
      passos: ['Éter. Lado maior do O: C(CH₃)₂CH₂CH₃ → maior cobrinha 4 C (butano) com um metil.', 'Lado menor: CH(CH₃)₂ → isopropoxi.', 'O e o metil estão os dois no C2.', 'Ordem alfabética: **2-isopropoxi-2-metilbutano**.'],
    },
    {
      id: 'x07', tipo: 'name', nivel: 5, licao: 'x-estrategia',
      enunciado: 'Dê o nome IUPAC (cuidado com a cobrinha!):',
      smiles: 'CCCC(C(C)C)C(C)=O', formula: 'C9H18O', aceitos: ['3-isopropilexan-2-ona', '3-isopropil-hexan-2-ona', '3-isopropil-2-hexanona'],
      erros: [{ name: '3-propil-4-metilpentan-2-ona', msg: 'A cobrinha tem que ser a **maior** possível passando pelo C=O: indo pelo lado do propil dá 6 C, não 5.' }],
      passos: ['Maior cadeia passando pelo C=O: CH₃–CO–CH–CH₂–CH₂–CH₃ = **6** C (indo pelo propil).', 'C=O no C2 → hexan-2-ona.', 'O que sobrou no C3: CH(CH₃)₂ = isopropil.', '**3-isopropilexan-2-ona**.'],
    },
    {
      id: 'x08', tipo: 'order', nivel: 5, licao: 'x-estrategia',
      enunciado: 'Ordem **crescente de PE**:',
      de: 'menor PE', ate: 'maior PE',
      itens: [
        { txt: 'pentano', porque: 'Só dispersão: 36 °C.' },
        { txt: 'butanal', porque: 'Dipolo (C=O): 75 °C.' },
        { txt: 'butan-1-ol', porque: 'Ligação de H: 118 °C.' },
        { txt: 'ácido propanoico', porque: 'Ligação de H + dímero: 141 °C.' },
        { txt: 'butanamida', porque: 'NH₂ com C=O: muitas ligações de H por molécula: 216 °C.' },
        { txt: 'propanoato de sódio', porque: 'Iônico: sólido, derrete acima de 280 °C.' },
      ],
      passos: ['Íon → propanoato de sódio no topo.', 'Amida primária: 2 H no N + C=O muito polar → a maior entre as moleculares.', 'Ácido (dímero) > álcool.', 'Aldeído (dipolo) > alcano (dispersão).'],
    },
    {
      id: 'x09', tipo: 'stereo', nivel: 4, licao: 'x-estrategia',
      enunciado: 'Monte o **(S)-3-metilexano**',
      ligantes: [H, CH3, lg('Et', 'C₂H₅', 'CC'), lg('Pr', 'C₃H₇', 'CCC')], alvo: 'S', prioridade: ['Pr', 'Et', 'CH3', 'H'],
      passos: ['Ligantes do C3: H, CH₃, C₂H₅ e C₃H₇.', 'Prioridade: C₃H₇ > C₂H₅ (empate no 1º C, ganha no 2º nível) > CH₃ > H.', 'H pra trás; propil → etil → metil contra o relógio = S.'],
    },
    {
      id: 'x10', tipo: 'stereo', nivel: 4, licao: 'x-estrategia',
      enunciado: 'Monte a **(S)-alanina** (ácido 2-aminopropanoico)',
      ligantes: [lg('NH2', 'NH₂', 'N'), lg('COOH', 'COOH', 'C(=O)O'), CH3, H], alvo: 'S', prioridade: ['NH2', 'COOH', 'CH3', 'H'],
      passos: ['Ligantes: NH₂, COOH, CH₃, H.', 'Prioridade: NH₂ (N=7) > COOH (C com O,O,O) > CH₃ > H.', 'H pra trás; NH₂ → COOH → CH₃ contra o relógio = S.'],
    },
    {
      id: 'x11', tipo: 'stereo', nivel: 5, licao: 'x-estrategia',
      enunciado: 'Monte o **(S)-ibuprofeno** (o C quiral tem: COOH, CH₃, H e o anel com isobutil)',
      ligantes: [lg('COOH', 'COOH', 'C(=O)O'), lg('Ar', 'anel', 'C1=CC=C(CC(C)C)C=C1'), CH3, H], alvo: 'S', prioridade: ['COOH', 'Ar', 'CH3', 'H'],
      passos: ['Prioridade: COOH (C com O,O,O) > anel (C com C,C,C) > CH₃ (C com H,H,H) > H.', 'H pra trás; COOH → anel → CH₃ contra o relógio = S.'],
    },
    {
      id: 'x12', tipo: 'number', nivel: 5, licao: 'x-estrategia',
      enunciado: 'O 2,3-dibromobutano tem 2 carbonos quirais. Quantos estereoisômeros ele tem **de verdade**?',
      resposta: 3, tol: 0,
      erros: [{ valor: 4, msg: 'A fórmula 2ⁿ dá o **máximo**. Mas aqui os dois C* são iguais: o RS e o SR são a mesma molécula (meso).' }],
      passos: ['Máximo seria 2² = 4: RR, SS, RS, SR.', 'Os dois C* têm os mesmos ligantes (H, Br, CH₃, CHBrCH₃).', 'RS = SR, e tem plano de simetria → meso.', 'Total: RR, SS e meso = **3**.'],
    },
    {
      id: 'x13', tipo: 'number', nivel: 5, licao: 'x-estrategia',
      enunciado: 'Uma mistura tem **30% de R** e **70% de S**. O S puro tem [α] = +20,0°. Qual o [α] da mistura?',
      resposta: 8, tol: 0.05, unidade: '°',
      erros: [{ valor: 14, tol: 0.05, msg: 'Não é 70% de 20! Os 30% de R cancelam 30% de S. Sobra o excesso: 70 − 30 = 40%.' }, { valor: -8, tol: 0.05, msg: 'O sinal! Quem sobra é o S, que é (+).' }],
      passos: ['30% de R cancela 30% de S.', 'ee = 70 − 30 = 40% de S.', '[α] = 0,40 × (+20,0°) = **+8,0°**.'],
    },
    {
      id: 'x14', tipo: 'build', nivel: 4, licao: 'x-estrategia',
      enunciado: 'Monte o **ácido 2-metil-3-fenilpropanoico**',
      smiles: 'OC(=O)C(C)CC1=CC=CC=C1', formula: 'C10H12O2',
      passos: ['propanoico: COOH(C1)–C2–C3.', '2-metil: CH₃ no C2.', '3-fenil: o anel grudado no C3.\n```\nHOOC – CH – CH₂ – ⬡\n       |\n       CH₃\n```'],
    },
    {
      id: 'x15', tipo: 'build', nivel: 5, licao: 'x-estrategia',
      enunciado: 'Monte o **2-etoxi-3-metilbutanal**',
      smiles: 'O=CC(OCC)C(C)C', formula: 'C7H14O2',
      passos: ['butanal: CHO(C1)–C2–C3–C4.', '2-etoxi: O–CH₂CH₃ no C2.', '3-metil: CH₃ no C3.'],
    },
    {
      id: 'x16', tipo: 'name', nivel: 5, licao: 'x-estrategia',
      enunciado: 'Dê o nome:',
      smiles: 'CCOC(=O)C(C)CC(C)C', formula: 'C9H18O2', aceitos: ['2,4-dimetilpentanoato de etila'],
      erros: [{ name: '2,4-dimetilpentanoato de metila', msg: 'O lado preso no O tem 2 C: **etila**.' }],
      passos: ['Éster: lado do C=O + lado do O.', 'Lado do C=O: cobrinha de 5 C (C1 = C=O) com metis no C2 e C4 → 2,4-dimetilpentanoato.', 'Lado do O: CH₂CH₃ → de etila.'],
    },
    {
      id: 'x17', tipo: 'build', nivel: 4, licao: 'x-estrategia',
      enunciado: 'Monte **qualquer amida terciária** de fórmula **C₅H₁₁NO**',
      smiles: 'CCC(=O)N(C)C', formula: 'C5H11NO', aberta: { grupo: 'amida terciária' },
      passos: ['Amida terciária: C(=O)–N com mais 2 carbonos no N (nenhum H no N).', 'Divide os 5 C. Ex.: 3 do lado do C=O + 2 metis no N.', 'Uma resposta: **N,N-dimetilpropanamida**.'],
    },
    {
      id: 'x18', tipo: 'build', nivel: 3, licao: 'x-estrategia',
      enunciado: 'Monte **qualquer éster** de fórmula **C₄H₈O₂**',
      smiles: 'CC(=O)OCC', formula: 'C4H8O2', aberta: { grupo: 'éster' },
      passos: ['Éster: –C(=O)–O–C.', '4 C pra dividir entre os dois lados.', 'Exemplos: etanoato de etila, propanoato de metila, metanoato de propila...'],
    },
    {
      id: 'x19', tipo: 'pick', nivel: 4, licao: 'x-estrategia',
      enunciado: 'Toque em **todos** os carbonos quirais do **ibuprofeno**.',
      smiles: 'CC(C)CC1=CC=C(C=C1)C(C)C(=O)O', formula: 'C13H18O2', alvo: [10], alvoEl: 'C', quiral: true,
      passos: ['Descarta: CH₃, CH₂, C do anel (dupla) e C do COOH (dupla).', 'O CH do isobutil tem dois CH₃ → não.', 'Sobra o CH entre o anel e o COOH: H, CH₃, COOH, anel → 4 diferentes ✓.'],
    },
    {
      id: 'x20', tipo: 'pick', nivel: 4, licao: 'x-estrategia',
      enunciado: 'Toque em **todos** os carbonos quirais da **metildopa**.',
      smiles: 'CC(N)(CC1=CC(O)=C(O)C=C1)C(=O)O', formula: 'C10H13NO4', alvo: [1], alvoEl: 'C', quiral: true,
      passos: ['Esse C* não tem H! Ele tem: CH₃, NH₂, COOH e CH₂–anel.', '4 ligantes diferentes ✓ (não precisa ter H pra ser quiral).'],
    },
    {
      id: 'x21', tipo: 'pick', nivel: 5, licao: 'x-estrategia',
      enunciado: 'Toque em **todos** os carbonos quirais da **penicilamina**.',
      smiles: 'CC(C)(S)C(N)C(=O)O', formula: 'C5H11NO2S', alvo: [4], alvoEl: 'C', quiral: true,
      passos: ['O C com SH tem **dois** CH₃ → não é quiral.', 'O C com NH₂ tem: H, NH₂, COOH e C(CH₃)₂SH → 4 diferentes ✓.'],
    },
    {
      id: 'x22', tipo: 'build', nivel: 5, licao: 'x-estrategia',
      enunciado: 'Monte o **cloreto de p-isopropilbenzoíla** (primo do p-sec-butil da sua lista)',
      smiles: 'CC(C)C1=CC=C(C=C1)C(=O)Cl', formula: 'C10H11ClO',
      passos: ['Cloreto de benzoíla: anel–C(=O)Cl.', 'p-isopropil: –CH(CH₃)₂ no canto **oposto** do anel (posição para).'],
    },
  ],
};
