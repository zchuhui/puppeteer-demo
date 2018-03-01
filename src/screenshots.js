const puppeteer = require('puppeteer');
const {screenshots} = require('./config/default');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.baidu.com');
  await page.screenshot({ path: `${screenshots}/${Date.now()}.png`});

  await browser.close();
})();
