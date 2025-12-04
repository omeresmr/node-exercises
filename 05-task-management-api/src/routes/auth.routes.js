import express from 'express';
import { register } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', (req, res, next) => res.json({ message: 'Login Route' }));

export default router;
