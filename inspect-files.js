import { readExcelFile } from './src/lib/excel.js';

async function inspect() {
  try {
    const emis = await readExcelFile('EMIS.xlsx');
    console.log('--- EMIS COLUMNS ---');
    console.log(Object.keys(emis[0] || {}));

    const eter = await readExcelFile('ETER.xlsx');
    console.log('--- ETER COLUMNS ---');
    console.log(Object.keys(eter[0] || {}));
  } catch (e) {
    console.error(e.message);
  }
}

inspect();
