import XLSX from "xlsx";
import fs from "fs";

export let sheetData = [];

export const createFirstExcelFile = () => {
  const data = JSON.parse(fs.readFileSync("./data/product.json", "utf8"));

  const todayData = new Date();
  const day = String(todayData.getDate()).padStart(2, "0");
  const month = String(todayData.getMonth() + 1).padStart(2, "0");
  const year = todayData.getFullYear();
  const formattedDate = `${day}.${month}.${year}`;

  const workbook = XLSX.utils.book_new();

  sheetData.push([
    "Категория",
    "Название продукции",
    "Обозначение",
    `Цена ${formattedDate}`,
  ]);

  for (let category in data) {
    for (let productName in data[category]) {
      let product = data[category][productName];

      for (let i = 0; i < product.designations.length; i++) {
        if (i === 0) {
          sheetData.push([
            category,
            productName,
            product.designations[i],
            product.prices[i],
          ]);
        } else {
          sheetData.push([, , product.designations[i], product.prices[i]]);
        }
      }
    }
  }

  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

  XLSX.utils.book_append_sheet(workbook, worksheet, "Список товаров");

  XLSX.writeFile(workbook, "./data/bolts_list.xlsx");
};
