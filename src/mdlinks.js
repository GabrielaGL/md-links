import fs from 'fs';
import path from 'path';


/* function mdLinks(path, options) {
  return new Promise((resolve, reject) => {

  })
} */





/* function getFile(pathname) {
  fs.stat(pathname, (error, stats) => {
    if (error) {
      reject(error);
    } else if (stats.isDirectory()) {
      console.log(`${pathname} es un directorio`);
      fs.readdir
      resolve('directorio');
    } else if (stats.isFile()) {
      console.log(`${pathname} es un archivo`);
      resolve('archivo');
    } else {
      console.log(`${pathname} no es ni un archivo ni un directorio`);
      resolve('desconocido');
    }
  });
} */


/* function getFile(path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (error, stats) => {
      if (error) {
        reject(error);
      } else if (stats.isDirectory()) {
        console.log(`${path} es un directorio`);
        fs.readdir(path, (error, files) => {
          if (error) {
            reject(error);
          } else {
            Promise.all(files.map(file => analizarPath(`${path}/${file}`)))
              .then(() => resolve())
              .catch(error => reject(error));
          }
        });
      } else if (stats.isFile()) {
        console.log(`${path} es un archivo`);
        resolve();
      } else {
        console.log(`${path} no es ni un archivo ni un directorio`);
        resolve();
      }
    });
  });
} */




/* function getExtension(path) {

} */


