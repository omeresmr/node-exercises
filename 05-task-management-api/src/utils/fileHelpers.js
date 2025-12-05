import path from 'path';
import __dirname from './path.js';
import fs from 'fs/promises';

const dataPath = path.join(__dirname, 'src', 'data');

export const readFromFile = async (fileName) => {
  const filePath = path.join(dataPath, fileName);

  try {
    const fileData = await fs.readFile(filePath);

    const parsedData = JSON.parse(fileData);

    return parsedData;
  } catch (err) {
    console.error(err);

    return [];
  }
};

export const writeToFile = async (fileName, data) => {
  const filePath = path.join(dataPath, fileName);

  try {
    const dataToJSON = JSON.stringify(data);
    await fs.writeFile(filePath, dataToJSON);
  } catch (err) {
    console.error(err);
  }
};
