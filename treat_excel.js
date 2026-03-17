const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

/**
 * Script to clean and standardize Excel files for the dashboard.
 * - EMIS: Places treated Date in Column J and Time in Column K.
 */

function processEMIS() {
    const filePath = path.join(process.cwd(), 'data', 'EMIS.xlsx');
    if (!fs.existsSync(filePath)) {
        console.log('EMIS.xlsx not found.');
        return;
    }

    console.log('Processing EMIS.xlsx...');
    const workbook = XLSX.readFile(filePath, { cellDates: true });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to array of arrays to have full control over columns
    const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    // Find Column H (index 7) - dt_resposta
    // Header row is index 0
    rows[0][9] = 'DATA_FILTRO_J'; // Column J
    rows[0][10] = 'HORA_FILTRO_K'; // Column K

    for (let i = 1; i < rows.length; i++) {
        let row = rows[i];
        let rawDate = row[7]; // Column H (dt_resposta)
        
        let datePart = '';
        let timePart = '';

        if (rawDate instanceof Date) {
            const d = rawDate;
            const pad = (n) => String(n).padStart(2, '0');
            datePart = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
            timePart = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
        } else if (typeof rawDate === 'string' && rawDate.includes(' ')) {
            const parts = rawDate.split(' ');
            datePart = parts[0];
            timePart = parts[1];
        } else if (typeof rawDate === 'string') {
            datePart = rawDate;
            timePart = '00:00:00';
        }

        row[9] = datePart;  // Column J
        row[10] = timePart; // Column K
    }

    const newWS = XLSX.utils.aoa_to_sheet(rows);
    const newWB = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWB, newWS, sheetName);
    
    // Backup original
    fs.copyFileSync(filePath, filePath + '.bak');
    XLSX.writeFile(newWB, filePath);
    console.log('EMIS.xlsx processed: Column J (Date) and Column K (Time) are now ready.');
}

processEMIS();
