import { testRelativeAbsolute, testPath, getFiles, getMDExt, checkLink } from "../src/mdlinks.js";
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';



describe('testRelativeAbsolute', () => {
  it("Debería resolver una ruta relativa a una ruta absoluta", () => {
    const relativePath = "path/to/file.txt";
    const resolvedPath = testRelativeAbsolute(relativePath);
    expect(path.isAbsolute(resolvedPath)).toBe(true);
  });
  
  it("Debería devolver null si no se proporciona una ruta", () => {
    expect(testRelativeAbsolute()).toBe(null);
  });
  
  it("Debería imprimir un mensaje de error si se proporciona una ruta no válida", () => {
    console.error = jest.fn();
    const result = testRelativeAbsolute('');
    expect(console.error).toHaveBeenCalledWith(chalk.bold.red('La ruta no es válida. Intenta con una ruta válida'));
  });
  
});




/* describe('getFiles', () => {
  const testfolder = path.join(__dirname, 'testfolder');
  beforeAll(() => {
    fs.writeFileSync(path.join(testfolder, 'not-a-markdown-file.txt'));
  });

  afterAll(() => {
    fs.unlinkSync(path.join(testfolder, 'not-a-markdown-file.txt'));
  });

  it('should return false for not md files', (done) => {
    getFiles(testfolder)
      .then((file) => {
        expect(file).toEqual([]);
        done();
      });
  });
}) */


/* describe('checkLink', () => {
  it('should return true for a valid link', async () => {
    const result = await checkLink('https://www.google.com');
    expect(result).toBe(true);
  });

  it('should return false for an invalid link', async () => {
    const result = await checkLink('https://www.thislinkdoesnotexist.com');
    expect(result).toBe(false);
  });

  it('should return an error for an invalid link', async () => {
    const result = await checkLink('');
    expect(result).toBe(false);
  });
});
  */


// Mock de fetch
jest.mock('node-fetch');

describe('checkLink', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Debería retornar cada link con su texto, path y status', async () => {
    const links = [
      { cleanLink: 'https://example.com', text: 'Link1', filePath: '/file/path.md' },
      { cleanLink: 'https://example.edu', text: 'Link2', filePath: '/file/path.md' },
    ];

    // Mock Ok
    const mockResponse1 = { status: 200, statusText: 'OK' };
    fetch.mockResolvedValueOnce(mockResponse1);

    // Mock Fail
    const mockResponse2 = { status: 404, statusText: 'Not Found' };
    fetch.mockResolvedValueOnce(mockResponse2);

    const result = await checkLink(links);

    expect(fetch).toHaveBeenCalledWith('https://example.com', { method: 'HEAD' });
    expect(fetch).toHaveBeenCalledWith('https://example.edu', { method: 'HEAD' });

    expect(result).toEqual([
      { cleanLink: 'https://example.com', text: 'Link1', filePath: '/file/path.md', status: 200, statusText: 'OK' },
      { cleanLink: 'https://example.edu', text: 'Link2', filePath: '/file/path.md', status: 404, statusText: 'Not Found' },
    ]);
  });

/*   it('should show error to links', async () => {
      console.error = jest.fn();
      const result = checkLink('');
      expect(console.error).toHaveBeenCalledWith(chalk.bold.red('Error al comprobar el link'));
    }); */
});
