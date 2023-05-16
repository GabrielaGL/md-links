import fs from 'fs'
import fsp from 'node:fs/promises';
import path from 'path';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';
import chalk from 'chalk';
import fetch from 'node-fetch';


console.warn = () => { };
const error = chalk.bold.red;
const error1 = chalk.bold.bgRed

/**
 * Convert relative paths to absolute
 * @param {*} filePath 
 * @returns 
 */
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

/**
 * Provides route statistics
 * @param {*} filePath 
 * @returns 
 */
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

/**
 * Open directories and return each file
 * @param {*} filePath 
 * @returns 
 */
function getFiles(filePath) {
	return new Promise((resolve, reject) => {
		testPath(testRelativeAbsolute(filePath))
			.then((stats) => {
				if (stats.isFile()) {
					if (path.extname(filePath) === '.md') {
						resolve([filePath]);
					} else {
						resolve([]);
					}
				} else if (stats.isDirectory()) {
					fs.readdir(filePath, (err, files) => {
						if (err) {
							console.error(err);
							reject(err);
							return;
						}
						const promises = files.map((file) => {
							const innerRoutePath = path.join(filePath, file);
							return getFiles(innerRoutePath);
						});
						Promise.all(promises)
							.then((files) => {
								const flattenedFiles = files.flat();
								resolve(flattenedFiles);
							})
							.catch((err) => {
								console.error(err);
								reject(err);
							});
					});
				} else {
					resolve([]);
				}
			})
			.catch((err) => {
				console.error(err);
				reject(err);
			});
	});
}

/**
 * Filter links of each file
 * @param {*} filePaths 
 * @returns 
 */
function getLinks(filePaths) {
	if (filePaths.length < 1) {
		console.error(chalk.bold.red('No se encontraron archivos .md'));
		return;
	}
	const promises = filePaths.map((file) => {
		const links = [];
		const renderer = new marked.Renderer();
		renderer.link = function (href, title, text) {
			const regex = /\bhttps?:\/\/\S+\b(?!#)\b/gi;
			if (href.match(regex)) {
				const cleanLink = DOMPurify.sanitize(href).slice(0, 50);
				const link = { cleanLink, text, filePath: file.slice(0, 50) };
				links.push(link);
			}
		};
		return fsp.readFile(file, 'utf8')
			.then((data) => {
				marked(data, { renderer });
				return links;
			})
			.catch((error) => {
				console.error(chalk.bold.red(`No se pudo leer el archivo '${file}'. Error: ${error.code}`));
				return [];
			});
	});
	return Promise.all(promises)
		.then((results) => {
			const allLinks = results.flat();
			return allLinks;
		});
}

/**
 * Makes http request to verify links
 * @param {*} url 
 * @returns 
 */
function checkLink(url) {
	const fetchPromises = url.map(link => {
		return fetch(link.cleanLink, { method: 'HEAD' })
			.then(response => {
				link['status'] = response.status;
				link['statusText'] = response.statusText;
				return link;
			})
			.catch(error => {
				//console.error(`Error al comprobar el link ${link}: ${error}`);
				return error
			});
	});
	return Promise.all(fetchPromises)
		.then(fullLinks => {
			return fullLinks;
		});
}

/**
 * Promise chain of each function
 * @param {*} filePath 
 * @returns 
 */
function mdLinks(filePath) {
	return new Promise((resolve, reject) => {
		getFiles(testRelativeAbsolute(filePath))
			.then((arrFiles) => {
				return getLinks(arrFiles)
			})
			.then(links => {
				return checkLink(links)
			})
			.then((arrLinks) => {
				const result = arrLinks.filter(obj => obj !== undefined).map(obj => obj);
				resolve(result)
			})
			.catch(error => reject(console.error(chalk.bold.red('Este es el error de mdlinks', error))))
	})
}



export { testRelativeAbsolute, testPath, mdLinks, getLinks }