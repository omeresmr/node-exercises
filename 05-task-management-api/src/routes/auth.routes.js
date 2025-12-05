import express from 'express';
import { register, login, getProfile } from '../controllers/auth.controller.js';
import {
  validateRegister,
  validateLogin,
  handleValidationErrors,
} from '../middleware/validation.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', validateRegister, handleValidationErrors, register);
router.post('/login', validateLogin, handleValidationErrors, login);
router.get('/me', authenticate, getProfile);

export default router;
