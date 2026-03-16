import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

/**
 * Utility to fetch and convert local Excel files to JSON
 * Replaces the Google Drive implementation
 */
export async function readLocalExcelAsJson(type: 'EMIS' | 'ETER') {
  const fileName = `${type}.xlsx`;
  const directoryPath = path.join(process.cwd(), 'data');
  const filePath = path.join(directoryPath, fileName);

  if (!fs.existsSync(filePath)) {
    console.error(`[Local Data Error]: File not found at ${filePath}`);
    throw new Error(`File not found: ${fileName}`);
  }

  try {
    const fileBuffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer', cellDates: true });
    
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
    
    console.log(`[Local Data Success]: Processed ${jsonData.length} rows from "${fileName}"`);
    
    return jsonData;
  } catch (error: any) {
    console.error(`[Local Data Error]: Failed to parse ${fileName}: ${error.message}`);
    throw new Error(`Failed to read Excel file: ${error.message}`);
  }
}
