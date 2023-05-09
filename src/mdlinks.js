import fs from 'fs'
import fsp from 'node:fs/promises';
import path from 'path';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';
import chalk from 'chalk';
import fetch from 'node-fetch';


const renderer = new marked.Renderer();

const error = chalk.bold.red;
const hrefChalk = chalk.bgHex('#E14C67').bold;
const textChalk = chalk.bgHex('#FAB702').bold;
const fileChalk = chalk.bgHex('#937DC2').bold;
const status = chalk.bgHex('#E8A0BF').bold;
const hrefText = chalk.hex('#E14C67').bold;
const textText = chalk.hex('#FAB702').bold;
const fileText = chalk.hex('#937DC2').bold;
const statusText = chalk.hex('#E8A0BF').bold;
const ok = chalk.bgHex('#4CAB00').bold;
const fail = chalk.bgHex('#C60000').bold;
const blankSpace = chalk.hidden;


function testRelativeAbsolute(filePath) {
	const itsAbsolute = path.isAbsolute(filePath);
	if (!filePath) {
		console.error(chalk.bold.red("La ruta no es válida. Intenta con una ruta válida"));
	}
	else if (itsAbsolute) {
		//getFiles(filePath)
		return itsAbsolute;
	} else {
		const convertAbsolute = path.resolve(filePath);
		console.log(`La ruta absoluta es '${convertAbsolute}'.`);
		return convertAbsolute;
	}
};


function getFiles(filePath) {
	console.log('Entro');
	fs.stat(filePath, (error, stats) => {
		if (error) {
			console.error(chalk.bold.red(`Error al comprobar la ruta '${filePath}': ${error.code}`));
		} else {
			if (stats.isFile()) {
				//getMDExt(filePath)
				console.log(filePath);
				//return filePath;
			} else if (stats.isDirectory()) {
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
		getLinks(arrFiles)
		//return arrFiles;
	}
	else {
		return false
	}
};


function getLinks(filePath, options) {
	if (filePath.length < 1) {
		console.error(chalk.bold.red('No se encontraron archivos .md'));
	}
	renderer.link = function (href, title, text) {
		const cleanLinks = DOMPurify.sanitize(href);
		checkLink(cleanLinks);
		//console.log(`<a href="${cleanLinks}" title="${title}">${text}</a>`);
		console.log({cleanLinks, text, filePath});
		//return {cleanLinks, text, filePath}
		/* console.group();
		console.log(hrefChalk(' href '), hrefText(cleanLinks.slice(0, 50)));
		console.log(textChalk(' text '), textText(text));
		console.log(fileChalk(' file '), fileText(filePath.slice(0, 50)));
		console.log(blankSpace("espacio"));
		console.groupEnd(); */


	}
	filePath.forEach((file) => {
		fsp.readFile(file, 'utf8').then((data) => {
				marked(data, { renderer });
				//console.log(links);
		}).catch((error) => {
				console.error(chalk.bold.red(`No se pudieron leer los archivos. Error: ${error.code}`));
				return;
		})
	})
};


function checkLink(url) {
	return fetch(url, { method: 'HEAD' })
		.then(response => {
			if (response.ok) {
				return true // El link funciona
			} else {
				return false; // El link no funciona
			}
		})
		.catch(error => {
			console.error(chalk.bold.red(`Error al comprobar el link ${url}: ${error}`));
			return false;
		});
};



export { testRelativeAbsolute, getFiles, getMDExt, getLinks, checkLink }