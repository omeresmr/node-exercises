import http from 'http';
import path from 'path';
import fs from 'fs/promises';
import { Buffer } from 'buffer';
import { fileURLToPath } from 'url';

// Variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tempFilesDir = path.join(__dirname, 'temp_uploads');

// Functions

// Gets file content
async function processData(readable) {
  const bodyChunks = [];
  for await (const chunk of readable) {
    bodyChunks.push(chunk);
  }

  return Buffer.concat(bodyChunks).toString();
}

// Saves the temporary file
async function saveFile(fileContent) {
  const filePath = path.join(tempFilesDir, `${Date.now().toString()}.txt`);
  try {
    // Be sure that the dir exists
    await fs.mkdir(tempFilesDir, { recursive: true });

    // Create file
    await fs.writeFile(filePath, fileContent);
  } catch (err) {
    console.error(err);
  }

  return filePath;
}

// Returns file infos and deletes the temporary file
async function analyzeFile(pathToFile) {
  let fileContent;
  try {
    // Save the file content
    fileContent = await fs.readFile(pathToFile, 'utf8');

    // Delete file
    await fs.unlink(pathToFile);
  } catch (err) {
    console.error(err);
  }

  // Return a JSON object
  return JSON.stringify({
    lineCount: fileContent.split('\n').length,
    fileSize: `${Buffer.byteLength(fileContent, 'utf8')} bytes`,
  });
}

// Server
const server = http.createServer(async (req, res) => {
  if (req.url === '/upload' && req.method === 'POST') {
    // 1. Get the uploaded file
    const uploadedFile = await processData(req);

    // 2. Save the file and get the path
    const pathToFile = await saveFile(uploadedFile);

    // 3. Get the file infos
    const fileInfos = await analyzeFile(pathToFile);

    // 4. Return file infos as JSON to client
    res.end(fileInfos);
  }

  // If client enters any other url, set status code to 404
  res.statusCode = 404;
  res.end();
});

server.listen(3000);

// To test an upload:
// curl -X POST --data-binary @./test_upload.txt http://localhost:3000/upload
