import React from 'react';
import { Chip, Typography, Avatar, LinearProgress, Tooltip, Skeleton } from '@mui/material';
import { Task } from '../../types';
import { UserSummary } from './types';

type Props = {
  tasks: Task[];
  users: UserSummary[];
  loading?: boolean;
};

const TaskListView: React.FC<Props> = ({ tasks, users, loading = false }) => {
  const statusLabel = (status: string) => {
    if (status === 'review') return 'In Review';
    return String(status).toLowerCase().replace(/_/g, ' ');
  };

  const statusColors = (status: string) => {
    const value = String(status).toLowerCase();
    if (value === 'done') return { bg: '#DCFCE7', text: '#16A34A' };
    if (value === 'in-progress') return { bg: '#DBEAFE', text: '#2563EB' };
    if (value === 'review') return { bg: '#FEF3C7', text: '#F59E0B' };
    return { bg: '#E2E8F0', text: '#475569' };
  };

  const priorityColors = (priority: string) => {
    const value = String(priority).toLowerCase();
    if (value === 'high') return { bg: '#FEE2E2', text: '#EF4444' };
    if (value === 'medium') return { bg: '#FFEDD5', text: '#F59E0B' };
    return { bg: '#DCFCE7', text: '#10B981' };
  };

  const completedCount = tasks.filter(t => String(t.status) === 'done').length;
  const progressPercent = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="border rounded-lg overflow-hidden bg-white" style={{ borderColor: '#E6EAF2' }}>
        <div className="hidden md:flex items-center gap-2 px-4 py-3 text-xs font-extrabold uppercase tracking-widest" style={{ backgroundColor: '#F8FAFF', color: '#64748B', borderBottom: '1px solid #E6EAF2' }}>
        <div className="flex-[2]">Task Name</div>
        <div className="flex-1">Status</div>
        <div className="flex-1">Priority</div>
        <div className="flex-1 text-center">Assignee</div>
        <div className="flex-1 text-right">Due Date</div>
        </div>

      {loading ? (
        [...Array(4)].map((_, idx) => (
          <div key={`sk-${idx}`} className="px-4 py-4 border-b" style={{ borderColor: '#F1F5F9' }}>
            <div className="block md:hidden mb-3">
              <Skeleton variant="text" width="55%" height={22} />
              <Skeleton variant="text" width="80%" height={16} />
              <div className="mt-3 grid grid-cols-2 gap-3">
                <Skeleton variant="rounded" width="70%" height={22} />
                <Skeleton variant="rounded" width="70%" height={22} />
                <Skeleton variant="rounded" width="60%" height={22} />
                <Skeleton variant="text" width="60%" height={18} />
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <div className="flex-[2] min-w-0">
                <Skeleton variant="text" width="60%" height={22} />
                <Skeleton variant="text" width="80%" height={16} />
              </div>
              <div className="flex-1">
                <Skeleton variant="rounded" width="70%" height={22} />
              </div>
              <div className="flex-1">
                <Skeleton variant="rounded" width="70%" height={22} />
              </div>
              <div className="flex-1 flex items-center justify-center">
                <Skeleton variant="circular" width={24} height={24} />
                <Skeleton variant="circular" width={24} height={24} sx={{ ml: 1 }} />
              </div>
              <div className="flex-1 text-right">
                <Skeleton variant="text" width="60%" height={18} />
              </div>
            </div>
          </div>
        ))
      ) : tasks.length === 0 ? (
        <div className="px-4 py-6">
          <Typography variant="body2" color="text.secondary">No tasks match the current filter.</Typography>
        </div>
      ) : (
        tasks.map((task) => (
          <div key={task.id} className="px-4 py-4 border-b" style={{ borderColor: '#F1F5F9' }}>
            <div className="block md:hidden mb-3">
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#0F172A' }}>{task.title}</Typography>
              <Typography variant="caption" color="text.secondary" className="line-clamp-1">{task.description}</Typography>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748B', letterSpacing: '0.05em' }}>Status</Typography>
                  <div className="mt-1">
                    <Chip
                      label={statusLabel(String(task.status))}
                      size="small"
                      sx={{
                        bgcolor: statusColors(String(task.status)).bg,
                        color: statusColors(String(task.status)).text,
                        fontWeight: 700,
                        textTransform: 'capitalize'
                      }}
                    />
                  </div>
                </div>
                <div>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748B', letterSpacing: '0.05em' }}>Priority</Typography>
                  <div className="mt-1">
                    <Chip
                      label={task.priority}
                      size="small"
                      sx={{
                        bgcolor: priorityColors(String(task.priority)).bg,
                        color: priorityColors(String(task.priority)).text,
                        fontWeight: 700,
                        textTransform: 'capitalize'
                      }}
                    />
                  </div>
                </div>
                <div className="min-w-0">
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748B', letterSpacing: '0.05em' }}>Assignee</Typography>
                  <div className="mt-1 flex items-center flex-wrap gap-1 min-h-[24px]">
                    {(task.assignedUserIds || []).slice(0, 3).map((id) => {
                      const name = users.find(u => u.id === id)?.name || 'U';
                      return (
                        <Tooltip key={id} title={name} arrow>
                          <Avatar sx={{ width: 24, height: 24, fontSize: 11, bgcolor: '#E0F2FE', color: '#0F172A', border: '2px solid #fff' }}>
                            {name.charAt(0)}
                          </Avatar>
                        </Tooltip>
                      );
                    })}
                    {(task.assignedUserIds || []).length > 3 && (
                      <Tooltip title={`${(task.assignedUserIds || []).length - 3} more`} arrow>
                        <Avatar sx={{ width: 24, height: 24, fontSize: 11, bgcolor: '#E2E8F0', color: '#0F172A', border: '2px solid #fff' }}>
                          +{(task.assignedUserIds || []).length - 3}
                        </Avatar>
                      </Tooltip>
                    )}
                  </div>
                </div>
                <div>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748B', letterSpacing: '0.05em' }}>Due Date</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {task.dueDate || '—'}
                  </Typography>
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <div className="flex-[2] min-w-0">
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0F172A' }}>{task.title}</Typography>
                <Typography variant="caption" color="text.secondary" className="line-clamp-1">{task.description}</Typography>
              </div>
              <div className="flex-1">
                <Chip
                  label={statusLabel(String(task.status))}
                  size="small"
                  sx={{
                    bgcolor: statusColors(String(task.status)).bg,
                    color: statusColors(String(task.status)).text,
                    fontWeight: 700,
                    textTransform: 'capitalize'
                  }}
                />
              </div>
              <div className="flex-1">
                <Chip
                  label={task.priority}
                  size="small"
                  sx={{
                    bgcolor: priorityColors(String(task.priority)).bg,
                    color: priorityColors(String(task.priority)).text,
                    fontWeight: 700,
                    textTransform: 'capitalize'
                  }}
                />
              </div>
              <div className="flex-1 flex items-center justify-center">
                {(task.assignedUserIds || []).slice(0, 3).map((id) => {
                  const name = users.find(u => u.id === id)?.name || 'U';
                  return (
                    <Tooltip key={id} title={name} arrow>
                      <Avatar sx={{ width: 24, height: 24, fontSize: 11, bgcolor: '#E0F2FE', color: '#0F172A', border: '2px solid #fff', marginLeft: -4 }}>
                        {name.charAt(0)}
                      </Avatar>
                    </Tooltip>
                  );
                })}
                {(task.assignedUserIds || []).length > 3 && (
                  <Tooltip title={`${(task.assignedUserIds || []).length - 3} more`} arrow>
                    <Avatar sx={{ width: 24, height: 24, fontSize: 11, bgcolor: '#E2E8F0', color: '#0F172A', border: '2px solid #fff', marginLeft: -4 }}>
                      +{(task.assignedUserIds || []).length - 3}
                    </Avatar>
                  </Tooltip>
                )}
              </div>
              <Typography variant="body2" color="text.secondary" className="flex-1 text-right">
                {task.dueDate || '—'}
              </Typography>
            </div>
          </div>
        ))
      )}

      {!loading && tasks.length > 0 && (
        <div className="px-4 py-4 flex items-center justify-between gap-2">
          <div>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#0F172A' }}>Overall Progress</Typography>
            <Typography variant="caption" color="text.secondary">
              {completedCount} of {tasks.length} tasks completed
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progressPercent}
              sx={{
                mt: 1,
                height: 6,
                borderRadius: 999,
                bgcolor: '#E2E8F0',
                '& .MuiLinearProgress-bar': { bgcolor: '#2563EB' }
              }}
            />
          </div>
          <div
            className="flex items-center justify-center text-xs font-bold"
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: `conic-gradient(#2563EB ${progressPercent}%, #E2E8F0 ${progressPercent}% 100%)`
            }}
          >
            <div className="flex items-center justify-center bg-white rounded-full" style={{ width: 44, height: 44 }}>
              {progressPercent}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskListView;
