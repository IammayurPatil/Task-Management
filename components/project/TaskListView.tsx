import React from 'react';
import { Box, Chip, Stack, Typography, Avatar, LinearProgress, Tooltip } from '@mui/material';
import { Task } from '../../types';
import { UserSummary } from './types';

type Props = {
  tasks: Task[];
  users: UserSummary[];
};

const TaskListView: React.FC<Props> = ({ tasks, users }) => {
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
    <Box sx={{ border: '1px solid #E6EAF2', borderRadius: 2, overflow: 'hidden', bgcolor: '#FFFFFF' }}>
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          gap: 2,
          px: 2,
          py: 1.2,
          bgcolor: '#F8FAFF',
          borderBottom: '1px solid #E6EAF2',
          color: '#64748B',
          fontSize: '0.72rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.06em'
        }}
      >
        <Box sx={{ flex: 2 }}>Task Name</Box>
        <Box sx={{ flex: 1 }}>Status</Box>
        <Box sx={{ flex: 1 }}>Priority</Box>
        <Box sx={{ flex: 1 }}>Assignee</Box>
        <Box sx={{ flex: 1, textAlign: 'right' }}>Due Date</Box>
      </Box>
      {tasks.length === 0 ? (
        <Box sx={{ px: 2, py: 3 }}>
          <Typography variant="body2" color="text.secondary">No tasks match the current filter.</Typography>
        </Box>
      ) : (
        tasks.map((task) => (
          <Box
            key={task.id}
            sx={{
              display: { xs: 'block', md: 'flex' },
              alignItems: { md: 'center' },
              gap: 2,
              px: 2,
              py: 1.4,
              borderBottom: '1px solid #F1F5F9',
              '&:hover': { bgcolor: '#F8FAFF' }
            }}
          >
            <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 1.2 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#0F172A' }}>{task.title}</Typography>
              <Typography variant="caption" color="text.secondary" className="line-clamp-1">{task.description}</Typography>
            </Box>
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
              <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="center" sx={{ rowGap: 1 }}>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748B', letterSpacing: '0.05em' }}>Status</Typography>
                  <Box sx={{ mt: 0.5 }}>
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
                  </Box>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748B', letterSpacing: '0.05em' }}>Priority</Typography>
                  <Box sx={{ mt: 0.5 }}>
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
                  </Box>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748B', letterSpacing: '0.05em' }}>Assignee</Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Stack direction="row" spacing={-0.5}>
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
                    </Stack>
                  </Box>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748B', letterSpacing: '0.05em' }}>Due Date</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {task.dueDate || '—'}
                  </Typography>
                </Box>
              </Stack>
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, width: '100%' }}>
              <Box sx={{ flex: 2, minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0F172A' }}>{task.title}</Typography>
                <Typography variant="caption" color="text.secondary" className="line-clamp-1">{task.description}</Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
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
              </Box>
              <Box sx={{ flex: 1 }}>
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
              </Box>
              <Box sx={{ flex: 1 }}>
                <Stack direction="row" spacing={-0.5}>
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
                </Stack>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ flex: 1, textAlign: 'right' }}>
                {task.dueDate || '—'}
              </Typography>
            </Box>
          </Box>
        ))
      )}
      {tasks.length > 0 && (
        <Box sx={{ px: 2, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Box>
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
          </Box>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: `conic-gradient(#2563EB ${progressPercent}%, #E2E8F0 ${progressPercent}% 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0F172A',
              fontWeight: 700,
              fontSize: 12
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                bgcolor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {progressPercent}%
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default TaskListView;
