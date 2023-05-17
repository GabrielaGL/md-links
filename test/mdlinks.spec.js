import fs, { Stats } from 'fs';
import fsp from 'node:fs/promises';
import path from 'path';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';
import chalk from 'chalk';
import { testRelativeAbsolute, testPath, getFiles, mdLinks, getLinks, checkLink } from '../src/mdlinks';

console.warn = () => { };

describe('testRelativeAbsolute', () => {
  test('returns null if the path is invalid', () => {
    const result = testRelativeAbsolute('');
    expect(result).toBe(null);
  });

  test('returns the absolute path if the path is relative', () => {
    const filePath = 'example.md';
    const expected = path.resolve(filePath);
    const result = testRelativeAbsolute(filePath);
    expect(result).toBe(expected);
  });

  test('returns the absolute path if the path is already absolute', () => {
    const filePath = '/path/to/example.md';
    const result = testRelativeAbsolute(filePath);
    expect(result).toBe(filePath);
  });
});


describe('testPath', () => {
  it('Debería retornar un valor truthy con una ruta válida', async () => {
    const filePath = "path/to/file.md";
    await expect.assertions(1);
    await expect(testPath(filePath)).toBeTruthy()
  });

  let originalConsoleLog;
  let consoleOutput;

  beforeEach(() => {
    originalConsoleLog = console.log;
    console.log = jest.fn((...args) => {
      consoleOutput += args.join(' ');
    });
  });

  afterEach(() => {
    console.log = originalConsoleLog;
    consoleOutput = '';
  });

  test('resolves with stats if the path exists', async () => {
    const filePath = 'test/testfolder/test.md';
    const expected = {}; // Mocked stats object
    fs.stat = jest.fn((path, callback) => {
      callback(null, expected);
    });

    const result = await testPath(filePath);
    expect(result).toEqual(expected);
    expect(consoleOutput).toBe("");
  });

});


/* describe('getFiles', () => {
  it('Debería retornar un valor truthy con una ruta válida', async () => {
    const filePath = "path/to/file.md";
    const result = await getFiles(filePath)
    stats.isFile = jest.fn((path, callback) => {
      callback(null, expected);
    });
    await expect.assertions(1);
    expect(result).toHaveBeenCalled(filePath)
  });


}); */




describe('getLinks', () => {
  it('debería mostrar un error si no se encuentran archivos .md', () => {
    const filePaths = [];
    console.error = jest.fn();

    getLinks(filePaths);

    expect(console.error).toHaveBeenCalledWith(chalk.bold.red('No se encontraron archivos .md'));
  });


  it('debería retornar los enlaces encontrados en los archivos .md', () => {
    const filePaths = ['file1.md', 'file2.md'];

    const fsp = require('fs').promises;
    const mockedReadFile = jest.spyOn(fsp, 'readFile'); //spyOn seguimiento a métodos
    mockedReadFile.mockResolvedValue('File content');
    console.error = jest.fn();
    DOMPurify.sanitize = jest.fn((href) => href);
    let addedLinks = [];

    const mockedLink = jest.fn((href, title, text) => {
      addedLinks.push({ cleanLink: href, text, filePath: 'file1.md' });
    });

    marked.Renderer.prototype.link = mockedLink;

    return getLinks(filePaths).then((result) => {
      expect(result).toEqual(addedLinks);
    });
  });

  it('debería mostrar un error si no se puede leer un archivo', () => {
    const filePaths = ['nonexistent.md'];
    console.error = jest.fn();

    const fsp = require('fs').promises;
    const mockedReadFile = jest.spyOn(fsp, 'readFile');
    mockedReadFile.mockRejectedValue(new Error('File not found'));

    return getLinks(filePaths).then((result) => {
      expect(console.error).toHaveBeenCalledWith(chalk.bold.red(`No se pudo leer el archivo 'nonexistent.md'. Error: undefined`));
      expect(result).toEqual([]);
    });
  });
});


describe('checkLink', () => {
  it('debería verificar el estado de los enlaces', async () => {
    let originalFetch;

    beforeAll(() => {
      originalFetch = global.fetch;
    });

    beforeEach(() => {
      global.fetch = jest.fn();
    });

    afterEach(() => {
      global.fetch.mockReset();
    });

    afterAll(() => {
      global.fetch = originalFetch;
    });

    const links = [
      { cleanLink: 'https://example.com' },
      { cleanLink: 'https://google.com' },
    ];

    const mockResponse = {
      status: 200,
      statusText: 'OK',
    };

    global.fetch.mockResolvedValueOnce(mockResponse);


    await expect(checkLink(links)).toEqual([
      { cleanLink: 'https://example.com', status: 200, statusText: 'OK' },
      { cleanLink: 'https://google.com', status: 200, statusText: 'OK' },
    ]);
  });
});


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

  it('should show error to links', async () => {
    console.error = jest.fn();
    const result = checkLink('');
    expect(console.error).toHaveBeenCalledWith(chalk.bold.red('Error al comprobar el link'));
  });
});

describe('getFiles', () => {
  test('returns an array with the file path if it is a .md file', () => {
    const filePath = 'test/testfolder/test.md';
    const expected = [filePath];
    return getFiles(filePath).then((result) => {
      expect(result).toEqual(expected);
    });
  });

  test('returns an empty array if the file is not a .md file', () => {
    const filePath = 'example.txt';
    const expected = [];
    return getFiles(filePath).then((result) => {
      expect(result).toEqual(expected);
    });
  });

  test('returns an array with the file paths if it is a directory containing .md files', () => {
    const filePath = 'example-directory';
    const expected = ['example-directory/file1.md', 'example-directory/file2.md'];
    return getFiles(filePath).then((result) => {
      expect(result).toEqual(expected);
    });
  });

  test('returns an empty array if the directory does not contain any .md files', () => {
    const filePath = 'example-directory';
    const expected = [];
    return getFiles(filePath).then((result) => {
      expect(result).toEqual(expected);
    });
  });

  test('returns an empty array if the path does not exist', () => {
    const filePath = 'non-existent-directory';
    const expected = [];
    return getFiles(filePath).then((result) => {
      expect(result).toEqual(expected);
    });
  });
});  */