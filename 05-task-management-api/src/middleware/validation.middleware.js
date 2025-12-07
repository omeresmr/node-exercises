import { body, validationResult } from 'express-validator';

// Adds a special error-container to the req object
export const validateRegister = [
  body('email').normalizeEmail().isEmail(),
  body('password').notEmpty().isLength({ min: 8 }),
  body('name').notEmpty().isLength({ min: 2 }),
];

export const validateLogin = [
  body('email').normalizeEmail().isEmail(),
  body('password').notEmpty(),
];

export const validateProject = [
  body('title').trim().notEmpty().isLength({ min: 3 }),
  body('description').optional().trim(),
];

export const validateTask = [
  body('title').trim().notEmpty().isLength({ min: 3 }),
  body('description').optional().trim(),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('status').optional().isIn(['todo', 'in-progress', 'done']),
];

export const validateTaskStatus = [
  body('status').isIn(['todo', 'in-progress', 'done']),
];

export const handleValidationErrors = (req, res, next) => {
  // Reads the error-container in the req object
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array(),
    });
  }

  next();
};
