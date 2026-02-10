import { Project, Task, User } from '../types';

type StoredUser = User & { password: string };

export interface ServerStore {
  users: StoredUser[];
  projects: Project[];
  tasks: Task[];
}

const globalForStore = globalThis as unknown as { __taskflowStore?: ServerStore };

export const getServerStore = (): ServerStore => {
  if (!globalForStore.__taskflowStore) {
    globalForStore.__taskflowStore = {
      users: [],
      projects: [],
      tasks: [],
    };
  }
  return globalForStore.__taskflowStore;
};
