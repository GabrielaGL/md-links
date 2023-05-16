import chalk from 'chalk';
import { mdLinks } from "./src/mdlinks.js";

const filePath = process.argv[2];
const options = process.argv[3];

const hrefChalk = chalk.bgHex('#E14C67').bold;
const textChalk = chalk.bgHex('#FAB702').bold;
const fileChalk = chalk.bgHex('#937DC2').bold;
const statusChalk = chalk.bgHex('#C689C6').bold;
const hrefText = chalk.hex('#E14C67').bold;
const textText = chalk.hex('#FAB702').bold;
const fileText = chalk.hex('#937DC2').bold;
const statusText = chalk.hex('#FD874F').bold;
const ok = chalk.bgHex('#4CAB00').bold;
const fail = chalk.bgHex('#C60000').bold;
const totalChalk = chalk.bgHex('#40B7E1').bold;
const uniqueChalk = chalk.bgHex('#C3D944').bold;
const brokenChalk = chalk.bgHex('#E17687').bold;
const totalText = chalk.hex('#40B7E1').bold;
const uniqueText = chalk.hex('#C3D944').bold;
const brokenText = chalk.hex('#E17687').bold;
const blankSpace = chalk.hidden;


function cli(filePath) {
	mdLinks(filePath)
		.then(completeLinks => {
			let total = 0;
			let broken = 0;
			completeLinks.forEach(element => {
				total++
				if(element.status != 200){
					broken++
				}
				//console.log(element);
				if (!options) {
					console.group()
					console.log(hrefChalk(' href '), hrefText(element.cleanLink.slice(0, 50)));
					console.log(textChalk(' text '), textText(element.text));
					console.log(fileChalk(' file '), fileText(element.filePath.slice(0, 50)));
					console.log(blankSpace("blank"));
					console.groupEnd()
				}
				else if (process.argv.includes('--validate')) {
					if (element.status === 200) {
						console.group()
						console.log(hrefChalk(' href '), hrefText(element.cleanLink.slice(0, 50)));
						console.log(textChalk(' text '), textText(element.text));
						console.log(fileChalk(' file '), fileText(element.filePath.slice(0, 50)));
						console.log(statusChalk(' stat '), statusText(element.status));
						console.log(ok('  ok  '));
						console.log(blankSpace("blank"));
						console.groupEnd()
					}
					else {
						console.group()
						console.log(hrefChalk(' href '), hrefText(element.cleanLink.slice(0, 50)));
						console.log(textChalk(' text '), textText(element.text));
						console.log(fileChalk(' file '), fileText(element.filePath.slice(0, 50)));
						console.log(statusChalk(' stat '), statusText(element.status));
						console.log(fail(' fail '));
						console.log(blankSpace("blank"));
						console.groupEnd()
					}
				}
			});

			if(process.argv.includes('--stats')) {
				console.group()
					console.log(totalChalk(' total  '), totalText(total));
					console.log(uniqueChalk(' unique '), uniqueText(total));
					console.log(brokenChalk(' broken '), brokenText(broken));
					console.log(blankSpace("blank"));
					console.groupEnd()
			}
		})
		.catch(error => console.log(error))
}

cli(filePath, options);