import { readFromFile, writeToFile } from '../utils/fileHelpers.js';

const sendErrorMsg = (res, statusCode = 400, message) =>
  res.status(statusCode).json({ message });

export const register = async (req, res) => {
  const { email, password, name } = req.body;

  const users = await readFromFile('users.json');
  const userExists = users.some((user) => user.email === email);

  if (userExists) sendErrorMsg(res, 400, 'Email already exists');

  const newUser = {
    id: `user-${Date.now()}`,
    email,
    password,
    name,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  await writeToFile('users.json', users);

  res.status(201).json({
    message: 'User registered successfully',
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
    },
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const users = await readFromFile('users.json');

  const user = users.find((user) => user.email === email);

  if (!user) sendErrorMsg(res, 401, 'Invalid credentials');
  else if (user.password !== password)
    sendErrorMsg(res, 401, 'Invalid credentials');
  else {
    const token = `mock-token-${user.id}-${Date.now()}`;

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  }
};
