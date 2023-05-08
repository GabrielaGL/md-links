import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';
import chalk from 'chalk';


const error = chalk.bold.red;


//const filePath = 'examplesFiles'

function testRelativeAbsolute(filePath) {
  const itsAbsolute = path.isAbsolute(filePath);
  if (!filePath) {
    console.error(error("La ruta no es válida. Intenta con una ruta válida"));
  }
  else if (itsAbsolute) {
    console.log(`La ruta '${filePath}' es absoluta.`);
    //Aquí debería mandar a la siguiente función
  } else {
    const convertAbsolute = path.resolve(filePath);
    console.log(`La ruta absoluta es '${convertAbsolute}'.`);
    testRelativeAbsolute(convertAbsolute);
  }

}


function getFiles(filePath) {
  fs.stat(filePath, (error, stats) => {
    if (error) {
      console.error(error(`Error al comprobar la ruta '${filePath}': ${error.code}`));
    } else {
      if (stats.isFile()) {
        console.log(`La ruta '${filePath}' corresponde a un archivo.`);
        getMDExt(filePath);
      } else if (stats.isDirectory()) {
        console.log(`La ruta '${filePath}' corresponde a un directorio.`);
        const readDirec = fs.readdirSync(filePath)
        readDirec.forEach((file) => {
          const directoryPath = `${filePath}/${file}`;
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
    //getLinks(arrFiles);
  }
};


function getLinks(filePath) {
  if (filePath.length < 1) {
    console.error(error('No se encontraron archivos .md'));
  }
  const links = [];
  const renderer = new marked.Renderer();
  renderer.link = function (href, title, text) {
    const cleanLinks = DOMPurify.sanitize(href);
    links.push(cleanLinks);
    return `<a href="${cleanLinks}" title="${title}">${text}</a>`;
  }
  filePath.forEach((file) => {
    fs.readFile(file, 'utf8', (error, data) => {
      if (error) {
        console.error(error(`No se pudieron leer los archivos. Error: ${error.code}`));
        return;
      } else {
        marked(data, { renderer });
        console.log(links);
      }
    })
  })
};

const mdlinks = { testRelativeAbsolute, getFiles, getMDExt, getLinks }
export default mdlinks;


