import { writeToFile, readFromFile } from '../utils/fileHelpers.js';
import sendErrorMsg from '../utils/sendErrorMsg.js';
import * as taskHelper from '../utils/tasksHelpers.js';

export const getTasksByProject = async (req, res) => {
  const project = await taskHelper.getProject(req);
  if (!project) return sendErrorMsg(res, 404, 'Project not found');
  taskHelper.checkProjectOwner(req, res, project);

  const tasks = await readFromFile('tasks.json');
  const filteredTasks = tasks.filter((t) => t.projectId === project.id);
  if (filteredTasks.length === 0)
    return sendErrorMsg(res, 404, 'No tasks found');

  // Sort by creation date
  const sortedTasks = filteredTasks.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return res.status(200).json(sortedTasks);
};

export const createTask = async (req, res) => {
  const project = await taskHelper.getProject(req);
  if (!project) return sendErrorMsg(res, 404, 'Project not found');
  taskHelper.checkProjectOwner(req, res, project);

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
};

export const getTaskById = async (req, res) => {
  const task = await taskHelper.getTask(req);
  if (!task) return sendErrorMsg(res, 404, 'Task not found');

  const project = await taskHelper.getProject(req, task.projectId);
  if (!project) return sendErrorMsg(res, 404, 'Project not found');

  taskHelper.checkProjectOwner(req, res, project);

  return res.status(200).json(task);
};

export const updateTask = async (req, res) => {
  const task = await taskHelper.getTask(req);
  if (!task) return sendErrorMsg(res, 404, 'Task not found');

  const project = await taskHelper.getProject(req, task.projectId);
  if (!project) return sendErrorMsg(res, 404, 'Project not found');

  taskHelper.checkProjectOwner(req, res, project);

  const { title, description, priority, status } = req.body;

  // Update task

  if (title) task.title = title;
  if (description) task.description = description;
  if (priority) task.priority = priority;
  if (status) task.status = status;

  await taskHelper.saveTask(task);

  res.status(200).json(task);
};

export const updateTaskStatus = async (req, res) => {
  const task = await taskHelper.getTask(req);
  if (!task) return sendErrorMsg(res, 404, 'Task not found');

  const project = await taskHelper.getProject(req, task.projectId);
  if (!project) return sendErrorMsg(res, 404, 'Project not found');

  taskHelper.checkProjectOwner(req, res, project);

  const { status } = req.body;

  task.status = status;
  await taskHelper.saveTask(task);

  return res.status(200).json(task);
};

export const deleteTask = async (req, res) => {
  const task = await taskHelper.getTask(req);
  if (!task) return sendErrorMsg(res, 404, 'Task not found');

  const project = await taskHelper.getProject(req, task.projectId);
  if (!project) return sendErrorMsg(res, 404, 'Project not found');

  const tasks = await readFromFile('tasks.json');
  const indexToDelete = tasks.findIndex((t) => t.id === task.id);

  tasks.splice(indexToDelete, 1);

  await writeToFile('tasks.json', tasks);
  res.status(200).json({ message: 'Task deleted successfully' });
};
