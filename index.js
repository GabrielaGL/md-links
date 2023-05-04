import fs from 'fs';
import path from 'path';

const filePath = 'README.md'

const readFile = fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);
});



