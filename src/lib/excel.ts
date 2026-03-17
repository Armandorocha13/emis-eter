import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

/**
 * Helper to get a local ISO string (YYYY-MM-DDTHH:mm:ss) from a Date object
 * This avoids UTC shifting issues.
 */
const toLocalISO = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

/**
 * Robust date parser that handles Excel Date objects, strings in various formats
 * and ensures a standardized local ISO string output.
 */
const parseToStandardDate = (val: any, fallbackTime: string = '00:00:00') => {
  if (!val) return '';
  if (val instanceof Date) return toLocalISO(val);

  const s = String(val).trim();
  if (s.includes(' ')) {
    // Likely YYYY-MM-DD HH:mm:ss
    return s.replace(' ', 'T');
  }
  if (s.includes('/')) {
    // Likely DD/MM/YYYY
    const parts = s.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}T${fallbackTime}`;
    }
  }
  return s;
};

/**
 * Standardized data structure for the dashboard
 */
export interface StandardizedData {
  id: string | number;
  data: string;
  responsavel: string;
  sap: string;
  status: string;
  base: string;
  item: string;
  quantidade: number;
  tipo: string;
  aging?: number;
  raw?: any;
}

/**
 * Helper for "First Last" name formatting with proper capitalization
 */
export const formatName = (fullName: string) => {
  if (!fullName) return 'N/A';
  const parts = String(fullName).trim().toLowerCase().split(/\s+/);
  if (parts.length === 0 || (parts.length === 1 && parts[0] === '')) return 'N/A';

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  if (parts.length === 1) return capitalize(parts[0]);

  const first = capitalize(parts[0]);
  const last = capitalize(parts[parts.length - 1]);
  return `${first} ${last}`;
};

/**
 * Reads an Excel file and converts the first sheet to a standardized JSON array.
 */
export async function readExcelFile(source: 'EMIS' | 'ETER') {
  const fileName = `${source}.xlsx`;
  const lockFileName = `~$${source}.xlsx`;
  const directoryPath = path.join(process.cwd(), 'data');
  const filePath = path.join(directoryPath, fileName);
  const lockFilePath = path.join(directoryPath, lockFileName);

  let isLocked = false;

  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    // Check for Office lock file
    if (fs.existsSync(lockFilePath)) {
      isLocked = true;
      console.warn(`Warning: File ${fileName} appears to be open in Excel.`);
    }

    const fileBuffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer', cellDates: true });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const rawData = XLSX.utils.sheet_to_json(worksheet);


    // Standardize the data mapping
    const data = rawData.map((row: any, index): StandardizedData => {
      // Helper to get value by column index (A=0, B=1, ...)
      const getValByIndex = (idx: number) => {
        const keys = Object.keys(row);
        // Note: XLSX.utils.sheet_to_json with default options might not preserve 
        // column order if some columns are empty. But usually it follows the sheet.
        // A more reliable way is to use the raw keys if they match Excel headers.
        return row[keys[idx]];
      };

      if (source === 'EMIS') {
        const getVal = (keys: string[]) => {
          const key = keys.find(k => row[k] !== undefined);
          return key ? row[key] : undefined;
        };

        return {
          id: `EMIS-${index}`,
          data: parseToStandardDate(getVal(['DATA_FILTRO_J', 'DATA_TRATADA', 'dt_resposta', 'DT_RESPOSTA'])),
          responsavel: formatName(getVal(['recebido_por', 'RECEBIDO_POR', 'Enviador por']) || ''),
          sap: String(getVal(['sap', 'SAP']) || ''),
          status: (() => {
            // Coluna I é o índice 8 (A=0, B=1, C=2, D=3, E=4, F=5, G=6, H=7, I=8)
            // No EMIS original, Column I é frequentemente 'aceite_destinatario' ou 'Status'
            const rawStatus = getVal(['aceite_destinatario', 'ACEITE_DESTINATARIO', 'Status', 'STATUS']) || '';
            const s = String(rawStatus).trim().toUpperCase();
            if (s === 'SEM RESPOSTA' || s === '') return 'PENDENTE';
            return s;
          })(),
          base: String(getVal(['base', 'BASE']) || '').trim().toUpperCase(),
          item: getVal(['miscelanea', 'MISCELANEA', 'Miscelanea']) || 'N/A',
          quantidade: Number(getVal(['quantidade', 'QUANTIDADE', 'Qtd']) || 0),
          tipo: 'EMIS',
          raw: row
        };
      } else {
        // ETER mapping
        const getVal = (keys: string[]) => {
          const key = keys.find(k => row[k] !== undefined);
          return key ? row[key] : undefined;
        };

        // Encontrar a coluna de status dinamicamente se não estiver nas chaves padrão
        const findDynamicStatus = () => {
          const statusKeys = ['STATUS', 'Status', 'SITUACAO', 'SITUAÇÃO', 'Situacao', 'Situação', 'SITUAÃ‡ÃƒO', 'QUALIDADE', 'Qualidade'];

          // Primeiro tenta as chaves conhecidas
          for (const key of statusKeys) {
            if (row[key] !== undefined) return row[key];
          }

          // Se não achar, procura por qualquer chave que contenha "STATUS", "SITUACAO" ou "SITUAÇÃO"
          const allKeys = Object.keys(row);
          const dynamicKey = allKeys.find(k => {
            const upperK = String(k).toUpperCase();
            return upperK.includes('STATUS') || upperK.includes('SITUACAO') || upperK.includes('SITUAÇÃO') || upperK.includes('SITUAÃ‡ÃƒO') || upperK.includes('QUALIDADE');
          });

          return dynamicKey ? row[dynamicKey] : undefined;
        };

        const dateRaw = getVal(['DATA_TRATADA', 'DATA ALTERAÇÃO', 'DATA ALTERAÃ‡ÃƒO', 'DATA', 'Data']);
        const timePart = String(getVal(['HORA_TRATADA', 'HORA ALTERAÇÃO', 'HORA ALTERAÃ‡ÃƒO', 'HORA', 'Hora']) || '00:00:00');

        return {
          id: getVal(['CODIGO', 'Codigo', 'ID']) || `ETER-${index}`,
          data: parseToStandardDate(dateRaw, timePart),
          responsavel: formatName(getVal(['TECNICO', 'Tecnico', 'ALTERADO POR', 'Técnico']) || ''),
          sap: String(getVal(['SAP', 'sap']) || ''),
          status: (() => {
            const rawStatus = String(findDynamicStatus() || '');
            const s = rawStatus.trim().toUpperCase();
            if (s === 'CONFIRMAÇÃO DO TÉCNICO' || s === 'CONFIRMAÃ‡ÃƒO DO TÃ‰CNICO' || s === 'SEM RESPOSTA' || s === '') return 'Confirmação do tecnico';
            return s;
          })(),
          base: String(getVal(['CIDADE', 'Cidade', 'BASE', 'Base']) || '').trim().toUpperCase(),
          item: `${getVal(['MODELO', 'Modelo']) || ''} ${getVal(['SERIAL', 'Serial']) || ''}`.trim() || 'N/A',
          quantidade: 1,
          tipo: 'ETER',
          raw: row
        };
      }
    });

    return { data, isLocked };
  } catch (error: any) {
    console.error(`Error reading ${source} file: ${error.message}`);
    throw error;
  }
}
