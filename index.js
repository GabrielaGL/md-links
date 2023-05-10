import { testRelativeAbsolute, getFiles, getMDExt, getLinks, mdLinks} from "./src/mdlinks.js";

const filePath = process.argv[2];
const options = process.argv[3];

mdLinks(filePath, options)

