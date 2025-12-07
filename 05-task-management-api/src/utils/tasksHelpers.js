import { readFromFile, writeToFile } from './fileHelpers.js';

export const getProject = async (req, projectId = req.params.id) => {
  const projects = await readFromFile('projects.json');
  const project = projects.find((p) => p.id === projectId);
  console.log(projects, project);

  return project;
};

export const checkProjectOwner = (req, res, project) => {
  if (project.userId !== req.user.id)
    return sendErrorMsg(res, 403, 'No access');
};

export const getTask = async (req) => {
  const taskId = req.params.id;
  const tasks = await readFromFile('tasks.json');
  const task = tasks.find((t) => t.id === taskId);

  return task;
};

export const saveTask = async (newTask) => {
  const tasks = await readFromFile('tasks.json');
  const taskIndex = tasks.findIndex((t) => t.id === newTask.id);
  tasks[taskIndex] = newTask;

  await writeToFile('tasks.json', tasks);
};
