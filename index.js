import fs from 'fs';
import path from 'path';

const filePath = 'README.md'

function comprobarRutaAbsoluta(filePath) {
  const itsAbsolute = path.isAbsolute(filePath);

  if (itsAbsolute) {
    console.log(`La ruta '${filePath}' es absoluta.`);
  } else {
    console.log(`La ruta '${filePath}' es relativa.`);
    const convertAbsolute = path.resolve(filePath);
    console.log(`La ruta absoluta es '${convertAbsolute}'.`);
    comprobarRutaAbsoluta(convertAbsolute);
  }
}

comprobarRutaAbsoluta(filePath)

/* const readFile = fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);
}); */



