
import { Project } from '../types';

const getStore = (): Project[] => JSON.parse(localStorage.getItem('tf_projects') || '[]');

export const getProjects = async (userId: string) => {
  return getStore().filter(p => p.ownerId === userId);
};

export const createProject = async (userId: string, data: any) => {
  const projects = getStore();
  const newProject: Project = {
    ...data,
    id: Math.random().toString(36).substr(2, 9),
    ownerId: userId,
    createdAt: new Date().toISOString()
  };
  projects.push(newProject);
  localStorage.setItem('tf_projects', JSON.stringify(projects));
  return newProject;
};

export const deleteProject = async (id: string) => {
  let projects = getStore();
  projects = projects.filter(p => p.id !== id);
  localStorage.setItem('tf_projects', JSON.stringify(projects));
  
  // Cascade delete tasks
  let tasks = JSON.parse(localStorage.getItem('tf_tasks') || '[]');
  tasks = tasks.filter((t: any) => t.projectId !== id);
  localStorage.setItem('tf_tasks', JSON.stringify(tasks));
  
  return { success: true };
};
