import XLSX from 'xlsx';
import fs from 'fs';

export const createNewExcelFile = () => {
  const todayData = new Date();

  const day = String(todayData.getDate()).padStart(2, '0');
  const month = String(todayData.getMonth() + 1).padStart(2, '0');
  const year = todayData.getFullYear();

  const formattedDate = `${day}.${month}.${year}`;

  let pureArrPrices = JSON.parse(
    fs.readFileSync('./data/dataTemp.json', 'utf8')
  );

  const getPureArrPrices = (data) => {
    let allPrices = [];

    for (let category in data) {
      for (let product in data[category]) {
        const prices = data[category][product].prices;

        allPrices = allPrices.concat(prices);
      }
    }

    return allPrices;
  };

  let newArray = getPureArrPrices(pureArrPrices);
  const workbook = XLSX.readFile('./data/bolts_list.xlsx');
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  let data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  data[0].push(formattedDate);

  for (let i = 1; i < data.length; i++) {
    data[i].push(newArray[i - 1]);
  }

  const updatedSheet = XLSX.utils.aoa_to_sheet(data);

  workbook.Sheets[sheetName] = updatedSheet;

  XLSX.writeFile(workbook, './data/bolts_list.xlsx');
};
