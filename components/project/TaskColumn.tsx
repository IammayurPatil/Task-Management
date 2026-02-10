import React, { useState } from 'react';
import { Box, Grid, IconButton, Typography } from '@mui/material';
import { CheckCircle2, Plus } from 'lucide-react';
import { Task, TaskStatus } from '../../types';
import { UserSummary } from './types';
import TaskCard from './TaskCard';

type Props = {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  users: UserSummary[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onDropTask: (taskId: string, status: TaskStatus) => void;
  onCreate: (status: TaskStatus) => void;
  onStatusChange: (task: Task, status: TaskStatus) => void;
  updatingTaskId?: string | null;
};

const TaskColumn: React.FC<Props> = ({ status, title, tasks, users, onEdit, onDelete, onDropTask, onCreate, onStatusChange, updatingTaskId }) => {
  const columnTasks = tasks.filter(t => t.status === status);
  const [isDragOver, setIsDragOver] = useState(false);
  const badgeColor = status === TaskStatus.DONE
    ? { bg: '#DCFCE7', text: '#16A34A' }
    : status === TaskStatus.IN_PROGRESS
    ? { bg: '#DBEAFE', text: '#2563EB' }
    : status === TaskStatus.REVIEW
    ? { bg: '#FEF3C7', text: '#F59E0B' }
    : { bg: '#E2E8F0', text: '#475569' };

  return (
    <Grid
      xs={12}
      md={3}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minWidth: { xs: '100%', md: 280 },
        maxWidth: { xs: 380, md: 'none' },
        mx: { xs: 'auto', md: 0 }
      }}
    >
      <Box
        sx={{
          width: '100%',
          borderRadius: 2,
          transition: 'background-color 0.15s ease, box-shadow 0.15s ease',
          boxShadow: isDragOver ? '0 0 0 2px rgba(59, 130, 246, 0.25)' : 'none'
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          const taskId = e.dataTransfer.getData('text/plain');
          if (taskId) onDropTask(taskId, status);
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 0.5, py: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F172A' }}>{title}</Typography>
            <Box
              sx={{
                px: 0.9,
                py: 0.15,
                borderRadius: 2,
                bgcolor: badgeColor.bg,
                fontSize: '0.7rem',
                fontWeight: 700,
                color: badgeColor.text
              }}
            >
              {columnTasks.length}
            </Box>
          </Box>
          <IconButton
            size="small"
            onClick={() => onCreate(status)}
            sx={{ color: '#85909f', bgcolor: '#edeff5', border: '1px solid #E6EAF2' }}
          >
            <Plus size={16} />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, minHeight: 200, width: '100%', mt: 1 }}>
          {columnTasks.length === 0 ? (
            <Box
              sx={{
                borderRadius: 2,
                border: '1px dashed #E2E8F0',
                bgcolor: '#edeff5',
                minHeight: 180,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                color: '#94A3B8',
                flexDirection: 'column',
                gap: 1
              }}
            >
              <CheckCircle2 size={32} color="#94A3B8" />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {status === TaskStatus.DONE
                  ? 'No completed tasks'
                  : status === TaskStatus.REVIEW
                  ? 'No tasks for review'
                  : status === TaskStatus.IN_PROGRESS
                  ? 'No tasks in progress'
                  : 'No tasks to do'}
              </Typography>
            </Box>
          ) : (
            columnTasks.map(task => (
              <TaskCard
                key={task.id}
              task={task}
              users={users}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
              isUpdating={updatingTaskId === task.id}
              onDragStart={() => {}}
            />
            ))
          )}
        </Box>
      </Box>
    </Grid>
  );
};

export default TaskColumn;
