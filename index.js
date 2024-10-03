import puppeteer from "puppeteer";
import fs from "fs";

(async () => {
  const browser = await puppeteer.launch({
    headless: false, // Открытие браузера в режиме с графическим интерфейсом
    args: [`--window-size=1920,1080`],
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
  });

  const page = await browser.newPage();
  await page.goto("https://www.mtk-fortuna.ru/bolty", {
    waitUntil: "load",
  });
  fs.writeFileSync("products.json", "[]");

  const getItemsCatalog = await page.$$(".left-menu-ul li");

  for (let i = 2; i < getItemsCatalog.length; i++) {
    await page.click(`.left-menu-ul li:nth-child(${i}) a`);

    // Ожидаем загрузки нового контента
    await page.waitForSelector(".carousel-li .sub-catalog-item");

    let productBlocks = await page.$$(".carousel-li .sub-catalog-item");

    for (let index = 0; index < productBlocks.length; index++) {
      // Заново получаем блок на каждой итерации после возврата
      productBlocks = await page.$$(".carousel-li .sub-catalog-item");
      let productBlock = productBlocks[index];

      // Извлекаем элемент <a> внутри блока
      let link = await productBlock.$(".title-block a");

      if (link) {
        // Кликаем на элемент <a>
        await Promise.all([
          link.click(),
          page.waitForNavigation({ waitUntil: "load" }),
        ]);

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
            parseFloat(e.innerText),
          );

          currentProduct.designations.push(designation);
          currentProduct.prices.push(price);
        }

        let data = JSON.parse(fs.readFileSync("products.json", "utf-8"));

        // Добавляем новый продукт в данные
        data.push(currentProduct);

        // Перезаписываем файл с новыми данными
        fs.writeFileSync("products.json", JSON.stringify(data, null, 2));

        await new Promise((resolve) => setTimeout(resolve, 1000)); // Пауза 1 секунда

        await page.goBack({ waitUntil: "load" });

        await page.waitForSelector(".carousel-li .sub-catalog-item");
        console.log(currentProduct);
      }
    }
  }

  await browser.close();
})();
