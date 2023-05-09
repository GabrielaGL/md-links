import { testRelativeAbsolute, getFiles, getMDExt, getLinks } from "./src/mdlinks.js";

const filePath = process.argv[2];
//const options = [process.argv[3], process.argv[4]];


const absolutePath = testRelativeAbsolute(filePath)
//getFiles(absolutePath);

getFiles(absolutePath)
	

