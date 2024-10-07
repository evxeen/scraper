import fs from "fs";

// Функция для сравнения двух массивов цен
function comparePrices(oldPrices, newPrices) {
  return oldPrices.map((oldPrice, index) => {
    const newPrice = newPrices[index];
    if (oldPrice === newPrice) {
      return null; // Если цены совпадают, вернуть null
    }
    return newPrice; // Если цены разные, вернуть новую цену
  });
}

// Основная функция для сравнения двух JSON объектов
function compareJsonObjects(oldJson, newJson) {
  const resultJson = {};

  for (const category in oldJson) {
    if (newJson.hasOwnProperty(category)) {
      resultJson[category] = {};

      for (const product in oldJson[category]) {
        if (newJson[category].hasOwnProperty(product)) {
          const oldProduct = oldJson[category][product];
          const newProduct = newJson[category][product];

          // Сравнение цен
          resultJson[category][product] = {
            designations: oldProduct.designations, // Копируем обозначения
            prices: comparePrices(oldProduct.prices, newProduct.prices), // Сравниваем цены
          };
        }
      }
    }
  }

  return resultJson;
}

// Чтение файлов и запуск сравнения
function compareJsonFiles(oldFilePath, newFilePath, outputFilePath) {
  const oldJson = JSON.parse(fs.readFileSync(oldFilePath, "utf8"));
  const newJson = JSON.parse(fs.readFileSync(newFilePath, "utf8"));

  const resultJson = compareJsonObjects(oldJson, newJson);

  // Запись результата в файл
  fs.writeFileSync(outputFilePath, JSON.stringify(resultJson, null, 2), "utf8");
  console.log("Результат сохранён в файл:", outputFilePath);
}

// Пример использования
const oldFilePath = "data/products.json"; // Путь к старому файлу JSON
const newFilePath = "data/newProducts.json"; // Путь к новому файлу JSON
const outputFilePath = "data/result.json"; // Путь для сохранения результата

compareJsonFiles(oldFilePath, newFilePath, outputFilePath);
