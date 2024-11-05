import fs from 'fs';
import XLSX from 'xlsx';

const workbook = XLSX.readFile('./data/bolts_list.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

let data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

let newData = JSON.parse(fs.readFileSync('./data/product.json', 'utf8'));

const findSpecialStrings = data.flat().filter(item => typeof item === 'string' && item.includes('x'));

const prices = Object.values(newData) // Получаем массив категорий
    .flatMap(category => Object.values(category).map(item => item.prices)) // Для каждой категории получаем designations
    .flat();

console.log(prices)

// let allSizes = [];

// for (let i = 1; i < data.length; i++) {
//     allSizes.push(data[i][2]);
// }

// console.log(allSizes.length);
// console.log(designations);
