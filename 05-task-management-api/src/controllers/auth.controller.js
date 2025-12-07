import { readFromFile, writeToFile } from '../utils/fileHelpers.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';

export const register = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;

  const users = await readFromFile('users.json');
  const userExists = users.some((user) => user.email === email);

  if (userExists) {
    throw new AppError('Email already exists', 400);
  }

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
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const users = await readFromFile('users.json');

  const user = users.find((user) => user.email === email);

  if (!user) {
    throw new AppError('Invalid credentials', 401);
  } else if (user.password !== password) {
    throw new AppError('Invalid credentials', 401);
  } else {
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
});

export const getProfile = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});
