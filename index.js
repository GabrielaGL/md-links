import { mdLinks, getLinks } from "./src/mdlinks.js";

const filePath = process.argv[2];
const options = process.argv[3];
//console.log(process.argv);


/* testRelativeAbsolute(filePath)
testPath(filePath) */

function cli(filePath) {
	console.log('Entra a cli');
    mdLinks(filePath)
    .then(resp => {
			console.log(resp)
			if(process.argv.includes('--validate')){
				console.group()

				console.groupEnd()
			}
			else if(process.argv.includes('--stats')) {
				console.group()

				console.groupEnd()
			}

		})
	.catch(error => console.log(error))
}

cli('examplesFiles', options);


/* console.group();
		console.log(hrefChalk(' href '), hrefText(cleanLinks.slice(0, 50)));
		console.log(textChalk(' text '), textText(text));
		console.log(fileChalk(' file '), fileText(filePath.slice(0, 50)));
		console.log(blankSpace("espacio"));
		console.groupEnd(); */