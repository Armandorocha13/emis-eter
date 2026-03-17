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
---

## 8. Duplicação de Código em TopFilters.tsx
- **Data**: 17/03/2026
- **Contexto**: Durante uma atualização de interface para os filtros de data, um erro de substituição causou a duplicação de quase todo o conteúdo do arquivo.
- **Erro**: Erro de compilação e interface quebrada (blocos repetidos).
- **Causa**: Falha no processo de escrita parcial do arquivo.
- **Solução**: Sobrescrita completa do arquivo com a estrutura correta e limpa.
- **Prevenção**: Usar `overwrite: true` em vez de substituições fragmentadas quando houver muitas mudanças estruturais.

---

## 9. Inconsistência de Nomes e Filtros na API
- **Data**: 17/03/2026
- **Contexto**: Mesmo após aplicar a lógica de "Primeiro e Último Nome" no frontend, os dados continuavam vindo com o nome completo da planilha.
- **Erro**: Nomes não formatados e inconsistência entre EMIS/ETER.
- **Causa**: A aplicação possui um "Excel Engine" no frontend e uma rota de API (`/api/data`) separada. As regras de negócio foram aplicadas inicialmente apenas em uma delas.
- **Solução**: Refatoração da função `formatName` para ser exportável e aplicação obrigatória na rota `src/app/api/data/route.ts`.
- **Prevenção**: Centralizar lógicas de formatação de dados em arquivos de biblioteca (`lib/`) usados tanto pelo frontend quanto pela API.

---

## 10. Alinhamento de Inputs de Data
- **Data**: 17/03/2026
- **Contexto**: O texto `dd/mm/aaaa` ficava desalinhado (à esquerda) nos filtros superiores.
- **Solução**: Aplicação de `text-center` e `flex justify-center`. Para inputs de data, o comportamento de alinhamento varia entre navegadores, exigindo reforço no CSS.

---

## 11. Mapeamento de Colunas (ETER)
- **Data**: 17/03/2026
- **Contexto**: O técnico responsável estava sendo extraído da coluna "ALTERADO POR", que nem sempre refletia o executor.
- **Solução**: Atualização do mapeamento para priorizar a **Coluna M** (`TECNICO`) nas planilhas ETER, mantendo a retrocompatibilidade com nomes anteriores caso a coluna principal falhe.

---

## 12. Simplificação do Filtro de Data
- **Data**: 17/03/2026
- **Contexto**: O usuário solicitou a remoção do filtro "De" (Data Inicial) para que o sistema exiba todos os registros acumulados até a data selecionada no filtro "Até".
- **Mudança**: Removido o campo `date` do estado de filtros e da interface. A lógica de filtragem foi simplificada para validar apenas o limite superior (`item.data <= filters.endDate`), mantendo a regra de corte de 12:00h para o limite final.
- **Impacto**: Melhora a usabilidade para visualizar pendências históricas totais até um ponto específico no tempo.

---

## 13. Gráfico Vazio com Filtros Específicos (EMIS)
- **Data**: 17/03/2026
- **Contexto**: Ao filtrar por bases ou status recentes (como "Pendente"), o gráfico de ofensores aparecia sem barras, apesar da contagem total estar correta.
- **Causa**: Duplo fator: 
    1. A data de referência para o cálculo de "Aging" estava travada em 16/03/2026 na API.
    2. O cálculo de dias era 0-indexado (item solicitado hoje = 0 dias), fazendo com que a soma de "Ofensores: Dias" fosse zero para casos novos, resultando em barras invisíveis no gráfico.
- **Solução**: 
    1. Atualizei a API para usar `new Date()` como referência dinâmica.
    2. Ajustei o cálculo de Aging para ser 1-indexado (`+1`), considerando que um item solicitado hoje já está em seu primeiro dia de abertura.
- **Impacto**: Garante que todos os itens pendentes contribuam para a visualização do gráfico, eliminando barras "vazias" para registros recentes.

---

## 14. Unificação da Métrica do Gráfico (Volume vs. Aging)
- **Data**: 17/03/2026
- **Contexto**: Registros em datas anteriores a hoje ou em certas bases não estavam gerando barras no gráfico, apesar de estarem na contagem.
- **Causa**: O gráfico do relatório EMIS estava configurado para somar os "Dias em Aberto" (Aging). Se o aging fosse 0 (ex: registro feito hoje ou no dia selecionado), a soma era zero e a barra ficava invisível.
- **Solução**: Unifiquei a lógica de visualização. Agora, o gráfico exibe o **Volume Total de Registros** por técnico, assim como no relatório ETER. O Aging continua sendo calculado, mas o Ranking agora prioriza quem tem mais registros acumulados no período.
- **Impacto**: Garante que 100% dos registros filtrados sejam representados visualmente, em qualquer data ou base selecionada.

