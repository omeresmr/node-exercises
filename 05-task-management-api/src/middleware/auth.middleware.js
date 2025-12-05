import sendErrorMsg from '../utils/sendErrorMsg.js';
import { readFromFile } from '../utils/fileHelpers.js';

export const authenticate = async (req, res, next) => {
  console.log(req.headers);
  const authHeader = req.headers.authorization;

  if (!authHeader) return sendErrorMsg(res, 401, 'You need to login first');

  // Get the token
  const token = authHeader.split(' ')[1];

  if (!token) return sendErrorMsg(res, 401, 'No Token provided');
  if (!token.startsWith('mock-token-'))
    return sendErrorMsg(res, 401, 'Token in wrong format');

  // Get the userId from the token
  const parts = token.split('-');
  const userId = `${parts[2]}-${parts[3]}`;

  console.log(userId);

  // Get all users
  const users = await readFromFile('users.json');

  // Find user
  const user = users.find((u) => u.id === userId);

  if (!user) return sendErrorMsg(res, 401, 'Invalid token');

  // Add user to request
  req.user = {
    id: user.id,
    email: user.email,
    name: user.name,
  };

  next();
};
