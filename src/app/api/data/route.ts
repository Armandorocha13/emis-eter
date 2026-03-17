import { NextRequest, NextResponse } from 'next/server';
import { readExcelData } from '@/lib/excel-engine';
import { StandardizedData } from '@/lib/excel';
import path from 'path';
import fs from 'fs';

// Cache revalidation: 5 minutes (300 seconds)
export const revalidate = 300;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const source = (searchParams.get('source') || 'EMIS').toUpperCase();
    
    // Determine the exact filename in /data
    const dataDir = path.join(process.cwd(), 'data');
    const files = fs.readdirSync(dataDir);
    const targetFile = files.find(f => f.toLowerCase() === `${source.toLowerCase()}.xlsx`);

    if (!targetFile) {
        return NextResponse.json({ success: false, error: `Relatório ${source} não encontrado.` }, { status: 404 });
    }

    console.log(`[API]: Fetching data from local file: ${targetFile}`);
    const rawData = readExcelData<any>(targetFile);
    console.log(`[API]: Data fetched successfully. Row count: ${rawData.length}`);
    
    // Reference date: March 16, 2026
    const today = new Date('2026-03-16');
    today.setHours(0, 0, 0, 0);

    // Business Logic processing (Attempting to standardize based on common fields)
    const processedData: StandardizedData[] = rawData.map((row: any, index: number) => {
      const findVal = (keys: string[]) => {
        const key = keys.find(k => row[k] !== undefined);
        return key ? row[key] : undefined;
      };

      const rawStatus = findVal(['aceite_destinatario', 'ACEITE_DESTINATARIO', 'Status', 'STATUS', 'SITUACAO']) || '';
      const statusClean = String(rawStatus).trim().toUpperCase();
      const status = statusClean === 'SEM RESPOSTA' || statusClean === '' ? 'PENDENTE' : statusClean;
      
      const dateVal = findVal(['dt_solicitacao', 'DT_SOLICITACAO', 'Dt.Solicitacao', 'DATA', 'DATA ALTERAÇÃO']);
      let diffDays = 0;
      if (dateVal) {
        const itemDate = new Date(dateVal);
        itemDate.setHours(0, 0, 0, 0);
        if (!isNaN(itemDate.getTime())) {
          const diffTime = today.getTime() - itemDate.getTime();
          diffDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
        }
      }

      return {
        id: findVal(['CODIGO', 'Codigo', 'ID', 'Id']) || `${source}-${index}`,
        responsavel: findVal(['recebido_por', 'RECEBIDO_POR', 'Enviador por', 'TECNICO', 'Tecnico', 'ALTERADO POR', 'Técnico']) || 'N/A',
        base: findVal(['base', 'BASE', 'CIDADE', 'Cidade', 'Base']) || 'NPR',
        item: findVal(['miscelanea', 'MISCELANEA', 'Miscelanea', 'MODELO', 'Modelo', 'ITEM', 'Item']) || 'N/A',
        sap: String(findVal(['sap', 'SAP', 'CD', 'CODIGO']) || ''),
        quantidade: Number(findVal(['quantidade', 'QUANTIDADE', 'Qtd', 'QTD']) || 1),
        status,
        data: (() => {
          if (!dateVal) return '';
          const d = new Date(dateVal);
          return isNaN(d.getTime()) ? '' : d.toISOString();
        })(),
        aging: diffDays,
        tipo: source as any,
        // @ts-ignore
        raw: row
      };
    });

    return NextResponse.json({ 
      success: true, 
      source,
      count: processedData.length,
      data: processedData 
    });
  } catch (error: any) {
    console.error(`[API Global Error]: ${error.message}`);
    return NextResponse.json(
      { success: false, error: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}
