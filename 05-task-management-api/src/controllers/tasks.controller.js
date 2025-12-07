import { writeToFile, readFromFile } from '../utils/fileHelpers.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';
import * as taskHelper from '../utils/tasksHelpers.js';

export const getTasksByProject = asyncHandler(async (req, res) => {
  const project = await taskHelper.getProject(req);
  if (!project) {
    throw new AppError('Project not found', 404);
  }
  if (!taskHelper.checkProjectOwner(req, project)) {
    throw new AppError('Not authorized', 403);
  }

  const tasks = await readFromFile('tasks.json');
  const filteredTasks = tasks.filter((t) => t.projectId === project.id);
  if (filteredTasks.length === 0) {
    throw new AppError('No tasks found', 404);
  }

  // Sort by creation date
  const sortedTasks = filteredTasks.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return res.status(200).json(sortedTasks);
});

export const createTask = asyncHandler(async (req, res) => {
  const project = await taskHelper.getProject(req);
  if (!project) {
    throw new AppError('Project not found', 404);
  }

  if (!taskHelper.checkProjectOwner(req, project)) {
    throw new AppError('Not authorized', 403);
  }

  const { title, description, priority } = req.body;
  const newTask = {
    id: `task-${Date.now()}`,
    projectId: project.id,
    title,
    description,
    status: 'todo',
    priority: priority || 'medium',
    createdAt: new Date().toISOString(),
  };

  await taskHelper.saveTask(newTask);

  return res.status(201).json(newTask);
});

export const getTaskById = asyncHandler(async (req, res) => {
  const task = await taskHelper.getTask(req);
  if (!task) {
    throw new AppError('Task not found', 404);
  }

  const project = await taskHelper.getProject(req, task.projectId);
  if (!project) {
    throw new AppError('Project not found', 404);
  }

  if (!taskHelper.checkProjectOwner(req, project)) {
    throw new AppError('Not authorized', 403);
  }

  return res.status(200).json(task);
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await taskHelper.getTask(req);
  if (!task) {
    throw new AppError('Task not found', 404);
  }

  const project = await taskHelper.getProject(req, task.projectId);
  if (!project) {
    throw new AppError('Project not found', 404);
  }

  if (!taskHelper.checkProjectOwner(req, project)) {
    throw new AppError('Not authorized', 403);
  }

  const { title, description, priority, status } = req.body;

  // Update task

  if (title) task.title = title;
  if (description) task.description = description;
  if (priority) task.priority = priority;
  if (status) task.status = status;

  await taskHelper.updateTask(task);

  res.status(200).json(task);
});

export const updateTaskStatus = asyncHandler(async (req, res) => {
  const task = await taskHelper.getTask(req);
  if (!task) {
    throw new AppError('Task not found', 404);
  }

  const project = await taskHelper.getProject(req, task.projectId);
  if (!project) {
    throw new AppError('Project not found', 404);
  }

  if (!taskHelper.checkProjectOwner(req, project)) {
    throw new AppError('Not authorized', 403);
  }

  const { status } = req.body;

  task.status = status;
  await taskHelper.updateTask(task);

  return res.status(200).json(task);
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await taskHelper.getTask(req);
  if (!task) {
    throw new AppError('Task not found', 404);
  }

  const project = await taskHelper.getProject(req, task.projectId);
  if (!project) {
    throw new AppError('Project not found', 404);
  }

  if (!taskHelper.checkProjectOwner(req, project)) {
    throw new AppError('Not authorized', 403);
  }

  const tasks = await readFromFile('tasks.json');
  const indexToDelete = tasks.findIndex((t) => t.id === task.id);

  tasks.splice(indexToDelete, 1);

  await writeToFile('tasks.json', tasks);
  res.status(200).json({ message: 'Task deleted successfully' });
});
