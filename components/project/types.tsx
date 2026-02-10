import { TaskPriority, TaskStatus } from '../../types';

export type TaskFormState = {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  dueTime: string;
  assignedUserIds: string[];
};

export type UserSummary = {
  id: string;
  name: string;
  email: string;
};
