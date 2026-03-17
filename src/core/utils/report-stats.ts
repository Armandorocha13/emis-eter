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

    // +1 para EMIS/ETER (se existir) e +3 para os relatórios fixos de PowerBI
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

        // Adiciona o relatório fixo do PowerBI
        reports.push({
            id: 'rm-dm-tm',
            title: 'RM, DM e TM',
            externalUrl: 'https://app.powerbi.com/view?r=eyJrIjoiMjk1YjQ2YzUtYTljYi00ZjExLWEwZmItNmRmMjZhMTk0NDYxIiwidCI6IjhjN2JlNjNhLWE1YjEtNDA2MS04ZTUwLWU0ZTk4OTQ3ZGU1YyJ9',
            description: 'Requisições, Devoluções e Transferências em aberto (PowerBI).'
        });

        // Adiciona o relatório CLARO: Capex e Opex
        reports.push({
            id: 'claro-capex-opex',
            title: 'CLARO: Capex e Opex',
            externalUrl: 'https://app.powerbi.com/view?r=eyJrIjoiYTAxM2Y1OTQtMzc2OC00NTA0LTgyNmEtZDEzNTk3YmI0YmZhIiwidCI6IjhjN2JlNjNhLWE1YjEtNDA2MS04ZTUwLWU0ZTk4OTQ3ZGU1YyJ9',
            description: 'Dashboard CLARO de monitoramento de Capex e Opex (PowerBI).'
        });

        // Adiciona o relatório IHS
        reports.push({
            id: 'one-page-ihs',
            title: 'ONE PAGE REPORT: IHS',
            externalUrl: 'https://app.powerbi.com/view?r=eyJrIjoiYTNiY2M4YTUtZDkyNi00YzcwLWI2NTMtNWY1MGUwOTk0ZmY3IiwidCI6IjhjN2JlNjNhLWE1YjEtNDA2MS04ZTUwLWU0ZTk4OTQ3ZGU1YyJ9',
            description: 'Relatório One Page IHS para visão executiva (PowerBI).'
        });

        return reports;
    } catch (error) {
        console.error("Erro ao listar metadados de relatórios:", error);
        return [];
    }
}
