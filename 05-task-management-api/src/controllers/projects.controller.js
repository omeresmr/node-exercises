import { readFromFile, writeToFile } from '../utils/fileHelpers.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';

export const getAllProjects = asyncHandler(async (req, res) => {
  const projects = await readFromFile('projects.json');

  const filteredProjects = projects.filter((pr) => pr.userId === req.user.id);

  if (filteredProjects.length <= 0) {
    throw new AppError('No saved projects found', 404);
  }
});

export const createProject = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  const newProject = {
    id: `proj-${Date.now()}`,
    userId: req.user.id,
    title,
    description,
    createdAt: new Date().toISOString(),
  };
  const projects = await readFromFile('projects.json');

  projects.push(newProject);

  await writeToFile('projects.json', projects);

  return res.status(200).json(newProject);
});

export const getProjectById = asyncHandler(async (req, res) => {
  const projectId = req.params.id;
  const projects = await readFromFile('projects.json');
  const project = projects.find((p) => p.id === projectId);

  if (!project) {
    throw new AppError('Project not found', 400);
  }

  if (project.userId !== req.user.id) {
    throw new AppError('Not authorized', 403);
  }

  return res.status(200).json(project);
});

export const updateProject = asyncHandler(async (req, res) => {
  const projectId = req.params.id;
  const projects = await readFromFile('projects.json');
  const project = projects.find((p) => p.id === projectId);

  if (project.userId !== req.user.id) {
    throw new AppError('Not authorized', 403);
  }

  const { title, description } = req.body;

  project.title = title;
  project.description = description;

  await writeToFile('projects.json', projects);

  return res.status(200).json({ message: 'Updated project successfully' });
});

export const deleteProject = asyncHandler(async (req, res) => {
  const projectId = req.params.id;
  const projects = await readFromFile('projects.json');
  const project = projects.find((p) => p.id === projectId);

  if (project.userId !== req.user.id) {
    throw new AppError('Not authorized', 403);
  }

  const updatedProjects = projects.filter((p) => p.id !== projectId);

  await writeToFile('projects.json', updatedProjects);

  return res.status(200).json({ message: 'Deleted project successfully' });
});
