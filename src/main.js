const puppeteer = require('puppeteer');
const srcToImg = require('./helper/srcToImg');
const { mn} = require('./config/default');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://image.baidu.com/');
  console.log('go to https://image.baidu.com/');

  await page.setViewport({
    width:1920,
    height:1080
  });
  console.log('viewport');

  await page.focus('#kw');
  await page.keyboard.sendCharacter("小仙女");     // 搜索关键词
  await page.click('.s_search');
  console.log('go to search list');

  page.on('load',async()=> {
    console.log('page load done, start fetch...');

    // 捕获图片
    const srcs = await page.evaluate(()=>{
      const images = document.querySelectorAll('img.main_img');
      return Array.prototype.map.call(images,img => img.src);
    });

    // 处理图片
    srcs.forEach( async (src)=>{
      await page.waitFor(200);  // 降低频率
      await srcToImg(src,mn);
    });

    // 关闭
    await browser.close();
  })

})();