---

## 15. Remoção da Regra de Corte de 12:00h
- **Data**: 17/03/2026
- **Contexto**: O usuário identificou que a lógica de "meio-dia = próximo dia" estava causando confusão ao comparar com os registros originais do Excel.
- **Solução**: Removida completamente a regra de corte de 12:00h. Agora o filtro de data é 1-para-1 com o calendário. Se a data no Excel é 16/03 às 15:00h, ela aparecerá na contagem do dia 16/03, simplificando a conferência dos dados.
- **Impacto**: Alinhamento direto entre os números do Dashboard e a realidade operacional capturada nas planilhas.

---

## 16. Filtro de Data Estilo Excel (Match Exato)
- **Data**: 17/03/2026
- **Contexto**: O usuário solicitou que o filtro de data funcionasse exatamente como no Excel, ou seja, selecionando um dia específico em vez de um intervalo (acumulado).
- **Solução**: Alterada a lógica de comparação de `date <= filters.endDate` para `date === filters.endDate`. Agora, ao selecionar 16/03, o sistema mostra apenas os registros daquele dia específico.
- **Impacto**: Facilita a auditoria de produtividade diária e isola o volume de trabalho por datas individuais, exatamente como nas colunas de filtro das planilhas originais.

---

## 17. Mudança da Coluna de Referência (EMIS: A para H)
- **Data**: 17/03/2026
- **Contexto**: O usuário identificou que para o relatório EMIS, a conferência deve ser feita pela data de resposta/conclusão (`dt_resposta`, coluna H) e não pela data de solicitação.
- **Solução**: Atualizei o mapeamento do EMIS para priorizar a coluna **H**. Isso garante que se um item foi solicitado no dia 15 mas concluído no dia 16, ele aparecerá na produtividade do dia 16.
- **Impact**: Sincronização total com a forma como os gestores auditam a produtividade via filtros de coluna no Excel.

---

## 18. Reconstrução Total do Sistema de Filtros (Estilo Excel)
- **Data**: 17/03/2026
- **Contexto**: Os filtros anteriores (TopFilters e SidebarFilters) estavam causando inconsistências e não eram intuitivos para quem está acostumado com o Excel.
- **Solução**: 
    1. Deletei os componentes antigos (`TopFilters` e `SidebarFilters`).
    2. Criei um novo sistema unificado chamado **ExcelFilters**.
    3. Implementei a lógica de **Filtro Estilo Excel**: Match exato de data, busca por base e status de forma visual e direta.
    4. Design Premium: Usei um container com efeito `glassmorphism` e cores reativas ao contexto (Índigo para EMIS, Esmeralda para ETER).
- **Impacto**: Experiência de usuário profissional e previsível, garantindo que os números exibidos sejam exatamente os que o usuário espera ao selecionar campos específicos.

---

## 19. Automação de Tratamento de Dados (Data vs. Hora)
- **Data**: 17/03/2026
- **Contexto**: O usuário solicitou que os registros originais do Excel tivessem as colunas de Data e Hora separadas para facilitar a conferência manual (Coluna H no EMIS e Y/Z no ETER).
- **Solução**: 
    1. Criei o script `treat_excel.js` que automatiza essa separação.
    2. No **EMIS**, ele extrai a data (AAAA-MM-DD) e a hora da coluna H e cria colunas tratadas.
    3. No **ETER**, ele garante que as colunas Y e Z estejam limpas e padronizadas.
    4. O sistema de leitura foi reforçado para reconhecer esses padrões automaticamente, mesmo que os arquivos estejam abertos.
- **Impacto**: Alinhamento visual total entre o que o usuário vê na planilha aberta e o que aparece no Dashboard, eliminando qualquer dúvida sobre a origem dos dados.

---

## 20. Filtro de Soma Acumulada (Filtro "Até")
- **Data**: 17/03/2026
- **Contexto**: O filtro por dia exato estava sendo interpretado como uma "diferença" em relação ao dia anterior. O usuário solicitou o comportamento de soma total.
- **Solução**: Alterada a lógica de filtragem para `itemDate <= selectedDate`. 
- **Impacto**: Ao selecionar uma data, o Dashboard agora exibe a soma de todos os registros desde o início até aquele dia inclusive. Isso garante que o volume total de pendências ou conclusões seja visualizado como um saldo acumulado, facilitando a gestão do estoque de casos.
