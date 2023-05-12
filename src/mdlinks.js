import fs from 'fs'
import fsp from 'node:fs/promises';
import path from 'path';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';
import chalk from 'chalk';
import fetch from 'node-fetch';




const error = chalk.bold.red;
const error1 = chalk.bold.bgRed
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
	if (!filePath) {
		console.error(chalk.bold.red("La ruta no es válida. Intenta con una ruta válida"));
		return null;
	}
	let resolvedPath = filePath;
	while (!path.isAbsolute(resolvedPath)) {
		resolvedPath = path.resolve(resolvedPath);
	}
	return resolvedPath;
}


function testPath(filePath) {
	return new Promise((resolve, reject) => {
		fs.stat(filePath, (error, stats) => {
			if (error) {
				reject(console.error(chalk.bold.red(`Error al comprobar la ruta '${filePath}': ${error.code}`)));
			} else {
				resolve(stats)
			}
		})
	})
};


function getFiles(filePath, arrFiles) {
	return new Promise((resolve, reject) => {
		testPath(filePath)
			.then((stats) => {
				if (stats.isFile()) {
					//resolve(filePath)
					if (path.extname(filePath) === '.md') {
						arrFiles.push(filePath);
						//
					}
					resolve()
				} else if (stats.isDirectory()) {
					const readDirec = fs.readdirSync(filePath)
					const getFilesPromises = [];
					readDirec.forEach((file) => {
						const innerRoutePath = `${filePath}/${file}`;
						getFilesPromises.push(getFiles(innerRoutePath, arrFiles));
					})
					Promise.all(getFilesPromises).then(() => {
						resolve()
					})

				}
			})
	})

};


function getLinks(filePath) {
	return new Promise((resolve, reject) => {
		if (filePath.length < 1) {
			console.error(chalk.bold.red('No se encontraron archivos .md'));
			return;
		}
		const links = [];
		const renderer = new marked.Renderer();
		renderer.link = (href, title, text) => {
			const cleanLinks = DOMPurify.sanitize(href);
			links.push({ cleanLinks, text, filePath })
			/* checkLink(links).then(resp => {
				links.push(resp)
			}) */
			resolve(links)
			//console.log(links);

		}
		filePath.forEach((file) => {
			fsp.readFile(file, 'utf8')
				.then((data) => {
					marked(data, { renderer });
				})
				.catch((error) => {
					reject(console.error(chalk.bold.red(`No se pudieron leer los archivos. Error: ${error.code}`)));

				})
		})
	})

}


/* function getLinks(filePath) {
	if (filePath.length < 1) {
		console.error(chalk.bold.red('No se encontraron archivos .md'));
		return;
	}
	//console.log(renderer.link('string'));
	const renderer = new marked.Renderer();
	renderer.link = function (href, title, text) {
		const cleanLinks = DOMPurify.sanitize(href);
		const pruebaOjs = { cleanLinks, text, filePath }
		//console.log("pruebaOjs: ", pruebaOjs);
	
	}
	filePath.forEach((file) => {
		fsp.readFile(file, 'utf8')
			.then((data) => {
				marked(data, { renderer });
			})
			.catch((error) => {
				console.error(chalk.bold.red(`No se pudieron leer los archivos. Error: ${error.code}`));
				return;
			})
	})
}; */


function checkLink(url) {
	return new Promise((resolve, reject) => {
		fetch(url.cleanLinks, { method: 'HEAD' })
			.then(response => {
				if (response.status === 200) {
					url.boolean = true;
					url.statustext === response.statustext
					console.log('status', url.statustext);
				} else {
					url.boolean = false;
					url.statustext === response.statusTextclear
				}
				//resolve(url)
			})
			resolve(url)
			.catch(error => {
				reject(console.error(`Error al comprobar el link ${url}: ${error}`));
			});
	});
}



function mdLinks(filePath) {
	console.log('Entro a mdlinks');
	return new Promise((resolve, reject) => {
		const arrFiles = []
		getFiles(filePath, arrFiles).then(() => {
			//resolve(arrFiles)
			return getLinks(arrFiles)
		})
			.then(pruebaObj => {
				//resolve(pruebaObj);
				return checkLink(pruebaObj)
			})
			.then((arrLinks) => {
				resolve(arrLinks)
			})
			.catch(error => reject(console.error(chalk.bold.red(error))))
	})

}



export { testRelativeAbsolute, testPath, mdLinks, getLinks }