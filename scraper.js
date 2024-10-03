import { saveCategoryProductData } from "./utils/fileUtils.js";
import { waitForNavigationAndLoad } from "./utils/navigation.js";

export const scrapeCatalog = async (page) => {
  const catalogItems = await page.$$(".left-menu-ul li");

  for (let i = 2; i < catalogItems.length; i++) {
    let category = await page.$eval(
      `.left-menu-ul li:nth-child(${i}) a`,
      (e) => e.innerText,
    );

    await page.click(`.left-menu-ul li:nth-child(${i}) a`);

    await page.waitForSelector(".carousel-li .sub-catalog-item");

    let productBlocks = await page.$$(".carousel-li .sub-catalog-item");

    for (let index = 0; index < productBlocks.length; index++) {
      productBlocks = await page.$$(".carousel-li .sub-catalog-item");
      let productBlock = productBlocks[index];

      let link = await productBlock.$(".title-block a");

      if (link) {
        await waitForNavigationAndLoad(page, link);

        const title = await page.$eval("#plhHead", (e) => e.innerText);

        const rows = await page.$$("#contentPlaceHolder_gridDiamList tbody tr");

        let currentProduct = {
          title,
          designations: [],
          prices: [],
        };

        for (let j = 1; j < rows.length; j++) {
          const row = rows[j];
          let designation = await row.$eval(
            "td:nth-child(2)",
            (e) => e.innerText,
          );
          let price = await row.$eval("td:last-child", (e) =>
            parseFloat(e.innerText.replace(",", ".")),
          );

          currentProduct.designations.push(designation);
          currentProduct.prices.push(price);
        }

        saveCategoryProductData("data/products.json", category, currentProduct);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        await page.goBack({ waitUntil: "load" });
        await page.waitForSelector(".carousel-li .sub-catalog-item");
      }
    }
  }
};
