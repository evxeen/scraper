import puppeteer from 'puppeteer';
import { scrapeCatalog } from './scraper.js';

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: [`--window-size=300,300`],
    defaultViewport: {
      width: 300,
      height: 300,
    },
  });

  const page = await browser.newPage();

  await page.goto('https://www.mtk-fortuna.ru/bolty', { waitUntil: 'load' });

  await scrapeCatalog(page);

  await browser.close();
})();
