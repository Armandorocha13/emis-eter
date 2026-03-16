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
  source: 'EMIS' | 'ETER', 
  data: StandardizedData[]
): BaseProductivity[] {
  const baseGrouping: Record<string, Record<string, number>> = {};

  data.forEach((item) => {
    const base = item.base || 'SEM BASE';
    const tecnico = item.responsavel || 'Não Identificado';

    if (!baseGrouping[base]) {
      baseGrouping[base] = {};
    }

    if (source === 'EMIS') {
      // Logic: Difference in days between item's date and today
      const itemDateValue = item.data;
      if (itemDateValue) {
        const itemDate = new Date(itemDateValue);
        const today = new Date();
        
        // Reset hours for accurate day calculation
        itemDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        
        const diffTime = today.getTime() - itemDate.getTime();
        const diffDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
        
        // Assign the age/days-aged to the technician
        if (!isNaN(diffDays)) {
          baseGrouping[base][tecnico] = (baseGrouping[base][tecnico] || 0) + diffDays;
        }
      }
    } else if (item.raw) {
      const hasSerial = !!(item.raw['SERIAL'] || item.raw['Serial']);
      if (hasSerial) {
        baseGrouping[base][tecnico] = (baseGrouping[base][tecnico] || 0) + 1;
      }
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
