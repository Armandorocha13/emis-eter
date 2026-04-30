
/**
 * Função para contar dinamicamente os relatórios (.xlsx) na pasta /data.
 * Isso permite alimentar o KPI de total de relatórios.
 * 
 * @returns O número de relatórios (agrupando EMIS e ETER como um só).
 */
export function getTotalReportsCount(): number {
  return getAvailableReportsMetada().length;
}

/**
 * Retorna metadados básicos dos relatórios disponíveis.
 */
export function getAvailableReportsMetada() {
  return [
    {
      id: 'giro-maquinarios',
      title: 'GIRO DE MAQUINARIOS',
      externalUrl: 'https://giromaquinarioestoqueffa.vercel.app/',
      description: 'Monitoramento em tempo real de estoque e giro de maquinários.',
      category: 'Operacional'
    },
    {
      id: 'projecao-reposicao',
      title: 'PROJEÇÃO DE REPOSIÇÃO DE MATERIAL',
      externalUrl: 'https://nextjsspace-iota-one.vercel.app/',
      description: 'Análise preditiva para reposição estratégica de materiais.',
      category: 'Estratégico'
    }
  ];
}


