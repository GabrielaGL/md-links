import { testRelativeAbsolute, getFiles, getMDExt, checkLink } from "../src/mdlinks.js";
import chalk from 'chalk';


describe('testRelativeAbsolute', () => {
  test('returns true for an absolute path', () => {
    const result = testRelativeAbsolute('/path/to/file');
    expect(result).toBe(true);
  });

  test('returns an error message for an invalid path', () => {
    console.error = jest.fn();
    const result = testRelativeAbsolute('');
    expect(console.error).toHaveBeenCalledWith(chalk.bold.red('La ruta no es válida. Intenta con una ruta válida'));
  });
});



describe('getMDExt', () => {
  test('should return an array with one file path if the file has .md extension', () => {
    const filePath = '/path/to/file.md';
    const expectedOutput = ['/path/to/file.md'];
    expect(getMDExt(filePath)).toEqual(expectedOutput);
  });

  test('should return an empty array if the file does not have .md extension', () => {
    const filePath = '/path/to/file.txt';
    const expectedOutput = false;
    expect(getMDExt(filePath)).toBe(expectedOutput);
  });
});


describe('checkLink', () => {
  it('should return true for a valid link', async () => {
    const result = await checkLink('https://www.google.com');
    expect(result).toBe(true);
  });

  it('should return false for an invalid link', async () => {
    const result = await checkLink('https://www.thislinkdoesnotexist.com');
    expect(result).toBe(false);
  });
});
