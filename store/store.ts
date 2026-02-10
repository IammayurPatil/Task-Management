
import { configureStore, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, Project, Task } from '../types';
import { apiFetch } from '../lib/api';

interface AppState {
  user: User | null;
  token: string | null;
  projects: Project[];
  tasks: Task[];
  loading: boolean;
  error: string | null;
  hydrated: boolean;
}

const initialState: AppState = {
  user: null,
  token: null,
  projects: [],
  tasks: [],
  loading: false,
  error: null,
  hydrated: false,
};

export const initApp = createAsyncThunk('app/init', async () => {
  if (typeof window === 'undefined') {
    return { token: null, user: null };
  }
  const token = localStorage.getItem('tf_token');
  const user = JSON.parse(localStorage.getItem('tf_user') || 'null');
  return { token, user };
});

export const loginUser = createAsyncThunk('app/login', async (credentials: any) => {
  const res = (await apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })) as { user: User; token: string };

  if (typeof window !== 'undefined') {
    localStorage.setItem('tf_token', res.token);
    localStorage.setItem('tf_user', JSON.stringify(res.user));
  }

  return res;
});

export const registerUser = createAsyncThunk('app/register', async (data: any) => {
  const res = (await apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })) as { user: User; token: string };

  if (typeof window !== 'undefined') {
    localStorage.setItem('tf_token', res.token);
    localStorage.setItem('tf_user', JSON.stringify(res.user));
  }

  return res;
});

export const fetchProjects = createAsyncThunk('app/fetchProjects', async () => {
  return await apiFetch('/api/projects');
});

export const createProject = createAsyncThunk('app/createProject', async (data: any) => {
  return await apiFetch('/api/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  });
});

export const removeProject = createAsyncThunk('app/removeProject', async (id: string) => {
  await apiFetch(`/api/projects/${id}`, { method: 'DELETE' });
  return id;
});

export const updateProject = createAsyncThunk('app/updateProject', async ({ id, updates }: { id: string; updates: any }) => {
  return await apiFetch(`/api/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
});

export const fetchTasks = createAsyncThunk('app/fetchTasks', async (projectId: string) => {
  return await apiFetch(`/api/tasks?projectId=${projectId}`);
});

export const createTask = createAsyncThunk('app/createTask', async (data: any) => {
  return await apiFetch('/api/tasks', {
    method: 'POST',
    body: JSON.stringify(data),
  });
});

export const updateTask = createAsyncThunk('app/updateTask', async ({ id, updates }: { id: string; updates: any }) => {
  return await apiFetch(`/api/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
});

export const removeTask = createAsyncThunk('app/removeTask', async (id: string) => {
  await apiFetch(`/api/tasks/${id}`, { method: 'DELETE' });
  return id;
});

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    logoutUser: (state) => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('tf_token');
        localStorage.removeItem('tf_user');
      }
      state.user = null;
      state.token = null;
      state.projects = [];
      state.tasks = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initApp.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.hydrated = true;
      })
      .addCase(initApp.rejected, (state) => {
        state.hydrated = true;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
      })
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action: PayloadAction<Project[]>) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load projects';
      })
      .addCase(createProject.fulfilled, (state, action: PayloadAction<Project>) => {
        state.projects.push(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create project';
      })
      .addCase(removeProject.fulfilled, (state, action: PayloadAction<string>) => {
        state.projects = state.projects.filter(p => p.id !== action.payload);
      })
      .addCase(removeProject.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to remove project';
      })
      .addCase(updateProject.fulfilled, (state, action: PayloadAction<Project>) => {
        state.projects = state.projects.map(p => (p.id === action.payload.id ? action.payload : p));
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update project';
      })
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load tasks';
      })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create task';
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.tasks = state.tasks.map(t => (t.id === action.payload.id ? action.payload : t));
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update task';
      })
      .addCase(removeTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.tasks = state.tasks.filter(t => t.id !== action.payload);
      })
      .addCase(removeTask.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to remove task';
      });
  },
});

export const { logoutUser, clearError } = appSlice.actions;

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
