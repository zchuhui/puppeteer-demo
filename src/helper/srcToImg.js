const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const writeFile = promisify(fs.writeFile);

module.exports = async (src,dir) =>{
  // 判断如果是图片
  if (/\.(jpg|png|gif)$/.test(src)) {
    console.log("url to image");
    await urlSaveImage(src,dir);
  }
  else{
    console.log("base64 to image");
    await base64SaveImage(src,dir);
  }
}


// url => image
const urlSaveImage = promisify((url,dir,callback)=>{
  // 获取协议类型
  const mod = /^https:/.test(url)? https:http;

  // 获取拓展名
  const extname = path.extname(url);
  // 拼接文件名
  const file = path.join(dir,`${Date.now()}${extname}`)

  // 根据url获取数据
  mod.get(url, res => {
    // 把数据写入目标
    res.pipe(fs.createWriteStream(file))
      .on('finish',()=>{
        callback();

        console.log(file);
      })
  })
})


// base64 => image
const base64SaveImage = async function(base64Str,dir){
  // data:image/jpeg;base64,/xxxxx

  // 正则获取base64的数据，[文件名，文件内容]
  const matches = base64Str.match(/^data:(.+?);base64,(.+)$/);

  try {
    // 获取扩展名
    const extname = matches[1].split('/')[1].replace('jpeg', 'jpg');   // jpeg => jpg

    // 拼接文件名
    const fileName = path.join(dir, `${Date.now()}.${extname}`);

    await writeFile(fileName, matches[2], 'base64');

    console.log(fileName);

  } catch (error) {
    console.log("非法的base64格式！");
  }

}
