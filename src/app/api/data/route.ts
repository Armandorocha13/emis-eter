import { NextRequest, NextResponse } from 'next/server';
import { readExcelFile, StandardizedData } from '@/lib/excel';

// Cache revalidation: 5 minutes (300 seconds)
export const revalidate = 300;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sourceParam = (searchParams.get('source') || 'EMIS').toUpperCase();
    const source = sourceParam === 'ETER' ? 'ETER' : 'EMIS';
    
    console.log(`[API]: Fetching data for source: ${source}`);
    const { data, isLocked } = await readExcelFile(source);
    
    // Reference date: Current date for Aging calculation
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Add Aging to the standardized data
    const processedData = data.map(item => {
      let aging = 0;
      if (item.data) {
        const itemDate = new Date(item.data);
        itemDate.setHours(0, 0, 0, 0);
        if (!isNaN(itemDate.getTime())) {
          const diffTime = today.getTime() - itemDate.getTime();
          // Adding +1 so that "today" counts as day 1 of opening
          aging = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24))) + 1;
        }
      }
      return { ...item, aging };
    });

    return NextResponse.json({ 
      success: true, 
      source,
      count: processedData.length,
      data: processedData,
      isLocked
    });
  } catch (error: any) {
    console.error(`[API Global Error]: ${error.message}`);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
