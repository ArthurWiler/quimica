import type { Module } from './types';
import type { Ligand } from '../chem/stereo';

const lg = (id: string, label: string, smiles: string): Ligand => ({ id, label, smiles });
const H = lg('H', 'H', '[H]');
const CH3 = lg('CH3', 'CH₃', 'C');
const ET = lg('Et', 'C₂H₅', 'CC');
const OH = lg('OH', 'OH', 'O');
const CL = lg('Cl', 'Cl', 'Cl');
const BR = lg('Br', 'Br', 'Br');
const F = lg('F', 'F', 'F');

export const m9: Module = {
  id: 'optica',
  titulo: 'Isomeria óptica',
  emoji: '🪞',
  cor: '#8e4ec6',
  descricao: 'Carbono quiral, mão direita × mão esquerda, R e S, rotação da luz e excesso enantiomérico.',
  licoes: [
    {
      id: 'q-quiral',
      titulo: 'Carbono quiral: a mão',
      blocos: [
        { t: 'p', s: 'Olha suas mãos: uma é o **espelho** da outra, mas você não consegue colocar uma **em cima** da outra encaixando certinho. Moléculas assim são **quirais**.' },
        { t: 'p', s: 'O jeito mais comum de uma molécula ser quiral: ter um **carbono quiral** (ou estereogênico, ou assimétrico) = carbono com **4 ligantes diferentes**.' },
        { t: 'passo', s: '        CH₃\n        |\nH  –  C*  –  OH          butan-2-ol: o C* tem H, OH, CH₃ e C₂H₅\n        |                 → 4 diferentes → QUIRAL ✓\n        C₂H₅\n\n        CH₃\n        |\nH  –  C  –  CH₃          2-metilbutano: o C2 tem DOIS CH₃\n        |                 → NÃO é quiral ✗\n        C₂H₅' },
        { t: 'dica', s: 'Truque: C com **dupla**, CH₂ ou CH₃ **nunca** é quiral (já tem ligantes repetidos). Procura só os CH e os C com 4 coisas diferentes penduradas.' },
        { t: 'p', s: 'As duas versões espelhadas se chamam **enantiômeros**. Elas têm o mesmo PE, a mesma solubilidade... A diferença é como desviam a luz polarizada (e como agem no corpo).' },
      ],
    },
    {
      id: 'q-3d',
      titulo: 'Desenhando em 3D: cunhas',
      blocos: [
        { t: 'p', s: 'O carbono com 4 ligações é um **tetraedro**. No papel, a gente usa:' },
        { t: 'lista', itens: ['**linha normal** = no plano do papel', '**cunha cheia** ◀ = vem pra **frente** (pra você)', '**tracejado** = vai pra **trás** do papel'] },
        { t: 'tetra', place: { T: H, L: OH, R: ET, B: CH3 }, legenda: '(R)-butan-2-ol: H pra trás, OH e C₂H₅ pra frente, CH₃ no plano' },
        { t: 'p', s: 'Pra desenhar o **outro** enantiômero, é só trocar **dois ligantes** de lugar (por exemplo, o OH e o C₂H₅). Isso é o espelho!' },
        { t: 'tetra', place: { T: H, L: ET, R: OH, B: CH3 }, legenda: '(S)-butan-2-ol: o espelho' },
      ],
    },
    {
      id: 'q-cip',
      titulo: 'Prioridades (regras CIP)',
      blocos: [
        { t: 'p', s: 'Pra dar nome R ou S, primeiro dá uma **nota** pra cada ligante:' },
        {
          t: 'lista',
          itens: [
            '**Regra 1:** olha o átomo grudado no C*. **Maior número atômico = maior prioridade.**\n`I > Br > Cl > S > F > O > N > C > H`',
            '**Regra 2 (empate):** se dois ligantes começam com o mesmo átomo (ex.: dois C), olha os **vizinhos** dele, do maior pro menor, e compara até achar diferença.',
            '**Regra 3:** ligação **dupla conta dobrado**: C=O vale como se o C tivesse dois O.',
          ],
        },
        { t: 'passo', s: 'Exemplo: –CH₂OH × –CH₂CH₃ × –CH₃\n\n–CH₂OH  → C ligado a (O, H, H)   ← tem O: ganha\n–CH₂CH₃ → C ligado a (C, H, H)\n–CH₃    → C ligado a (H, H, H)   ← perde\n\nprioridade: CH₂OH > CH₂CH₃ > CH₃' },
        { t: 'passo', s: 'Exemplo: –CHO × –CH₂OH\n\n–CHO    → C ligado a (O, O, H)   ← o =O conta dobrado\n–CH₂OH  → C ligado a (O, H, H)\n\nprioridade: CHO > CH₂OH' },
      ],
    },
    {
      id: 'q-rs',
      titulo: 'R ou S?',
      blocos: [
        { t: 'lista', itens: ['Dá as prioridades 1, 2, 3, 4.', 'Deixa o **4** (o menor, quase sempre o H) **pra trás** (no tracejado).', 'Olha de frente e segue 1 → 2 → 3.', 'Girou no **sentido do relógio** ↻ = **R** (de "right", direita). **Contra** o relógio ↺ = **S**.'] },
        { t: 'tetra', place: { T: H, L: OH, R: ET, B: CH3 }, legenda: '(R)-butan-2-ol: 1 = OH (esquerda) → 2 = C₂H₅ (direita) → 3 = CH₃ (baixo): sentido horário ↻' },
        { t: 'atencao', s: 'Se o de **menor prioridade** estiver **pra frente** (na cunha), o sentido que você enxerga é o contrário: inverte a resposta!' },
        { t: 'dica', s: 'Trocar **dois** ligantes quaisquer de lugar inverte R ↔ S. Trocar duas vezes volta ao original.' },
      ],
    },
    {
      id: 'q-luz',
      titulo: 'Luz polarizada, (+) e (−), excesso enantiomérico',
      blocos: [
        { t: 'p', s: 'Um enantiômero puro gira a luz polarizada pra um lado; o outro gira **o mesmo tanto** pro lado oposto. Quem gira pra direita é **(+)** (dextrogiro), pra esquerda é **(−)** (levogiro).' },
        { t: 'atencao', s: 'R/S vem do **desenho** (regras de prioridade). (+)/(−) vem do **polarímetro** (experimento). Uma coisa **não** tem relação com a outra! No **R-(−)-butan-2-ol**, o R saiu do desenho e o (−) saiu da medida.' },
        { t: 'p', s: '**Mistura racêmica** = 50% de cada → um cancela o outro → rotação **0°**.' },
        { t: 'h', s: 'As contas' },
        { t: 'passo', s: 'excesso enantiomérico:\n\n   ee (%) = [α] da amostra ÷ [α] do puro × 100\n\n% do que está em excesso = (100 + ee) ÷ 2\n% do outro               = (100 − ee) ÷ 2\n\nE ao contrário: [α] da mistura = (ee ÷ 100) × [α] do puro' },
        { t: 'passo', s: 'Exemplo: R-(−)-butan-2-ol puro tem [α] = −13,52°.\nUma amostra deu −3,38°.\n\nee = 3,38 ÷ 13,52 × 100 = 25%   (excesso do R, porque o sinal é −)\n% R = (100 + 25) ÷ 2 = 62,5%\n% S = 37,5%' },
      ],
    },
    {
      id: 'q-varios',
      titulo: 'Vários carbonos quirais',
      blocos: [
        { t: 'p', s: 'Com **n** carbonos quirais diferentes, dá no máximo **2ⁿ** estereoisômeros, que formam **2ⁿ⁻¹** pares de enantiômeros (= misturas racêmicas possíveis).' },
        { t: 'passo', s: 'n = 1 → 2 isômeros, 1 racemato\nn = 2 → 4 isômeros, 2 racematos\nn = 3 → 8 isômeros, 4 racematos\nn = 4 → 16 isômeros, 8 racematos' },
        { t: 'p', s: 'Estereoisômeros que **não** são espelho um do outro são **diastereoisômeros** (ex.: o RR e o RS).' },
        { t: 'p', s: '**Composto meso:** quando a molécula tem 2 carbonos quirais **iguais** e um plano de simetria, o RS é igual ao SR, e ela **não** é quiral (rotação 0°). Por isso o 2,3-dibromobutano tem só **3** estereoisômeros (RR, SS e meso), e não 4.' },
        { t: 'tabela', head: ['Relação', 'Quer dizer'], rows: [['enantiômeros', 'espelho, não sobrepõe'], ['diastereoisômeros', 'estereoisômeros que não são espelho'], ['isômeros constitucionais', 'mesma fórmula, ligações diferentes'], ['mesmo composto', 'é só a mesma molécula girada']] },
      ],
    },
  ],
  exercicios: [
    {
      id: 'q01', tipo: 'pick', nivel: 1, licao: 'q-quiral',
      enunciado: 'Toque no **carbono quiral** do butan-2-ol.',
      smiles: 'CC(O)CC', formula: 'C4H10O', alvo: [1], alvoEl: 'C', quiral: true,
      passos: ['Procura um C com 4 ligantes diferentes.', 'O C do OH tem: H, OH, CH₃ e CH₂CH₃ → 4 diferentes ✓.'],
    },
    {
      id: 'q02', tipo: 'pick', nivel: 1, licao: 'q-quiral',
      enunciado: 'Toque no **carbono quiral** do 2-clorobutano.',
      smiles: 'CC(Cl)CC', formula: 'C4H9Cl', alvo: [1], alvoEl: 'C', quiral: true,
      passos: ['O C do Cl tem: H, Cl, CH₃ e CH₂CH₃ → 4 diferentes ✓.'],
    },
    {
      id: 'q03', tipo: 'choice', nivel: 1, licao: 'q-quiral',
      enunciado: 'O **2-metilbutano** tem carbono quiral?',
      smiles: 'CC(C)CC',
      opcoes: [{ txt: 'Não: o C2 tem dois CH₃ iguais' }, { txt: 'Sim, o C2', porque: 'Olha os ligantes do C2: H, CH₃, **CH₃** e C₂H₅. Tem repetido!' }, { txt: 'Sim, o C3', porque: 'O C3 é um CH₂: tem dois H, não pode ser quiral.' }],
      certa: 0,
      passos: ['C2: H, CH₃, CH₃, C₂H₅ → dois iguais ✗.', 'Os outros são CH₃ ou CH₂ ✗.', 'Nenhum quiral.'],
    },
    {
      id: 'q04', tipo: 'pick', nivel: 2, licao: 'q-quiral',
      enunciado: 'Toque em **todos** os carbonos quirais do 3-metilexano.',
      smiles: 'CCC(C)CCC', formula: 'C7H16', alvo: [2], alvoEl: 'C', quiral: true,
      passos: ['Só os CH podem ser quirais aqui: o único é o C3.', 'C3: H, CH₃, C₂H₅ (etil) e C₃H₇ (propil) → 4 diferentes ✓.'],
    },
    {
      id: 'q05', tipo: 'pick', nivel: 2, licao: 'q-quiral',
      enunciado: 'Toque em **todos** os carbonos quirais do 2,3-dibromobutano.',
      smiles: 'CC(Br)C(Br)C', formula: 'C4H8Br2', alvo: [1, 3], alvoEl: 'C', quiral: true,
      passos: ['C2: H, Br, CH₃ e CHBrCH₃ → 4 diferentes ✓.', 'C3: igualzinho, por simetria ✓.', 'São **dois**.'],
    },
    {
      id: 'q06', tipo: 'order', nivel: 1, licao: 'q-cip',
      enunciado: 'Ordene pela **prioridade CIP**:',
      de: 'maior prioridade', ate: 'menor prioridade',
      itens: [{ txt: 'Br', porque: 'Z = 35' }, { txt: 'OH', porque: 'O, Z = 8' }, { txt: 'NH₂', porque: 'N, Z = 7' }, { txt: 'H', porque: 'Z = 1' }],
      passos: ['Olha só o átomo grudado no C*: Br (35), O (8), N (7), H (1).', 'Maior número atômico ganha.'],
    },
    {
      id: 'q07', tipo: 'order', nivel: 2, licao: 'q-cip',
      enunciado: 'Ordene pela **prioridade CIP**:',
      de: 'maior prioridade', ate: 'menor prioridade',
      itens: [{ txt: 'CH₂Cl', porque: 'C (Cl, H, H)' }, { txt: 'CH₂OH', porque: 'C (O, H, H)' }, { txt: 'CH₂CH₃', porque: 'C (C, H, H)' }, { txt: 'CH₃', porque: 'C (H, H, H)' }],
      passos: ['Todos começam com C: empate!', 'Olha os vizinhos de cada C: (Cl,H,H), (O,H,H), (C,H,H), (H,H,H).', 'Compara o maior vizinho de cada: Cl > O > C > H.'],
    },
    {
      id: 'q08', tipo: 'order', nivel: 2, licao: 'q-cip',
      enunciado: 'Ordene pela **prioridade CIP**:',
      de: 'maior prioridade', ate: 'menor prioridade',
      itens: [{ txt: 'NH₂', porque: 'N, Z = 7' }, { txt: 'COOH', porque: 'C (O, O, O)' }, { txt: 'CH₃', porque: 'C (H, H, H)' }, { txt: 'H' }],
      passos: ['Primeiro átomo: N (7) ganha de C (6). Então NH₂ é o 1º, mesmo o COOH "parecendo maior".', 'COOH × CH₃: os dois começam com C → vizinhos (O,O,O) × (H,H,H) → COOH.', 'H é sempre o último.'],
    },
    {
      id: 'q09', tipo: 'order', nivel: 4, licao: 'q-cip',
      enunciado: 'Ordene pela **prioridade CIP** (essa é difícil, lembra da regra da ligação múltipla):',
      de: 'maior prioridade', ate: 'menor prioridade',
      itens: [
        { txt: 'C≡CH', porque: 'C (C, C, C): a tripla conta 3 vezes.' },
        { txt: 'CH=CH₂', porque: 'C (C, C, H): a dupla conta 2 vezes. Empata com o isopropil, mas no próximo nível o CH₂ tem (C,H,H) e ganha dos CH₃ (H,H,H).' },
        { txt: 'CH(CH₃)₂', porque: 'C (C, C, H).' },
        { txt: 'CH₂CH₃', porque: 'C (C, H, H).' },
      ],
      passos: ['Todos começam com C. Vizinhos: C≡CH (C,C,C); CH=CH₂ (C,C,H); CH(CH₃)₂ (C,C,H); CH₂CH₃ (C,H,H).', 'C≡CH ganha, CH₂CH₃ perde.', 'Empate vinil × isopropil: vai pro próximo nível. No vinil, o =CH₂ tem (C,H,H) (conta o C duplicado). No isopropil, os CH₃ têm (H,H,H). → vinil ganha.'],
    },
    {
      id: 'q10', tipo: 'stereo', nivel: 2, licao: 'q-rs',
      enunciado: 'Monte o **(R)-butan-2-ol**',
      ligantes: [OH, CH3, ET, H], alvo: 'R', prioridade: ['OH', 'Et', 'CH3', 'H'],
      passos: ['Prioridades: OH (O) > C₂H₅ > CH₃ > H.', 'Põe o H no tracejado (pra trás).', 'Agora 1 → 2 → 3 tem que girar no sentido do relógio: OH na esquerda, C₂H₅ na direita, CH₃ embaixo. Esquerda → direita (passando por cima) → baixo = ↻ = R.'],
    },
    {
      id: 'q11', tipo: 'stereo', nivel: 2, licao: 'q-rs',
      enunciado: 'Monte o **(S)-2-clorobutano**',
      ligantes: [CL, CH3, ET, H], alvo: 'S', prioridade: ['Cl', 'Et', 'CH3', 'H'],
      passos: ['Prioridades: Cl > C₂H₅ > CH₃ > H.', 'H no tracejado.', '1 → 2 → 3 contra o relógio (↺) = S. Ex.: Cl na direita, C₂H₅ na esquerda, CH₃ embaixo.'],
    },
    {
      id: 'q12', tipo: 'stereo', nivel: 3, licao: 'q-rs',
      enunciado: 'Monte o **(R)-bromoclorofluorometano**',
      ligantes: [BR, CL, F, H], alvo: 'R', prioridade: ['Br', 'Cl', 'F', 'H'],
      passos: ['Prioridades pelo número atômico: Br (35) > Cl (17) > F (9) > H (1).', 'H no tracejado.', 'Br → Cl → F no sentido do relógio = R.'],
    },
    {
      id: 'q13', tipo: 'choice', nivel: 3, licao: 'q-rs',
      enunciado: 'Esse carbono é **R** ou **S**?',
      tetras: [{ T: CH3, L: lg('vin', 'CH=CH₂', 'C=C'), R: CL, B: ET }], rsCheck: 'S',
      opcoes: [{ txt: 'R', porque: 'Confere as prioridades: Cl > CH=CH₂ > C₂H₅ > CH₃. O CH₃ (o menor) está pra trás; Cl (dir.) → vinil (esq.) → C₂H₅ (baixo) gira contra o relógio.' }, { txt: 'S' }],
      certa: 1,
      passos: ['Prioridades: Cl (17) > CH=CH₂ (C com C,C,H) > C₂H₅ (C com C,H,H) > CH₃.', 'O menor (CH₃) já está pra trás. ✓', 'Cl (direita) → CH=CH₂ (esquerda, por cima) → C₂H₅ (baixo): contra o relógio ↺ = **S**.'],
    },
    {
      id: 'q14', tipo: 'choice', nivel: 3, licao: 'q-rs',
      enunciado: 'Esse carbono é **R** ou **S**?',
      tetras: [{ T: H, L: OH, R: ET, B: CH3 }], rsCheck: 'R',
      opcoes: [{ txt: 'R' }, { txt: 'S', porque: 'OH (esquerda) → C₂H₅ (direita, passando por cima) → CH₃ (baixo) é o sentido do relógio.' }],
      certa: 0,
      passos: ['Prioridades: OH > C₂H₅ > CH₃ > H.', 'H pra trás ✓.', 'OH → C₂H₅ → CH₃: ↻ = **R**.'],
    },
    {
      id: 'q15', tipo: 'choice', nivel: 3, licao: 'q-rs',
      enunciado: 'As estruturas A e B são **enantiômeros** ou a **mesma molécula**?',
      tetras: [{ T: H, L: BR, R: CL, B: F }, { T: H, L: CL, R: BR, B: F }], parCheck: 'enantiômeros',
      opcoes: [{ txt: 'enantiômeros' }, { txt: 'a mesma molécula', porque: 'De A pra B trocaram de lugar **dois** ligantes (Br e Cl). Isso inverte R ↔ S.' }],
      certa: 0,
      passos: ['Compara: o Br e o Cl trocaram de lugar, o resto ficou igual.', 'Trocar dois ligantes = espelho = **enantiômeros**.', '(Ou calcula: A é R e B é S.)'],
    },
    {
      id: 'q16', tipo: 'choice', nivel: 4, licao: 'q-rs',
      enunciado: 'As estruturas A e B são **enantiômeros** ou a **mesma molécula**?',
      tetras: [{ T: CH3, L: H, R: OH, B: ET }, { T: OH, L: CH3, R: H, B: ET }], parCheck: 'mesmo',
      opcoes: [{ txt: 'enantiômeros', porque: 'Calcula R/S das duas: dá o mesmo. B é só a A girada (os 3 de cima rodaram juntos).' }, { txt: 'a mesma molécula' }],
      certa: 1,
      passos: ['Não dá pra ir só "no olho": calcula R/S de cada uma.', 'Prioridades: OH > C₂H₅ > CH₃ > H.', 'As duas dão o mesmo resultado (de A pra B, três ligantes rodaram em círculo: isso é girar a molécula, não espelhar).', 'Mesma configuração → **mesma molécula**.'],
    },
    {
      id: 'q17', tipo: 'number', nivel: 2, licao: 'q-luz',
      enunciado: 'O R-(−)-butan-2-ol puro tem [α] = −13,52°. Uma amostra deu **[α] = −6,76°**. Qual o **excesso enantiomérico** (ee)?',
      resposta: 50, tol: 0.6, unidade: '%',
      erros: [{ valor: 0.5, tol: 0.01, msg: 'A conta está certa, mas a resposta é em **porcentagem**: multiplica por 100.' }],
      passos: ['ee = [α] da amostra ÷ [α] do puro × 100.', 'ee = 6,76 ÷ 13,52 × 100 = **50%**.'],
    },
    {
      id: 'q18', tipo: 'number', nivel: 3, licao: 'q-luz',
      enunciado: 'Na mesma amostra (ee = 50%, com excesso do R), qual a **porcentagem do R**?',
      resposta: 75, tol: 0.6, unidade: '%',
      erros: [{ valor: 50, msg: '50% é o **excesso**, não o total de R. O resto (50%) é racêmico: metade R, metade S.' }, { valor: 25, msg: 'Esse é o S! O R é o que está em excesso, então tem mais dele.' }],
      passos: ['% do que está em excesso = (100 + ee) ÷ 2.', '(100 + 50) ÷ 2 = **75%** de R (e 25% de S).'],
    },
    {
      id: 'q19', tipo: 'number', nivel: 3, licao: 'q-luz',
      enunciado: 'Mistura: **3 mol** de S-(+)-butan-2-ol e **1 mol** de R-(−)-butan-2-ol. O R puro tem [α] = −13,52°. Qual o **[α] da mistura**?',
      resposta: 6.76, tol: 0.03, unidade: '°',
      erros: [{ valor: -6.76, tol: 0.03, msg: 'Quase! Olha o **sinal**: quem está em excesso é o **S**, que é (+).' }, { valor: 10.14, tol: 0.03, msg: 'Não é 75% do valor! O 1 mol de R cancela 1 mol de S. Sobra o **excesso**: 2 de 4 mol = 50%.' }],
      passos: ['1 mol de R cancela 1 mol de S (racêmico).', 'Sobram 2 mol de S "livres" em 4 mol no total → ee = 2/4 = 50% de S.', '[α] = 0,50 × (+13,52°) = **+6,76°**.'],
    },
    {
      id: 'q20', tipo: 'number', nivel: 2, licao: 'q-varios',
      enunciado: 'Quantos estereoisômeros, **no máximo**, tem uma molécula com **3** carbonos quirais?',
      resposta: 8, tol: 0,
      erros: [{ valor: 6, msg: 'Não é 2 × 3! É 2 **elevado** a 3.' }],
      passos: ['Máximo = 2ⁿ.', '2³ = 2 × 2 × 2 = **8**.'],
    },
    {
      id: 'q21', tipo: 'number', nivel: 2, licao: 'q-varios',
      enunciado: 'E quantas **misturas racêmicas** diferentes dá pra formar com esses 8 isômeros?',
      resposta: 4, tol: 0,
      passos: ['Cada racemato é um **par** de enantiômeros.', '8 isômeros ÷ 2 = **4** pares (= 2ⁿ⁻¹).'],
    },
    {
      id: 'q22', tipo: 'number', nivel: 3, licao: 'q-varios',
      enunciado: 'A glicose (forma de cadeia aberta) tem **4** carbonos quirais. Quantos isômeros ópticos ela pode ter, no máximo?',
      resposta: 16, tol: 0,
      passos: ['2ⁿ com n = 4.', '2⁴ = **16** (e 8 misturas racêmicas).'],
    },
    {
      id: 'q23', tipo: 'choice', nivel: 2, licao: 'q-luz',
      enunciado: 'No nome **R-(−)**-butan-2-ol, de onde vêm o R e o (−)?',
      opcoes: [
        { txt: 'R vem das regras de prioridade (desenho); (−) vem da medida no polarímetro (experimento)' },
        { txt: 'Os dois vêm do polarímetro', porque: 'R/S não precisa de experimento: sai do desenho com as regras CIP.' },
        { txt: 'R sempre é (+) e S sempre é (−)', porque: 'Não existe essa regra! O próprio exemplo é R e (−).' },
      ],
      certa: 0,
      passos: ['R/S: regra de prioridade + sentido de giro no desenho.', '(+)/(−): girou a luz pra direita ou pra esquerda no polarímetro.', 'Uma coisa não prevê a outra.'],
    },
    {
      id: 'q24', tipo: 'number', nivel: 3, licao: 'q-quiral',
      enunciado: 'Quantos carbonos, no **mínimo**, um alcano de cadeia aberta precisa ter pra ter um carbono quiral?',
      resposta: 7, tol: 0,
      erros: [{ valor: 4, msg: 'Com 4 C (butano, 2-metilpropano) não tem C com 4 ligantes diferentes. Lembra: num alcano, os ligantes têm que ser H + 3 grupos de carbono **diferentes**.' }, { valor: 6, msg: 'Com 6 C ainda não dá. Os 3 grupos de carbono têm que ser diferentes: o menor jeito é metil + etil + propil.' }],
      passos: ['Num alcano, o C quiral precisa de: H + 3 grupos de carbono diferentes.', 'Os menores grupos diferentes: metil (1) + etil (2) + propil (3).', '1 + 2 + 3 + o próprio C* = **7** → 3-metilexano.'],
    },
    {
      id: 'q25', tipo: 'number', nivel: 4, licao: 'q-luz',
      enunciado: 'Uma amostra de 2-metilbutan-1-ol tem [α] = **+4,605°**. O (R)-(+) puro tem [α] = +5,756°. Qual a **porcentagem de R** na amostra?',
      resposta: 90, tol: 0.6, unidade: '%',
      erros: [{ valor: 80, tol: 0.6, msg: '80% é o **excesso** enantiomérico. Falta um passo: % de R = (100 + ee) ÷ 2.' }],
      passos: ['ee = 4,605 ÷ 5,756 × 100 = 80% (excesso de R, porque o sinal é +, igual ao do R).', '% de R = (100 + 80) ÷ 2 = **90%**.'],
    },
    {
      id: 'q26', tipo: 'choice', nivel: 4, licao: 'q-varios',
      enunciado: 'Uma substância com **2 carbonos quirais** deu rotação **0°** no polarímetro. O que ela **pode** ser?',
      opcoes: [
        { txt: 'Uma mistura racêmica, ou um composto meso' },
        { txt: 'Só um enantiômero puro', porque: 'Enantiômero puro sempre gira a luz (≠ 0°).' },
        { txt: 'Nada, é impossível dar 0° com carbono quiral', porque: 'É possível: no racemato um cancela o outro, e no meso a molécula tem simetria interna.' },
      ],
      certa: 0,
      passos: ['Enantiômero puro → gira a luz → não dá 0°.', 'Racemato → um cancela o outro → 0°.', 'Meso → simetria interna → 0°.'],
    },
    {
      id: 'q27', tipo: 'choice', nivel: 4, licao: 'q-varios',
      enunciado: 'O **cis**-1,2-dimetilciclopropano (os dois CH₃ do mesmo lado do anel) é quiral?',
      opcoes: [
        { txt: 'Não: é meso, tem um plano de simetria cortando o anel no meio' },
        { txt: 'Sim, tem 2 carbonos quirais', porque: 'Ter carbono quiral não basta! Se a molécula tem plano de simetria, ela é meso (aquiral).' },
      ],
      certa: 0,
      passos: ['Os 2 C com CH₃ são estereogênicos.', 'Mas no cis, os dois lados são espelho um do outro: tem um plano de simetria.', 'Plano de simetria → **meso** → não é quiral. (O trans é quiral: existe como par de enantiômeros.)'],
    },
  ],
};
