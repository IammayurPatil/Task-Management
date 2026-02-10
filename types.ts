
export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
  REVIEW = 'review',
  DONE = 'done'
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  category?: string;
  endDate?: string;
  ownerId: string;
  createdAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  dueTime?: string;
  assignedUserIds?: string[];
  startedAt?: string;
  completedAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
}
