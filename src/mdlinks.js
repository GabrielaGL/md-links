import fs from 'fs'
import fsp from 'node:fs/promises';
import path from 'path';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';
import chalk from 'chalk';
import fetch from 'node-fetch';




const error = chalk.bold.red;
const error1 = chalk.bold.bgRed



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


function getFiles(filePath) {
	return new Promise((resolve, reject) => {
		testPath(testRelativeAbsolute(filePath))
			.then((stats) => {
				if (stats.isFile()) {
					if (path.extname(filePath) === '.md') {
						//arrFiles.push(filePath);
						resolve(filePath)
					}
				} else if (stats.isDirectory()) {
					const readDirec = fs.readdirSync(filePath)
					const getFilesPromises = [];
					readDirec.forEach((file) => {
						const innerRoutePath = `${filePath}/${file}`;
						getFiles(innerRoutePath);
					})
					Promise.all(getFilesPromises).then(() => {
						resolve(filePath)
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
		renderer.link = function (href, title, text) {
			const regex = /\bhttps?:\/\/\S+\b(?!#)\b/gi;
			if (href.match(regex)) {
				const cleanLink = DOMPurify.sanitize(href);
				const link = { cleanLink, text, filePath }
				links.push(link)
			}
		}
		fsp.readFile(filePath, 'utf8')
			.then((data) => {
				marked(data, { renderer });
				resolve(links);
			})
			.catch((error) => {
				reject(console.error(chalk.bold.red(`No se pudieron leer los archivos. Error: ${error.code}`)));

			})
	})

}

function checkLink(url) {
	const fetchPromises = url.map(link => {
		return fetch(link.cleanLink, { method: 'HEAD' })
			.then(response => {
				link['status'] = response.status;
				link['statusText'] = response.statusText;
				return link;
			})
			.catch(error => {
				console.error(`Error al comprobar el link ${link}: ${error}`);
				return
			});
	});

	return Promise.all(fetchPromises)
		.then(fullLinks => {
			//console.log('Esto es url', fullLinks);
			return fullLinks; // Retornamos el array completo de links
		});
}


/* function checkLink(url) {
	return new Promise((resolve, reject) => {
		url.forEach(link => {
			fetch(link.cleanLink, { method: 'HEAD' })
				.then(response => {
					link['status'] = response.status
					link['statustext'] = response.statusText
				})
				.catch(error => {
					reject(console.error(`Error al comprobar el link ${link}: ${error}`));
				});
		})
		resolve(url)
	});
} */



function mdLinks(filePath) {
	return new Promise((resolve, reject) => {
		getFiles(testRelativeAbsolute(filePath))
			.then((arrFiles) => {
				//resolve(arrFiles)
				//console.log('Este es arrfiles', arrFiles);
				return getLinks(arrFiles)
			})
			.then(links => {
				//console.log('Estos son los links', links);
				//resolve(links);
				return checkLink(links)
			})
			.then((arrLinks) => {
				//console.log('Esta es la promesa de mdlinks', arrLinks);
				resolve(arrLinks)
			})
			.catch(error => reject(console.error(chalk.bold.red(error))))
	})
}



export { testRelativeAbsolute, testPath, mdLinks, getLinks }