import fs, { stat } from 'fs';
import fsp from 'node:fs/promises';
import path from 'path';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';
import chalk from 'chalk';
import fetch from 'node-fetch';
import { testRelativeAbsolute, testPath, getLinks, checkLink } from './testfolder/md-links';

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

  test('returns an empty object', () => {
    console.error = jest.fn();
    const result = testPath('');
    return expect(result).resolves.toStrictEqual({});
  })

});


describe('getLinks', () => {
  it('should return an error if theres not .md files', () => {
    const filePaths = [];
    console.error = jest.fn();

    getLinks(filePaths);

    expect(console.error).toHaveBeenCalledWith(chalk.bold.red('No se encontraron archivos .md'));
  });


  it('should return the URLs in each .md file', () => {
    const filePaths = ['file1.md', 'file2.md'];

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

  it('should trown and error if the file doesnt exist', () => {
    const filePaths = ['nonexistent.md'];
    console.error = jest.fn();

    const fsp = require('fs').promises;
    const mockedReadFile = jest.spyOn(fsp, 'readFile');
    mockedReadFile.mockRejectedValue(new Error('File not found'));

    return getLinks(filePaths).then((result) => {
      expect(console.error).toHaveBeenCalledWith(chalk.bold.red(`No se pudo leer el archivo 'nonexistent.md'`));
      expect(result).toEqual([]);
    });
  });

  it('return an empty array if doesnt have a path', async () => {
    const filePaths = [];
    console.error = jest.fn();
    const result = await getLinks(filePaths);

    expect(console.error).toHaveBeenCalledWith(chalk.bold.red('No se encontraron archivos .md'));
    expect(result).toBeUndefined();
  });

  it('return an empty array if cant read the files', async () => {
    const filePaths = ['nonexistent.md'];
    const mockError = new Error('File not found');
    fs.promises.readFile.mockRejectedValue(mockError);
    console.error = jest.fn();
    const result = await getLinks(filePaths);

    expect(console.error).toHaveBeenCalledWith(chalk.bold.red(`No se pudo leer el archivo 'nonexistent.md'`));
    expect(result).toEqual([]);
  });
});


// Mock de fetch
jest.mock('node-fetch');

describe('checkLink', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return every URL with text, path & status', async () => {
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
});