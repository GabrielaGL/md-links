import fs from 'fs';
import path from 'path';

const filePath = 'src/mdlinks.js'

function testRelativeAbsolute(filePath) {
  const itsAbsolute = path.isAbsolute(filePath);
  if (!filePath) {
    console.error("La ruta no es válida. Intenta con una ruta válida");
  }
  else if (itsAbsolute) {
    console.log(`La ruta '${filePath}' es absoluta.`);
    getFiles(filePath);
  } else {
    console.log(`La ruta '${filePath}' es relativa.`);
    const convertAbsolute = path.resolve(filePath);
    console.log(`La ruta absoluta es '${convertAbsolute}'.`);
    testRelativeAbsolute(convertAbsolute);
  }

}

testRelativeAbsolute(filePath)

function getFiles(filePath) {
  fs.stat(filePath, (error, stats) => {
    if (error) {
      console.error(`Error al comprobar la ruta '${filePath}': ${error.code}`);
    } else {
      if (stats.isFile()) {
        console.log(`La ruta '${filePath}' corresponde a un archivo.`);
        getMDExt(filePath);
      } else if (stats.isDirectory()) {
        console.log(`La ruta '${filePath}' corresponde a un directorio.`);
        const readDirec = fs.readdirSync(filePath)
        readDirec.forEach((file) => {
          const directoryPath = `${filePath}/${file}`;
          getFiles(directoryPath);
        })
      }
    }
  })
};


function getMDExt(filePath) {
  const arrFiles = [];
  if (path.extname(filePath) === '.md') {
    arrFiles.push(filePath);
    console.log('Archivos con extensión .md:', arrFiles);
  }
  readFile(arrFiles);
};


function readFile(filePath) {
  if (filePath.length <= 1) {
    console.error('No se encontraron archivos .md');
  } else {
    filePath.forEach((file) => {
      fs.readFile(file, 'utf8', (error, data) => {
        if (error) {
          console.error(error);
          return;
        }
        console.log(data);
      })
    })
  }
};

export { getFiles };

