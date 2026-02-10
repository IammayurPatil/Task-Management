import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { fetchProjects, fetchTasks, createTask, updateTask, removeTask } from '../../store/store';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { Typography, CircularProgress, Breadcrumbs, Link, Button } from '@mui/material';
import { TaskStatus, TaskPriority, Task } from '../../types';
import { apiFetch } from '../../lib/api';
import ProjectHeader from './ProjectHeader';
import BoardToolbar from './BoardToolbar';
import TaskColumn from './TaskColumn';
import TaskListView from './TaskListView';
import TaskDialog from './TaskDialog';
import { TaskFormState, UserSummary } from './types';

const ProjectView: React.FC = () => {
  const router = useRouter();
  const projectIdParam = router.query.projectId;
  const projectId = Array.isArray(projectIdParam) ? projectIdParam[0] : projectIdParam;
  const dispatch = useAppDispatch();
  const projects = useAppSelector(s => s.app.projects);
  const tasks = useAppSelector(s => s.app.tasks);
  const loading = useAppSelector(s => s.app.loading);

  const project = projects.find(p => p.id === projectId);

  const [open, setOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [filterPriority, setFilterPriority] = useState<'all' | TaskPriority>('all');
  const [sortBy, setSortBy] = useState<'due' | 'priority' | 'title'>('due');
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);
  const [submittingTask, setSubmittingTask] = useState(false);

  const [taskForm, setTaskForm] = useState<TaskFormState>({
    title: '',
    description: '',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '17:00',
    assignedUserIds: []
  });

  useEffect(() => {
    if (projectId) {
      if (projects.length === 0) dispatch(fetchProjects());
      dispatch(fetchTasks(projectId));
    }
  }, [projectId, dispatch, projects.length]);

  useEffect(() => {
    let mounted = true;
    apiFetch('/api/users')
      .then((data) => {
        if (mounted) setUsers(data);
      })
      .catch(() => {
        // ignore; auth dialog handles 401
      });
    return () => {
      mounted = false;
    };
  }, []);

  const filteredTasks = useMemo(() => {
    if (filterPriority === 'all') return tasks;
    return tasks.filter(t => t.priority === filterPriority);
  }, [tasks, filterPriority]);

  const sortedTasks = useMemo(() => {
    const list = [...filteredTasks];
    if (sortBy === 'due') {
      return list.sort((a, b) => {
        const aDate = a.dueDate || '9999-12-31';
        const bDate = b.dueDate || '9999-12-31';
        return aDate.localeCompare(bDate);
      });
    }
    if (sortBy === 'priority') {
      const rank: Record<TaskPriority, number> = {
        [TaskPriority.HIGH]: 3,
        [TaskPriority.MEDIUM]: 2,
        [TaskPriority.LOW]: 1
      };
      return list.sort((a, b) => (rank[b.priority] || 0) - (rank[a.priority] || 0));
    }
    return list.sort((a, b) => a.title.localeCompare(b.title));
  }, [filteredTasks, sortBy]);

  if (!projectId) {
    return (
      <div className="text-center py-10">
        <CircularProgress />
      </div>
    );
  }

  if (!project && loading) {
    return (
      <div className="text-center py-10">
        <CircularProgress />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-10">
        <Typography variant="h5">Project not found</Typography>
        <Button onClick={() => router.push('/')}>Back to Dashboard</Button>
      </div>
    );
  }

  const handleOpen = (task?: Task, presetStatus?: TaskStatus) => {
    if (task) {
      setEditingTask(task);
      setTaskForm({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        dueTime: task.dueTime || '17:00',
        assignedUserIds: task.assignedUserIds || []
      });
    } else {
      setEditingTask(null);
      setTaskForm({
        title: '',
        description: '',
        status: presetStatus || TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        dueDate: new Date().toISOString().split('T')[0],
        dueTime: '17:00',
        assignedUserIds: []
      });
    }
    setOpen(true);
  };

  const handleSave = async () => {
    setSubmittingTask(true);
    if (editingTask) {
      await dispatch(updateTask({ id: editingTask.id, updates: taskForm }));
    } else {
      await dispatch(createTask({ ...taskForm, projectId: project.id }));
    }
    setOpen(false);
    setSubmittingTask(false);
  };

  const handleDropTask = async (taskId: string, status: TaskStatus) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.status === status) return;
    setUpdatingTaskId(taskId);
    await dispatch(updateTask({ id: taskId, updates: { status, title: task.title, description: task.description, priority: task.priority, dueDate: task.dueDate, dueTime: task.dueTime || '', assignedUserIds: task.assignedUserIds || [] } }));
    setUpdatingTaskId(null);
  };

  const handleStatusChange = async (task: Task, status: TaskStatus) => {
    if (status === task.status) return;
    setUpdatingTaskId(task.id);
    await dispatch(updateTask({
      id: task.id,
      updates: {
        title: task.title,
        description: task.description,
        status,
        priority: task.priority,
        dueDate: task.dueDate,
        dueTime: task.dueTime || '',
        assignedUserIds: task.assignedUserIds || []
      }
    }));
    setUpdatingTaskId(null);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFF', padding: '0.5rem' }}>
      <Breadcrumbs sx={{ mb: 1, color: '#64748B' }}>
        <Link
          underline="hover"
          color="inherit"
          onClick={() => router.push('/project')}
          sx={{ cursor: 'pointer', fontWeight: 600 }}
        >
          Projects
        </Link>
        <Typography color="text.primary" sx={{ fontWeight: 700 }}>{project.name}</Typography>
      </Breadcrumbs>

      <ProjectHeader
        name={project.name}
        description={project.description}
        onCreate={() => handleOpen()}
      />

      <BoardToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        filterPriority={filterPriority}
        onFilterPriorityChange={setFilterPriority}
        sortBy={sortBy}
        onSortByChange={setSortBy}
      />

      {viewMode === 'list' ? (
        <TaskListView tasks={sortedTasks} users={users} loading={loading} />
      ) : (
        <div className="w-full flex flex-wrap md:flex-nowrap gap-6 items-start justify-center md:justify-start pb-1 overflow-visible md:overflow-x-auto">
          <TaskColumn status={TaskStatus.TODO} title="To Do" tasks={sortedTasks} users={users} onEdit={handleOpen} onDelete={(id) => dispatch(removeTask(id))} onDropTask={handleDropTask} onCreate={(status) => handleOpen(undefined, status)} onStatusChange={handleStatusChange} updatingTaskId={updatingTaskId} loading={loading} />
          <TaskColumn status={TaskStatus.IN_PROGRESS} title="In Progress" tasks={sortedTasks} users={users} onEdit={handleOpen} onDelete={(id) => dispatch(removeTask(id))} onDropTask={handleDropTask} onCreate={(status) => handleOpen(undefined, status)} onStatusChange={handleStatusChange} updatingTaskId={updatingTaskId} loading={loading} />
          <TaskColumn status={TaskStatus.REVIEW} title="In Review" tasks={sortedTasks} users={users} onEdit={handleOpen} onDelete={(id) => dispatch(removeTask(id))} onDropTask={handleDropTask} onCreate={(status) => handleOpen(undefined, status)} onStatusChange={handleStatusChange} updatingTaskId={updatingTaskId} loading={loading} />
          <TaskColumn status={TaskStatus.DONE} title="Completed" tasks={sortedTasks} users={users} onEdit={handleOpen} onDelete={(id) => dispatch(removeTask(id))} onDropTask={handleDropTask} onCreate={(status) => handleOpen(undefined, status)} onStatusChange={handleStatusChange} updatingTaskId={updatingTaskId} loading={loading} />
        </div>
      )}

      <TaskDialog
        open={open}
        editingTask={editingTask}
        taskForm={taskForm}
        users={users}
        submitting={submittingTask}
        onClose={() => setOpen(false)}
        onSave={handleSave}
        onChange={setTaskForm}
      />
    </div>
  );
};

export default ProjectView;
