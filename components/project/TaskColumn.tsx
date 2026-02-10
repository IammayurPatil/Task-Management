import React, { useState } from 'react';
import { Card, CardContent, IconButton, Skeleton, Typography } from '@mui/material';
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
  loading?: boolean;
};

const TaskColumn: React.FC<Props> = ({ status, title, tasks, users, onEdit, onDelete, onDropTask, onCreate, onStatusChange, updatingTaskId, loading = false }) => {
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
    <div className="flex flex-col w-full md:min-w-[280px] md:flex-1 max-w-[380px] md:max-w-none mx-auto md:mx-0">
      <div
        className="w-full rounded-lg transition-shadow"
        style={{ boxShadow: isDragOver ? '0 0 0 2px rgba(59, 130, 246, 0.25)' : 'none' }}
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
        <div className="flex items-center justify-between px-2 py-2">
          <div className="flex items-center gap-2">
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F172A' }}>{title}</Typography>
            <div style={{ padding: '0.15rem 0.6rem', borderRadius: 8, backgroundColor: badgeColor.bg, fontSize: '0.7rem', fontWeight: 700, color: badgeColor.text }}>
              {columnTasks.length}
            </div>
          </div>
          <IconButton
            size="small"
            onClick={() => onCreate(status)}
            sx={{ color: '#85909f', bgcolor: '#edeff5', border: '1px solid #E6EAF2' }}
          >
            <Plus size={16} />
          </IconButton>
        </div>
        <div className="flex flex-col gap-4 min-h-[200px] w-full mt-2">
          {loading ? (
            [...Array(3)].map((_, idx) => (
              <Card key={`sk-${idx}`} sx={{ borderRadius: 2, border: '1px solid #E6EAF2', boxShadow: '0 8px 18px rgba(15, 23, 42, 0.04)' }}>
                <CardContent sx={{ p: 1.5 }}>
                  <Skeleton variant="rounded" width={90} height={20} />
                  <Skeleton variant="text" width="80%" height={24} sx={{ mt: 1 }} />
                  <Skeleton variant="text" width="90%" height={18} />
                  <Skeleton variant="rounded" width="60%" height={16} sx={{ mt: 1 }} />
                </CardContent>
              </Card>
            ))
          ) : columnTasks.length === 0 ? (
            <div className="rounded-lg border border-dashed text-center text-slate-400 flex flex-col items-center justify-center gap-2 min-h-[180px]" style={{ backgroundColor: '#edeff5', borderColor: '#E2E8F0' }}>
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
            </div>
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
        </div>
      </div>
    </div>
  );
};

export default TaskColumn;
