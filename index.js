import chalk from 'chalk';
import figlet from 'figlet';
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
const statusok = chalk.hex('#4CAB00').bold;
const statusfail = chalk.hex('#C60000').bold;
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


(function cli(filePath) {
	figlet.text('                 MDlinks', {
    font: "Big",
    horizontalLayout: "default",
    verticalLayout: "default",
    width: 80,
    whitespaceBreak: true,
  }, function (err, ascii){
		console.log(ascii)
	 })
	mdLinks(filePath)
		.then(completeLinks => {
			let total = 0;
			let unique = 0;
			let broken = 0;
			completeLinks.forEach(element => {
				total++
				if (element.status === 200) { unique++ } 
				else { broken++ }
				if (!options) {
					console.group()
					console.log(hrefChalk(' href '), hrefText(element.cleanLink));
					console.log(textChalk(' text '), textText(element.text));
					console.log(fileChalk(' file '), fileText(element.filePath));
					console.log(blankSpace("blank"));
					console.groupEnd()
				}
				else if (process.argv.includes('--validate')) {
					if (element.status === 200) {
						console.group()
						console.log(hrefChalk(' href '), hrefText(element.cleanLink));
						console.log(textChalk(' text '), textText(element.text));
						console.log(fileChalk(' file '), fileText(element.filePath));
						console.log(statusChalk(' stat '), statusok(element.status));
						console.log(ok('  ok  '));
						console.log(blankSpace("blank"));
						console.groupEnd()
					}
					else {
						console.group()
						console.log(hrefChalk(' href '), hrefText(element.cleanLink));
						console.log(textChalk(' text '), textText(element.text));
						console.log(fileChalk(' file '), fileText(element.filePath));
						console.log(statusChalk(' stat '), statusfail(element.status));
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
				console.log(msg(' No se reconoce el comando. Si esta era tu intención, ignora este mensaje. Para ver las opciones utilize el comando --help'));
				console.log(blankSpace("blank"));
				console.groupEnd()
			}
		})
		.catch(error => console.log(error))
}) (filePath)
