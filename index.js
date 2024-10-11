import puppeteer from "puppeteer";
import { scrapeCatalog } from "./scraper.js";

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

  await page.goto("https://www.mtk-fortuna.ru/bolty", { waitUntil: "load" });

  await scrapeCatalog(page);

  await browser.close();
})();
