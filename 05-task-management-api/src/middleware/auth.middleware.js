import { readFromFile } from '../utils/fileHelpers.js';
import AppError from '../utils/AppError.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError('You need to login first', 401);
  }

  // Get the token
  const token = authHeader.split(' ')[1];

  if (!token) {
    throw new AppError('No token provided', 401);
  }
  if (!token.startsWith('mock-token-')) {
    throw new AppError('Token in wrong format', 401);
  }

  // Get the userId from the token
  const parts = token.split('-');
  const userId = `${parts[2]}-${parts[3]}`;

  // Get all users
  const users = await readFromFile('users.json');

  // Find user
  const user = users.find((u) => u.id === userId);

  if (!user) {
    throw new AppError('Invalid token', 401);
  }

  // Add user to request
  req.user = {
    id: user.id,
    email: user.email,
    name: user.name,
  };

  next();
};
