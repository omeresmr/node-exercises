import dotenv from 'dotenv';
import app from './app.js';
import path from 'path';
import __dirname from './utils/path.js';

const pathToDotEnv = path.join(__dirname, '.env');

dotenv.config({ path: pathToDotEnv });

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on PORT:${process.env.PORT}`);
});
