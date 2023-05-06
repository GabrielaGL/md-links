import fs from 'fs';
import path from 'path';

const filePath = 'examplesFiles'

function testRelativeAbsolute(filePath) {
  const itsAbsolute = path.isAbsolute(filePath);

  if (itsAbsolute) {
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
      } else if (stats.isDirectory()) {
        console.log(`La ruta '${filePath}' corresponde a un directorio.`);
        const readDirec = fs.readdirSync(filePath)
        const openFiles = readDirec.map((file) => path.join(filePath, file));
        console.log(openFiles);
      }
    }
  })
}


//getFiles(filePath);

/* function getMDExt(filePath, callback) {

  const mdFiles = filePath.filter(file => path.extname(file) === '.md');
  const arrFiles = mdFiles.map((file) => path.join(rutaDirectorio, file));
  callback(null, arrFiles);
  getMDExt(filePath, (error, arrFiles) => {
    if (error) {
      console.error(error);
      return;
    }
    console.log('Archivos con extensión .md:', arrFiles);
  })
};



getMDExt(filePath); */


/* const readFile = fs.readFile(filePath, 'utf8', (error, data) => {
  if (error) {
    console.error(error);
    return;
  }
  console.log(data);
}); */

export { getFiles };

