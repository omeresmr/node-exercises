import express from 'express';
import * as tasksController from '../controllers/tasks.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  handleValidationErrors,
  validateTask,
  validateTaskStatus,
} from '../middleware/validation.middleware.js';

const router = express.Router();

router.use(authenticate);

// Individual tasks
router.get('/:id', tasksController.getTaskById);

router.put(
  '/:id',
  validateTask,
  handleValidationErrors,
  tasksController.updateTask
);

router.patch(
  '/:id/status',
  validateTaskStatus,
  handleValidationErrors,
  tasksController.updateTaskStatus
);

router.delete('/:id', tasksController.deleteTask);

export default router;
