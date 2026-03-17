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
    
    // Filtra EMIS e ETER para contar como um só
    const hasEmisOrEter = excelFiles.some(f => f.toUpperCase().startsWith('EMIS') || f.toUpperCase().startsWith('ETER'));
    const others = excelFiles.filter(f => !f.toUpperCase().startsWith('EMIS') && !f.toUpperCase().startsWith('ETER'));

    return others.length + (hasEmisOrEter ? 1 : 0);
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

        // Adiciona outros relatórios
        excelFiles.forEach(file => {
            const name = file.replace(".xlsx", "");
            if (name.toUpperCase() !== 'EMIS' && name.toUpperCase() !== 'ETER') {
                reports.push({
                    id: name.toLowerCase(),
                    title: name,
                    filename: file,
                    description: `Análise detalhada do relatório ${name}.`
                });
            }
        });

        return reports;
    } catch (error) {
        console.error("Erro ao listar metadados de relatórios:", error);
        return [];
    }
}
