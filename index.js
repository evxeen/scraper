import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: [`--window-size=1920,1080`],
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
  });

  const page = await browser.newPage();
  await page.goto("https://www.mtk-fortuna.ru/bolty", {
    waitUntil: "domcontentloaded",
  });

  const getAllProducts = await page.$$(".left-menu-ul li", (e) => e);
  const allExceptFirst = Array.from(getAllProducts).slice(1);

  let arrNames = [];
  for (let elem of allExceptFirst) {
    let name = await elem.$eval("a", (e) => e.innerText);

    arrNames.push(name);
  }

  console.log(arrNames);

  // await page.click(".sub-catalog-item .title-block a");
  //
  // let title = await page.$eval("h1", (e) => e.innerText);
  // let designation = await page.$eval(
  //   "#contentPlaceHolder_gridDiamList tr:nth-child(2) td:nth-child(2)",
  //   (e) => e.innerText,
  // );
  // let price = await page.$eval(
  //   "#contentPlaceHolder_gridDiamList tr:nth-child(2) td:last-child",
  //   (e) => parseFloat(e.innerText.replace(",", ".")),
  // );
  //
  // const data = {
  //   title,
  //   designation,
  //   price,
  // };
  //
  // console.log(`
  // Название: ${data.title},
  // Обозначение: ${data.designation},
  // Цена: ${data.price},
  // `);

  // let getAllProducts = await page.$$(".title-block", (e) => e);
  // // console.log(getAllProducts);
  //
  // let arrNames = [];
  // for (let elem of getAllProducts) {
  //   let name = await elem.$eval("a", (e) => e.innerText);
  //
  //   arrNames.push(name);
  // }
  await browser.close();
  // console.log(arrNames);
})();
