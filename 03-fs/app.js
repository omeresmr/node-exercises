import http from 'http';
import fs from 'fs/promises';
import path from 'path';

const server = http.createServer((req, res) => {});

const exists = async function (file) {
  try {
    await fs.stat(f);
    return true;
  } catch {
    return false;
  }
};

const pathToNotes = path.join(process.cwd(), 'data', 'notes.txt');

// 1. Create a directory
if (!exists('data')) await fs.mkdir('data');

// 2. Create a file
await fs.writeFile(pathToNotes, 'Hello Node!');

// 3. Add a second Line
await fs.appendFile(pathToNotes, ' Hello back!');

// 4. Read the file
const fileContent = await fs.readFile(pathToNotes, 'utf8');

console.log(fileContent);

// 5. Get the file name
const fileName = path.basename(pathToNotes);

// 6. Get the end of the file name
const fileEnding = path.extname(pathToNotes);

console.log(fileName, fileEnding);

// 7. Delete the File
await fs.unlink(pathToNotes);

server.listen(3000);
