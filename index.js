import fs from 'fs';
import path from 'path';

const filePath = 'examplesFiles'

function testRelativeAbsolute(filePath) {
  const itsAbsolute = path.isAbsolute(filePath);

  if (itsAbsolute) {
    console.log(`La ruta '${filePath}' es absoluta.`);
  } else {
    console.log(`La ruta '${filePath}' es relativa.`);
    const convertAbsolute = path.resolve(filePath);
    console.log(`La ruta absoluta es '${convertAbsolute}'.`);
    testRelativeAbsolute(convertAbsolute);
  }
}

testRelativeAbsolute(filePath)

function getFiles(filePath) {
  fs.stat(filePath, (err, stats) => {
    if (err) {
      console.error(`Error al comprobar la ruta '${filePath}': ${err.code}`);
    } else {
      if (stats.isFile()) {
        console.log(`La ruta '${filePath}' corresponde a un archivo.`);
      } else if (stats.isDirectory()) {
        console.log(`La ruta '${filePath}' corresponde a un directorio.`);
        fs.readdir(filePath, (err, files) => {
          if (err) {
            console.error(`Error al leer el directorio '${filePath}': ${err.code}`);
          } else {
            files.forEach((file) => {
              getFiles(file);
            });
          }
        });
      }
    }
  });
}

getFiles(filePath);

/* const readFile = fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);
}); */



