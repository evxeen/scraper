import fs from "fs";

export const createJsonFile = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

export const createTemplate = () => {
  let templateFile = {};

  const oldFile = JSON.parse(fs.readFileSync("./data/product.json", "utf8"));
  const newFile = JSON.parse(fs.readFileSync("./data/newProduct.json", "utf8"));

  for (const category in oldFile) {
    if (newFile.hasOwnProperty(category)) {
      templateFile[category] = {};

      for (const boltType in oldFile[category]) {
        if (newFile[category].hasOwnProperty(boltType)) {
          const oldPrices = oldFile[category][boltType].prices;
          const newPrices = newFile[category][boltType].prices;

          const comparedPrices = newPrices.map((newPrice, index) => {
            return newPrice === oldPrices[index] ? "–" : newPrice;
          });

          templateFile[category][boltType] = {
            designations: newFile[category][boltType].designations,
            prices: comparedPrices,
          };
        } else {
          templateFile[category][boltType] = "Отсутствует в новом файле";
        }
      }
    } else {
      templateFile[category] = "Отсутствует в новом файле";
    }
  }

  fs.writeFileSync(
    "./data/dataTemp.json",
    JSON.stringify(templateFile, null, 2),
  );
};
