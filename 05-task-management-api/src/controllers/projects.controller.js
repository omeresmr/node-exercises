import { readFromFile, writeToFile } from '../utils/fileHelpers.js';
import sendErrorMsg from '../utils/sendErrorMsg.js';

export const getAllProjects = async (req, res) => {
  const projects = await readFromFile('projects.json');

  const filteredProjects = projects.filter((pr) => pr.userId === req.user.id);

  if (filteredProjects.length <= 0)
    return sendErrorMsg(res, 404, 'No saved projects found');

  const sortedProjects = filteredProjects.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return res.status(200).json(sortedProjects);
};
export const createProject = async (req, res) => {
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
};
export const getProjectById = async (req, res) => {
  const projectId = req.params.id;
  const projects = await readFromFile('projects.json');
  const project = projects.find((p) => p.id === projectId);

  if (!project) return sendErrorMsg(res, 404, 'Project not found');

  if (project.userId !== req.user.id)
    return res.status(403).json({ message: 'Not authorized' });

  return res.status(200).json(project);
};
export const updateProject = async (req, res) => {
  const projectId = req.params.id;
  const projects = await readFromFile('projects.json');
  const project = projects.find((p) => p.id === projectId);

  if (project.userId !== req.user.id)
    return res.status(403).json({ message: 'Not authorized' });

  const { title, description } = req.body;

  project.title = title;
  project.description = description;

  await writeToFile('projects.json', projects);

  return res.status(200).json({ message: 'Updated project successfully' });
};
export const deleteProject = async (req, res) => {
  const projectId = req.params.id;
  const projects = await readFromFile('projects.json');
  const project = projects.find((p) => p.id === projectId);

  if (project.userId !== req.user.id)
    return res.status(403).json({ message: 'Not authorized' });

  const updatedProjects = projects.filter((p) => p.id !== projectId);

  await writeToFile('projects.json', updatedProjects);

  return res.status(200).json({ message: 'Deleted project successfully' });
};
