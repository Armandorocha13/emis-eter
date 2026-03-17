Sprint 1: O Coração do HUB (Infraestrutura)
Prompt 01: Setup da Camada de Dados e Tipagem (SOLID)
"Crie o arquivo src/core/types/report.ts que define a interface padrão de um relatório, incluindo ID, título, slug (rota), ícone e metadados de contagem. Em seguida, configure o src/lib/excel-engine.ts usando a biblioteca 'xlsx'. O motor deve ser uma função genérica que recebe o nome do arquivo dentro da pasta /data e retorna um array de objetos JSON, tratando possíveis erros de leitura."

Prompt 02: O Motor de KPIs (Lógica de Negócio)
"No arquivo src/core/utils/report-stats.ts, crie uma função que percorre a pasta /data (ou lê uma constante de configuração) e retorna a contagem total de arquivos .xlsx disponíveis. Essa função deve alimentar o componente de KPI do HUB para que a contagem de '3 relatórios' (EMIS, Ferramentaria, Maquinários) seja dinâmica."

Sprint 2: Interface de Entrada (Shadcn + UI)
Prompt 03: Landing Page e Componente de Card
"Utilizando Next.js e Tailwind, crie a página src/app/page.tsx. Ela deve ter:

Uma seção superior com logo centralizada e efeito de fade-in.

Um componente KpiStats (usando Shadcn Card) que exibe o total de relatórios ativos.

Um grid de ReportCard (usando Shadcn Hover Card) que exiba o nome do relatório e um botão 'Acessar'. Aplique um design limpo, corporativo, com cores neutras e destaques em azul marinho ou grafite."

Sprint 3: Clonagem e Adaptação (Relatórios Novos)
Prompt 04: Abstração do EMIS para Novos Relatórios
"Baseado no código do relatório EMIS (que já existe), identifique a lógica de renderização de tabelas e gráficos. Extraia essa lógica para componentes reutilizáveis em src/components/shared/report-template. Agora, configure a página src/app/ferramentaria/page.tsx para consumir esses componentes, passando apenas o caminho do arquivo ferramentaria.xlsx como parâmetro para o excel-engine.ts."
