import React from 'react';
import { Box, Card, CardContent, Chip, Divider, IconButton, Stack, Typography, Avatar, Menu, MenuItem, Tooltip, CircularProgress } from '@mui/material';
import { CheckCircle2, Edit2, Trash2 } from 'lucide-react';
import { Task, TaskPriority, TaskStatus } from '../../types';
import { UserSummary } from './types';

type Props = {
  task: Task;
  users: UserSummary[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (task: Task, status: TaskStatus) => void;
  isUpdating?: boolean;
  onDragStart?: (taskId: string) => void;
};

const TaskCard: React.FC<Props> = ({ task, users, onEdit, onDelete, onStatusChange, isUpdating = false, onDragStart }) => {
  const [statusAnchorEl, setStatusAnchorEl] = React.useState<null | HTMLElement>(null);
  const statusMenuOpen = Boolean(statusAnchorEl);

  const priorityColor = task.priority === TaskPriority.HIGH
    ? '#EF4444'
    : task.priority === TaskPriority.MEDIUM
    ? '#F59E0B'
    : '#10B981';

  const priorityLabel = task.priority === TaskPriority.HIGH
    ? 'High Priority'
    : task.priority === TaskPriority.MEDIUM
    ? 'Medium'
    : 'Low';

  return (
    <Tooltip title="Drag me" placement="top" disableHoverListener={!onDragStart} arrow>
      <Card
        draggable={!!onDragStart}
        onDragStart={(e) => {
          if (!onDragStart) return;
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', task.id);
          onDragStart(task.id);
        }}
        sx={{
          borderRadius: 2,
          border: '1px solid #EDF2F7',
          boxShadow: '0 8px 18px rgba(15, 23, 42, 0.06)',
          width: '100%',
          borderLeft: `4px solid ${priorityColor}`,
          transition: 'box-shadow 0.15s ease, transform 0.15s ease',
          '&:hover': { boxShadow: '0 16px 28px rgba(15, 23, 42, 0.10)', transform: 'translateY(-2px)' }
        }}
      >
        <CardContent sx={{ p: 1.5, position: 'relative' }}>
        {isUpdating && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              bgcolor: 'rgba(248, 250, 255, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
              borderRadius: 2
            }}
          >
            <CircularProgress size={22} />
          </Box>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              label={priorityLabel.toUpperCase()}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.62rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                bgcolor: `${priorityColor}1A`,
                color: priorityColor
              }}
            />
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ zIndex: 2 }}>
            <IconButton
              size="small"
              onClick={() => onEdit(task)}
              sx={{ color: '#94A3B8', bgcolor: '#F8FAFF', border: '1px solid #E6EAF2' }}
              disabled={isUpdating}
            >
              <Edit2 size={14} />
            </IconButton>
            <IconButton
              size="small"
              onClick={(e) => setStatusAnchorEl(e.currentTarget)}
              sx={{ color: '#2563EB', bgcolor: '#EEF2FF', border: '1px solid #DBEAFE' }}
              disabled={isUpdating}
            >
              <CheckCircle2 size={14} />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={() => onDelete(task.id)}
              sx={{ bgcolor: '#FEF2F2', border: '1px solid #FEE2E2' }}
              disabled={isUpdating}
            >
              <Trash2 size={14} />
            </IconButton>
          </Stack>
        </Box>
        <Menu
          anchorEl={statusAnchorEl}
          open={statusMenuOpen}
          onClose={() => setStatusAnchorEl(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem
            disabled={task.status === TaskStatus.TODO}
            onClick={() => { onStatusChange(task, TaskStatus.TODO); setStatusAnchorEl(null); }}
          >
            To Do
          </MenuItem>
          <MenuItem
            disabled={task.status === TaskStatus.IN_PROGRESS}
            onClick={() => { onStatusChange(task, TaskStatus.IN_PROGRESS); setStatusAnchorEl(null); }}
          >
            In Progress
          </MenuItem>
          <MenuItem
            disabled={task.status === TaskStatus.REVIEW}
            onClick={() => { onStatusChange(task, TaskStatus.REVIEW); setStatusAnchorEl(null); }}
          >
            In Review
          </MenuItem>
          <MenuItem
            disabled={task.status === TaskStatus.DONE}
            onClick={() => { onStatusChange(task, TaskStatus.DONE); setStatusAnchorEl(null); }}
          >
            Completed
          </MenuItem>
        </Menu>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.75, color: '#0F172A' }}>
          {task.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" className="line-clamp-2" sx={{ mb: 1.2 }}>
          {task.description}
        </Typography>
        <Divider sx={{ my: 1.2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em' }}>
              Assignee
            </Typography>
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
                  <Avatar sx={{ width: 24, height: 24, fontSize: 11, bgcolor: '#E0F2FE', color: '#0F172A', border: '2px solid #fff' }}>
                    +{(task.assignedUserIds || []).length - 3}
                  </Avatar>
                </Tooltip>
              )}
            </Stack>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em' }}>
              Deadline
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#0F172A' }}>
              {task.dueDate}{task.dueTime ? ` | ${task.dueTime}` : ''}
            </Typography>
          </Box>
        </Box>
        </CardContent>
      </Card>
    </Tooltip>
  );
};

export default TaskCard;
