import { StandardizedData } from './excel';

export interface ProcessedEntry {
  nome: string;
  valor: number;
}

export interface BaseProductivity {
  base: string;
  tecnicos: ProcessedEntry[];
  totalBase: number;
}

/**
 * Data Engine: Processes raw/standardized data into specialized metrics
 * Aggregates by BASE first, then by Technician
 */
export function processDashboardData(
  source: string, 
  data: StandardizedData[]
): BaseProductivity[] {
  const baseGrouping: Record<string, Record<string, number>> = {};
  const isEmis = source.toUpperCase() === 'EMIS';

  data.forEach((item) => {
    const base = item.base || 'SEM BASE';
    const tecnico = item.responsavel || 'Não Identificado';

    if (!baseGrouping[base]) {
      baseGrouping[base] = {};
    }

    if (isEmis) {
      // Logic for EMIS: Aging days
      const aging = item.aging || 0;
      baseGrouping[base][tecnico] = (baseGrouping[base][tecnico] || 0) + aging;
    } else {
      // Default logic for other reports: count items (assumed productivity)
      baseGrouping[base][tecnico] = (baseGrouping[base][tecnico] || 0) + 1;
    }
  });

  return Object.entries(baseGrouping).map(([baseName, tecnicosObj]) => {
    const tecnicos = Object.entries(tecnicosObj)
      .map(([nome, valor]) => ({ nome, valor }))
      .sort((a, b) => b.valor - a.valor);
    
    const totalBase = tecnicos.reduce((sum, t) => sum + t.valor, 0);

    return {
      base: baseName,
      tecnicos,
      totalBase
    };
  }).sort((a, b) => b.totalBase - a.totalBase);
}

/**
 * Grouping for pending items specifically
 * Returns a list of technicians and the sum of quantities they must accept
 */
export function getPendingByTechnician(data: StandardizedData[]): ProcessedEntry[] {
  const pendingMap: Record<string, number> = {};

  data.forEach((item) => {
    if (item.status === 'PENDENTE') {
      const tecnico = item.responsavel || 'Não Identificado';
      // Sum the quantity of items pending
      pendingMap[tecnico] = (pendingMap[tecnico] || 0) + (item.quantidade || 1);
    }
  });

  return Object.entries(pendingMap)
    .map(([nome, valor]) => ({ nome, valor }))
    .filter(entry => entry.valor > 0)
    .sort((a, b) => b.valor - a.valor);
}
