import ExcelJS from "exceljs";
import fs from "fs";

export const updateExcelFromJson = async (
  jsonFilePath,
  excelFilePath,
  currentDate,
) => {
  // Чтение данных из JSON
  const rawData = fs.readFileSync(jsonFilePath, "utf-8");
  const data = JSON.parse(rawData);

  const excelJSWorkbook = new ExcelJS.Workbook();

  let worksheet;

  if (fs.existsSync(excelFilePath)) {
    const fileBuffer = fs.readFileSync(excelFilePath);
    await excelJSWorkbook.xlsx.load(fileBuffer);
    worksheet = excelJSWorkbook.getWorksheet(1);
  } else {
    worksheet = excelJSWorkbook.addWorksheet("Products");

    worksheet.addRow([
      "Категория",
      "Название продукта",
      "Обозначения",
      `Цена на ${currentDate}`,
    ]);
  }

  const lastPriceColumnIndex = worksheet.getRow(1).cellCount;

  worksheet.getRow(1).getCell(lastPriceColumnIndex + 1).value =
    `Цена на ${currentDate}`;

  let previousCategory = null;
  let previousProduct = null;

  for (const category in data) {
    for (const product in data[category]) {
      const productData = data[category][product];
      const designations = productData.designations;
      const prices = productData.prices;

      for (let i = 0; i < designations.length; i++) {
        const designation = designations[i];
        const newPrice = prices[i];

        const categoryDisplay = category !== previousCategory ? category : "";
        const productDisplay =
          i === 0 && product !== previousProduct ? product : "";

        worksheet.addRow([
          categoryDisplay,
          productDisplay,
          designation,
          newPrice,
        ]);

        if (i === 0) {
          previousProduct = product;
        }
      }
      previousCategory = category;
    }
  }

  // Сохраняем обновленный файл
  await excelJSWorkbook.xlsx.writeFile(excelFilePath);
};
