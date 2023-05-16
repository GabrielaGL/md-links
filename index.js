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
const totalChalk = chalk.bgHex('#F6A730').bold;
const uniqueChalk = chalk.bgHex('#4CAB00').bold;
const brokenChalk = chalk.bgHex('#E14C67').bold;
const totalText = chalk.hex('#F6A730').bold;
const uniqueText = chalk.hex('#4CAB00').bold;
const brokenText = chalk.hex('#E14C67').bold;
const msg = chalk.hex('#C3D944');
const blankSpace = chalk.hidden;


function cli(filePath) {
	mdLinks(filePath)
		.then(completeLinks => {
			let total = 0;
			let unique = 0;
			let broken = 0;
			completeLinks.forEach(element => {
				total++
				if (element.status === 200) {
					unique++
				} else { broken++ }
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

			if (process.argv.includes('--stats')) {
				console.group()
				console.log(totalChalk(' total  '), totalText(total));
				console.log(uniqueChalk(' unique '), uniqueText(unique));
				console.log(brokenChalk(' broken '), brokenText(broken));
				console.log(blankSpace("blank"));
				console.groupEnd()
			}
			else if(process.argv.includes('--help')){
				console.group()
				console.log(fileText(' Los comandos disponibles son: '));
				console.log(blankSpace("blank"));
				console.log(ok(' --validate '), msg('Valida los links de cada archivo markdown'));
				console.log(blankSpace("blank"));
				console.log(ok('   --stats  '), msg('Proporciona estadísticas del total de los links recuperados'));
				console.log(blankSpace("blank"));
				console.groupEnd()
			}
			else if(options != '--validate' && '--stats' && '--help' ) {
				console.group()
				console.log(msg(' No se reconoce el comando, para ver las opciones utilize el comando --help'));
				console.log(blankSpace("blank"));
				console.groupEnd()
			}
		})
		.catch(error => console.log(error))
}

cli(filePath, options);