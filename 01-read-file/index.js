const fs = require('fs');
const path = require('path');

const dirName = path.join(__dirname, 'text.txt');

const txt = fs.createReadStream(dirName, {
  encoding: 'utf-8',
  // highWaterMark:1*1024
});

txt.on('data', (chank) => {
  console.log(chank);
});
txt.on('end', () => {
  console.log('Конец чтения файла');
});
txt.on('error', (err) => {
  console.log('ошибка чтения файла:', err);
});
