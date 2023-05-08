/* import mdlinks from "./src/mdlinks.js";

const filePath = process.argv[2];
const options = [process.argv[3], process.argv[4]] */

/* console.group("User");
console.log("Este es el primero");
console.log("Segundo");
console.log("tercero");
console.groupEnd(); */

import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';
import chalk from 'chalk';

const filePath = 'examplesFiles'
const error = chalk.bold.red;
const link = chalk.bgHex('#FAB702').bold;
const href = chalk.bgHex('#FF914D').bold;
const text = chalk.bgHex('#E17687').bold;
const file = chalk.bgHex('#E14C67').bold;
const status = chalk.bgHex('#937DC2').bold;
const ok = chalk.bgHex('#4CAB00').bold;
const fail = chalk.bgHex('#C60000').bold;
const hrefText = chalk.hex('#FF914D').bold;
const texText = chalk.hex('#E8A0BF').bold;
const fileText = chalk.hex('#E14C67').bold;
const statusText = chalk.hex('#937DC2').bold;

console.group();
console.log(link(' Link '));
console.log(href(' href '), hrefText('prueba'));
console.log(text(' text '), texText('texto'));
console.log(file(' file '), fileText('texto texto'));
console.log(status(' stat '), statusText('Texto txt') );
console.log(ok('  ok  '));
console.log(fail(' fail '));
console.groupEnd();


/* function testRelativeAbsolute(filePath) {
	const itsAbsolute = path.isAbsolute(filePath);
	if (!filePath) {
		console.error(error("La ruta no es válida. Intenta con una ruta válida"));
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
		getLinks(arrFiles);
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
		links.push(cleanLinks, text);
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
				console.group("User");
				console.log("Este es el primero");
				console.log("Segundo");
				console.log("tercero");
				console.groupEnd();
			}
		})
	})
};


testRelativeAbsolute(filePath) */