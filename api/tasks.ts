
import { Task } from '../types';

const getStore = (): Task[] => JSON.parse(localStorage.getItem('tf_tasks') || '[]');

export const getTasks = async (projectId: string) => {
  return getStore().filter(t => t.projectId === projectId);
};

export const createTask = async (data: any) => {
  const tasks = getStore();
  const newTask: Task = {
    ...data,
    id: Math.random().toString(36).substr(2, 9)
  };
  tasks.push(newTask);
  localStorage.setItem('tf_tasks', JSON.stringify(tasks));
  return newTask;
};

export const updateTask = async (id: string, updates: any) => {
  const tasks = getStore();
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) throw new Error('Task not found');
  tasks[index] = { ...tasks[index], ...updates };
  localStorage.setItem('tf_tasks', JSON.stringify(tasks));
  return tasks[index];
};

export const deleteTask = async (id: string) => {
  let tasks = getStore();
  tasks = tasks.filter(t => t.id !== id);
  localStorage.setItem('tf_tasks', JSON.stringify(tasks));
  return { success: true };
};
