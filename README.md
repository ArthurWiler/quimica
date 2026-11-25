# Química da Sofia 🧪

App para revisar química orgânica do zero e praticar com exercícios que vão do super básico até mais difícil que a lista de exercícios.

**Acesse:** https://arthurwiler.github.io/quimica/

## O que tem

- **11 partes**: fundação (valência, H implícitos, ler fórmulas), cadeia principal, ramificações, álcool/éter/epóxi, aldeído/cetona, ácidos e sais, ésteres/cloretos de acila/anidridos, aminas/amidas, ponto de ebulição e solubilidade, isomeria óptica e um "chefão final".
- **Revisão** em cartões curtos, no estilo "ache a cobrinha → ache o númerozinho → cole tudo".
- **204 exercícios** de 7 tipos: montar a molécula com peças, dar o nome (com tolerância a acento/hífen), ordenar (PE, prioridade CIP), tocar nos átomos (carbono quiral, δ+), múltipla escolha, conta numérica e montar R/S com cunhas.
- **3 tentativas** por exercício, com diagnóstico do erro (ex.: "falta 1 O", "seu O está entre dois C, isso é éter", "numerou pelo lado errado"). Depois da 3ª, aparece o passo a passo e a resposta.
- Progresso salvo no próprio navegador.

## Desenvolvimento

```bash
npm install
npm run dev      # servidor local
npm test         # testes do gabarito (fórmulas, R/S, carbonos quirais, nomes...)
npm run build
```

O gabarito é verificado com o [OpenChemLib](https://github.com/cheminfo/openchemlib-js): toda resposta tem SMILES + fórmula escrita à parte, e os testes conferem que batem. O deploy no GitHub Pages é automático a cada push na `main` (`.github/workflows/deploy.yml`).
