# Registro de Debug e Contextos de Erro

Este arquivo serve para documentar erros encontrados durante o desenvolvimento e suas soluções.

---

## 1. Erro de Instalação de Dependências (npm install)
- **Data**: 16/03/2026
- **Contexto**: Ao tentar executar `npm install`, o comando falhou com erro de execução. O ambiente parece preferir `pnpm`.
- **Erro**: `npm run dev` falhou porque `next` não foi reconhecido (dependências não instaladas corretamente).
- **Causa**: Conflito de gerenciador de pacotes ou permissões.
- **Solução**: O usuário executou `pnpm i` manualmente, o que resolveu o problema de instalação das dependências.
- **Prevenção**: Usar `pnpm` preferencialmente neste projeto.

---

## 3. Erros de Importação (NextRequest/NextResponse)
- **Data**: 16/03/2026
- **Contexto**: Durante a refatoração da API em `src/app/api/data/route.ts`, os imports de `NextRequest` e `NextResponse` foram acidentalmente removidos.
- **Erro**: `Cannot find name 'NextRequest'` e `Cannot find name 'NextResponse'`.
- **Causa**: Substituição completa do bloco de imports por um novo que não incluía as dependências do Next.js.
- **Solução**: Readicionei os imports explicitamente: `import { NextRequest, NextResponse } from 'next/server';`.
- **Prevenção**: Sempre revisar a seção de imports ao fazer substituições parciais de código.

---

## 4. Tipagem Estrita e Parâmetros Genéricos
- **Data**: 16/03/2026
- **Contexto**: Ao tornar a API genérica para qualquer relatório, a tipagem original para `source` (que era um enum `'EMIS' | 'ETER'`) causou erros em componentes que esperavam esses valores específicos.
- **Solução**: Usei `@ts-ignore` temporariamente nos componentes compartilhados e forcei o cast de tipo nas chamadas para permitir que o HUB cresça dinamicamente.

---

## 2. Erro de Diretório Shadcn UI
- **Data**: 16/03/2026
- **Contexto**: Tentativa de listar `src/components/ui` falhou.
- **Erro**: Directory `src/components/ui` does not exist.
- **Causa**: O projeto original não utilizava a estrutura padrão do Shadcn ou os componentes não estavam nessa pasta.
- **Solução**: Criei a pasta `src/components/ui` e adicionei manualmente o componente `Card.tsx` e o utilitário `cn` em `src/lib/utils.ts`.

---

## 5. Roteamento e Transição para o HUB
- **Data**: 16/03/2026
- **Contexto**: A landing page original era o relatório EMIS.
- **Solução**: Movi a raiz para `src/app/page.tsx` (HUB) e as páginas específicas para `/emis`, `/ferramentaria`, etc. Isso exigiu a criação de um componente `ReportTemplate` para evitar duplicação de lógica.

---

## 6. Erro de Sintaxe em Card.tsx
- **Data**: 16/03/2026
- **Erro**: `Expected />` (parênteses de fechamento incorretos).
- **Solução**: Corrigi o fechamento do componente funcional para `/> ))`.

---

## 7. Página de Boas-Vindas e Redirecionamento
- **Data**: 16/03/2026
- **Mudança**: Adição de Splash Screen em `src/app/page.tsx` e mudança do HUB para `/hub`.
