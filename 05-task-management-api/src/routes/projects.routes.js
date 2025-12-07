import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import * as projectsController from '../controllers/projects.controller.js';
import * as tasksController from '../controllers/tasks.controller.js';
import {
  validateProject,
  handleValidationErrors,
  validateTask,
} from '../middleware/validation.middleware.js';

const router = express.Router();

// Secure all routes
router.use(authenticate);

router.get('/', projectsController.getAllProjects);

router.post(
  '/',
  validateProject,
  handleValidationErrors,
  projectsController.createProject
);

router.get('/:id', projectsController.getProjectById);

router.put(
  '/:id',
  validateProject,
  handleValidationErrors,
  projectsController.updateProject
);

router.delete(
  '/:id',
  validateProject,
  handleValidationErrors,
  projectsController.deleteProject
);

// Tasks for a specific project
router.get('/:id/tasks', tasksController.getTasksByProject);

router.post(
  '/:id/tasks',
  validateTask,
  handleValidationErrors,
  tasksController.createTask
);

export default router;
