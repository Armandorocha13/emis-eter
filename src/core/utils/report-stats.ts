import fs from "fs";
import path from "path";

/**
 * Função para contar dinamicamente os relatórios (.xlsx) na pasta /data.
 * Isso permite alimentar o KPI de total de relatórios.
 * 
 * @returns O número de relatórios (agrupando EMIS e ETER como um só).
 */
export function getTotalReportsCount(): number {
  try {
    const dataDir = path.join(process.cwd(), "data");

    if (!fs.existsSync(dataDir)) return 0;

    const files = fs.readdirSync(dataDir);
    const excelFiles = files.filter(file => file.endsWith(".xlsx"));
    
    // Filtra EMIS e ETER para contar como um só, e remove Maquinários/Ferramentaria
    const hasEmisOrEter = excelFiles.some(f => f.toUpperCase().startsWith('EMIS') || f.toUpperCase().startsWith('ETER'));
    const others = excelFiles.filter(f => {
      const upperName = f.toUpperCase();
      return (
        !upperName.startsWith('EMIS') && 
        !upperName.startsWith('ETER') && 
        !upperName.includes('MAQUINÁRIOS') && 
        !upperName.includes('FERRAMENTARIA') &&
        !f.endsWith('.bak')
      );
    });

    // +1 para EMIS/ETER (se existir) e +3 para os relatórios externos (Mercosat, Giro, Carta de Controle)
    return others.length + (hasEmisOrEter ? 1 : 0) + 3;
  } catch (error) {
    console.error("Erro ao ler a pasta /data para contagem de relatórios:", error);
    return 0;
  }
}

/**
 * Retorna metadados básicos dos relatórios disponíveis, tratando EMIS x ETER como um só.
 */
export function getAvailableReportsMetada() {
    try {
        const dataDir = path.join(process.cwd(), "data");
        if (!fs.existsSync(dataDir)) return [];
        
        const files = fs.readdirSync(dataDir);
        const excelFiles = files.filter(file => file.endsWith(".xlsx"));

        const reports: any[] = [];
        
        // Verifica se EMIS ou ETER existem para criar o card unificado
        const hasEmis = excelFiles.some(f => f.toUpperCase() === 'EMIS.XLSX');
        const hasEter = excelFiles.some(f => f.toUpperCase() === 'ETER.XLSX');

        if (hasEmis || hasEter) {
            reports.push({
                id: 'dashboard', // Rota unificada
                title: 'EMIS x ETER',
                filename: 'EMIS.xlsx', // Referência principal
                description: 'Gestão integrada de produtividade e ofensores EMIS/ETER.'
            });
        }

        // Adiciona outros relatórios (exceto Maquinários e Ferramentaria por enquanto)
        excelFiles.forEach(file => {
            const name = file.replace(".xlsx", "");
            const upperName = name.toUpperCase();
            if (
                upperName !== 'EMIS' && 
                upperName !== 'ETER' && 
                upperName !== 'MAQUINÁRIOS' && 
                upperName !== 'FERRAMENTARIA' &&
                !file.endsWith('.bak')
            ) {
                reports.push({
                    id: name.toLowerCase(),
                    title: name,
                    filename: file,
                    description: `Análise detalhada do relatório ${name}.`
                });
            }
        });

        // Adiciona o relatório Medicao mercosat
        reports.push({
            id: 'medicao-mercosat',
            title: 'Medição Mercosat',
            externalUrl: 'https://app.powerbi.com/view?r=eyJrIjoiNDk5OWQwM2QtMTk4YS00YTYyLTkwM2ItNTk2NTRiZTVhZjIxIiwidCI6ImNlYWQ1NmU3LWU5MWEtNDFkMC1iMGU3LTE4N2JiMzgwNjFiZiIsImMiOjR9',
            description: 'Dashboard de acompanhamento Medição Mercosat (PowerBI).'
        });

        // Adiciona o relatório Giro de equipamento locado
        reports.push({
            id: 'giro-locados',
            title: 'Giro de equipamento locado',
            externalUrl: 'https://app.powerbi.com/view?r=eyJrIjoiODNjMjYxOGItMmViNi00OTIzLWJlZTEtMDM5MTQ3NDZmM2IzIiwidCI6IjhjN2JlNjNhLWE1YjEtNDA2MS04ZTUwLWU0ZTk4OTQ3ZGU1YyJ9',
            description: 'Visão detalhada do giro e movimentação de equipamentos locados (PowerBI).'
        });

        // Adiciona o relatório Carta de controle IHS - EMIS
        reports.push({
            id: 'carta-controle-ihs',
            title: 'Carta de controle IHS - EMIS',
            externalUrl: 'https://carta-controle.vercel.app/relatorio.html',
            description: 'Relatório dinâmico de Carta de Controle para IHS e EMIS.'
        });

        return reports;
    } catch (error) {
        console.error("Erro ao listar metadados de relatórios:", error);
        return [];
    }
}


