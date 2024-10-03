import fs from "fs";

export const initJsonFile = (filePath) => {
  fs.writeFileSync(filePath, "{}", { encoding: "utf-8" });
};

const readJsonFile = (filePath) => {
  const content = fs.readFileSync(filePath, { encoding: "utf-8" });
  return JSON.parse(content);
};

const writeJsonFile = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), {
    encoding: "utf-8",
  });
};

export const saveCategoryProductData = (filePath, category, product) => {
  let data = readJsonFile(filePath);

  if (!data[category]) {
    data[category] = {};
  }

  data[category][product.title] = {
    designations: product.designations,
    prices: product.prices,
  };

  writeJsonFile(filePath, data);
};
