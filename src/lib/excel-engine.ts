import * as XLSX from "xlsx";
import path from "path";
import fs from "fs";

/**
 * Motor genérico de leitura de arquivos Excel (.xlsx) na pasta /data.
 * Converte o conteúdo para JSON e gerencia erros de leitura.
 * 
 * @param filename O nome do arquivo (ex: 'emis.xlsx') dentro da pasta /data.
 * @returns Um array de objetos JSON que representam as linhas da primeira planilha.
 */
export function readExcelData<T>(filename: string): T[] {
  try {
    const filePath = path.join(process.cwd(), "data", filename);

    // Verifica se o arquivo existe
    if (!fs.existsSync(filePath)) {
      console.error(`O arquivo Excel não foi encontrado: ${filePath}`);
      return [];
    }

    // Lê o conteúdo do arquivo de forma síncrona
    const fileBuffer = fs.readFileSync(filePath);

    // Carrega o workbook
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });

    // Pega o nome da primeira aba (sheet)
    const sheetName = workbook.SheetNames[0];

    // Verifica se o workbook tem abas
    if (!sheetName) {
      console.warn(`O arquivo ${filename} está vazio ou não possui abas.`);
      return [];
    }

    // Converte a aba em JSON
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json<T>(worksheet);

    return jsonData;
  } catch (error) {
    console.error(`Erro ao ler o arquivo Excel ${filename}:`, error);
    return [];
  }
}
