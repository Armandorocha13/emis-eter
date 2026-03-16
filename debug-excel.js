const XLSX = require('xlsx');
const path = require('path');

const filePath = 'G:\\Meu Drive\\Projetos trabalho\\001 - Emis x Terminais\\EMIS.xlsx';

try {
  const workbook = XLSX.readFile(filePath);
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  
  // Get raw JSON to see keys
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Read with header: 1 to see raw rows
  
  console.log('--- FIRST 5 ROWS (RAW) ---');
  console.log(JSON.stringify(data.slice(0, 5), null, 2));

  // Get keys from objects
  const objData = XLSX.utils.sheet_to_json(worksheet);
  console.log('\n--- KEYS IN FIRST OBJECT ---');
  if (objData.length > 0) {
    console.log(Object.keys(objData[0]));
    console.log('\n--- FIRST OBJECT VALUES ---');
    console.log(objData[0]);
  } else {
    console.log('No data found in sheet.');
  }
} catch (error) {
  console.error('Error:', error.message);
}
