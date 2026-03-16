import { NextRequest, NextResponse } from 'next/server';
import { downloadDriveExcelAsJson } from '@/lib/googleDrive';

// Cache revalidation: 5 minutes (300 seconds)
export const revalidate = 300;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = (searchParams.get('type') || searchParams.get('source') || 'EMIS').toUpperCase();

  const fileIdEmis = process.env.DRIVE_FILE_ID_EMIS;
  const fileIdEter = process.env.DRIVE_FILE_ID_ETER;

  if (type !== 'EMIS' && type !== 'ETER') {
    return NextResponse.json({ success: false, error: 'Invalid type parameter' }, { status: 400 });
  }

  const fileId = type === 'EMIS' ? fileIdEmis : fileIdEter;

  if (!fileId) {
    return NextResponse.json({ 
      success: false, 
      error: `DRIVE_FILE_ID_${type} not configured in environment variables` 
    }, { status: 500 });
  }

  try {
    const rawData = await downloadDriveExcelAsJson(fileId);
    
    // Reference date: March 16, 2026
    const today = new Date('2026-03-16');
    today.setHours(0, 0, 0, 0);

    // Business Logic processing
    const processedData = rawData.map((row: any, index) => {
      const findVal = (keys: string[]) => {
        const key = keys.find(k => row[k] !== undefined);
        return key ? row[key] : undefined;
      };

      if (type === 'EMIS') {
        const rawStatus = findVal(['aceite_destinatario', 'ACEITE_DESTINATARIO', 'Status', 'STATUS']) || '';
        const statusClean = String(rawStatus).trim().toUpperCase();
        
        // Rules: Define 'SEM RESPOSTA' as 'PENDENTE'
        const status = statusClean === 'SEM RESPOSTA' || statusClean === '' ? 'PENDENTE' : statusClean;
        
        // Rule: Calculate Aging (Days)
        const dateVal = findVal(['dt_solicitacao', 'DT_SOLICITACAO', 'Dt.Solicitacao', 'DATA']);
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
          id: `EMIS-${index}`,
          responsavel: findVal(['recebido_por', 'RECEBIDO_POR', 'Enviador por', 'TECNICO', 'Tecnico']) || 'N/A',
          base: findVal(['base', 'BASE', 'CIDADE', 'Cidade']) || '',
          item: findVal(['miscelanea', 'MISCELANEA', 'Miscelanea']) || 'N/A',
          sap: String(findVal(['sap', 'SAP']) || ''),
          quantidade: Number(findVal(['quantidade', 'QUANTIDADE', 'Qtd']) || 0),
          status,
          data: dateVal ? new Date(dateVal).toISOString() : '',
          aging: diffDays, // Useful for the frontend
          tipo: 'EMIS'
        };
      } else {
        // ETER Logic
        return {
          id: findVal(['CODIGO', 'Codigo']) || `ETER-${index}`,
          responsavel: findVal(['ALTERADO POR', 'Alterado Por', 'TECNICO', 'Tecnico']) || '',
          base: findVal(['CIDADE', 'Cidade', 'BASE', 'Base']) || '',
          sap: String(findVal(['SAP', 'sap']) || ''),
          status: findVal(['STATUS', 'Status']) || 'CONCLUIDO',
          item: `${findVal(['MODELO', 'Modelo']) || ''} ${findVal(['SERIAL', 'Serial']) || ''}`.trim() || 'N/A',
          quantidade: 1,
          data: findVal(['DATA ALTERAÇÃO', 'Data', 'DATA']) ? new Date(findVal(['DATA ALTERAÇÃO', 'Data', 'DATA'])).toISOString() : '',
          tipo: 'ETER'
        };
      }
    });

    return NextResponse.json({ 
      success: true, 
      type,
      count: processedData.length,
      data: processedData 
    });

  } catch (error: any) {
    console.error(`[API Error]: ${error.message}`);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
