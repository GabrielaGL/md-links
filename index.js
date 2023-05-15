import chalk from 'chalk';
import { mdLinks, getLinks } from "./src/mdlinks.js";

const filePath = process.argv[2];
const options = process.argv[3];

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
//console.log(process.argv);


/* testRelativeAbsolute(filePath)
testPath(filePath) */

function cli(filePath) {
	mdLinks(filePath)
		.then(resp => {
			//console.log('Esta es la promesa de index', resp)
		/* 	if (process.argv.includes('--validate')) {
				console.group()
				console.log(hrefChalk(' href '), hrefText(resp.cleanLinks));
				console.log(textChalk(' text '), textText(resp.text));
				console.log(fileChalk(' file '), fileText(resp.filePath));
				console.log(blankSpace("espacio"));
				console.groupEnd() 
			}
			else if (process.argv.includes('--stats')) {
				console.group()

				console.groupEnd()
			} */

		})
		.catch(error => console.log(error))
}

cli(filePath, options);


/* console.group();
		console.log(hrefChalk(' href '), hrefText(cleanLinks.slice(0, 50)));
		console.log(textChalk(' text '), textText(text));
		console.log(fileChalk(' file '), fileText(filePath.slice(0, 50)));
		console.log(blankSpace("espacio"));
		console.groupEnd(); */