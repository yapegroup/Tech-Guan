const fs = require('fs');
const XLSX = require('xlsx');

const fileBuf = fs.readFileSync('TG/Products (53) 01.09 - 26.09.xlsx');
const workbook = XLSX.read(fileBuf, { type: 'buffer' });
console.log('SheetNames:', workbook.SheetNames);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const jsonRows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
console.log('Total Rows in Excel:', jsonRows.length);
console.log('Row 0 (Header):', jsonRows[0]);
console.log('Row 1:', jsonRows[1]);
console.log('Row 2:', jsonRows[2]);
