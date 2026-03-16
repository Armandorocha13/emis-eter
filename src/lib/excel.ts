import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

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
  tipo: 'EMIS' | 'ETER';
  raw?: any;
}

/**
 * Reads an Excel file and converts the first sheet to a standardized JSON array.
 * @param source - The source type ('EMIS' | 'ETER')
 * @returns A standardized array of objects
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
      if (source === 'EMIS') {
        const getVal = (keys: string[]) => {
          const key = keys.find(k => row[k] !== undefined);
          return key ? row[key] : undefined;
        };

        return {
          id: `EMIS-${index}`,
          data: getVal(['dt_solicitacao', 'DT_SOLICITACAO', 'Dt.Solicitacao']) || '',
          responsavel: getVal(['recebido_por', 'RECEBIDO_POR', 'Enviador por']) || '',
          sap: String(getVal(['sap', 'SAP']) || ''),
          status: (() => {
            const rawStatus = getVal(['aceite_destinatario', 'ACEITE_DESTINATARIO', 'Status', 'STATUS']) || '';
            const s = String(rawStatus).trim().toUpperCase();
            if (s === 'SEM RESPOSTA' || s === '') return 'PENDENTE';
            return s;
          })(),
          base: getVal(['base', 'BASE']) || '',
          item: getVal(['miscelanea', 'MISCELANEA', 'Miscelanea']) || 'N/A',
          quantidade: Number(getVal(['quantidade', 'QUANTIDADE', 'Qtd']) || 0),
          tipo: 'EMIS',
          raw: row
        };
      } else {
        // ETER mapping
        return {
          id: row['CODIGO'] || `ETER-${index}`,
          data: row['DATA ALTERAÇÃO'] || row['DATA ALTERAÃ‡ÃƒO'] || '',
          responsavel: row['ALTERADO POR'] || '',
          sap: String(row['SAP'] || ''),
          status: row['STATUS'] || 'Concluido',
          base: row['CIDADE'] || row['Cidade'] || row['BASE'] || '',
          item: `${row['MODELO'] || ''} ${row['SERIAL'] || ''}`.trim() || 'N/A',
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
