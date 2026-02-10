import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField
} from '@mui/material';
import { TaskPriority, TaskStatus, Task } from '../../types';
import { TaskFormState, UserSummary } from './types';
import GradientButton from '../ui/GradientButton';

type Props = {
  open: boolean;
  editingTask: Task | null;
  taskForm: TaskFormState;
  users: UserSummary[];
  submitting: boolean;
  onClose: () => void;
  onSave: () => void;
  onChange: (value: TaskFormState) => void;
};

const TaskDialog: React.FC<Props> = ({
  open,
  editingTask,
  taskForm,
  users,
  submitting,
  onClose,
  onSave,
  onChange
}) => {
  const [touched, setTouched] = useState({
    title: false,
    description: false,
    priority: false,
    status: false,
    assignedUsers: false,
    dueDate: false,
    dueTime: false
  });

  useEffect(() => {
    if (open) {
      setTouched({
        title: false,
        description: false,
        priority: false,
        status: false,
        assignedUsers: false,
        dueDate: false,
        dueTime: false
      });
    }
  }, [open]);

  const titleMissing = taskForm.title.trim().length === 0;
  const descriptionMissing = taskForm.description.trim().length === 0;
  const priorityMissing = !taskForm.priority;
  const statusMissing = !taskForm.status;
  const assignedUsersMissing = taskForm.assignedUserIds.length === 0;
  const dueDateMissing = !taskForm.dueDate;
  const dueTimeMissing = !taskForm.dueTime;

  const titleError = touched.title && titleMissing;
  const descriptionError = touched.description && descriptionMissing;
  const priorityError = touched.priority && priorityMissing;
  const statusError = touched.status && statusMissing;
  const assignedUsersError = touched.assignedUsers && assignedUsersMissing;
  const dueDateError = touched.dueDate && dueDateMissing;
  const dueTimeError = touched.dueTime && dueTimeMissing;

  const formValid = !titleMissing
    && !descriptionMissing
    && !priorityMissing
    && !statusMissing
    && !assignedUsersMissing
    && !dueDateMissing
    && !dueTimeMissing;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2, border: '1px solid #E6EAF2', boxShadow: '0 20px 40px rgba(15, 23, 42, 0.12)' } }}
    >
      <DialogTitle sx={{ fontWeight: 700, color: '#0F172A' }}>{editingTask ? 'Edit Task' : 'New Task'}</DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <div className="pt-1 flex flex-col gap-3">
          <div className="flex gap-2">
            <TextField
              size="small"
              label="Title"
              fullWidth
              required
              value={taskForm.title}
              onChange={(e) => onChange({ ...taskForm, title: e.target.value })}
              onBlur={() => setTouched(prev => ({ ...prev, title: true }))}
              error={titleError}
              helperText={titleError ? 'Title is required.' : ' '}
            />
          </div>
          <TextField
            size="small"
            label="Description"
            fullWidth
            multiline
            rows={4}
            required
            value={taskForm.description}
            onChange={(e) => onChange({ ...taskForm, description: e.target.value })}
            onBlur={() => setTouched(prev => ({ ...prev, description: true }))}
            error={descriptionError}
            helperText={descriptionError ? 'Description is required.' : ' '}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <TextField
                size="small"
                select
                label="Priority"
                fullWidth
                required
                value={taskForm.priority}
                onChange={(e) => {
                  setTouched(prev => ({ ...prev, priority: true }));
                  onChange({ ...taskForm, priority: e.target.value as TaskPriority });
                }}
                error={priorityError}
                helperText={priorityError ? 'Priority is required.' : ' '}
              >
                <MenuItem value={TaskPriority.LOW}>Low</MenuItem>
                <MenuItem value={TaskPriority.MEDIUM}>Medium</MenuItem>
                <MenuItem value={TaskPriority.HIGH}>High</MenuItem>
              </TextField>
            </div>
            <div>
              <TextField
                size="small"
                select
                label="Status"
                fullWidth
                required
                value={taskForm.status}
                onChange={(e) => {
                  setTouched(prev => ({ ...prev, status: true }));
                  onChange({ ...taskForm, status: e.target.value as TaskStatus });
                }}
                error={statusError}
                helperText={statusError ? 'Status is required.' : ' '}
              >
                <MenuItem value={TaskStatus.TODO}>To Do</MenuItem>
                <MenuItem value={TaskStatus.IN_PROGRESS}>In Progress</MenuItem>
                <MenuItem value={TaskStatus.REVIEW}>In Review</MenuItem>
                <MenuItem value={TaskStatus.DONE}>Done</MenuItem>
              </TextField>
            </div>
            <div className="sm:col-span-2">
              <FormControl size="small" fullWidth error={assignedUsersError}>
                <InputLabel id="assign-users-label" required shrink>Assign Users</InputLabel>
                <Select
                  labelId="assign-users-label"
                  label="Assign Users"
                  multiple
                  displayEmpty
                  value={taskForm.assignedUserIds}
                  onChange={(e) => {
                    setTouched(prev => ({ ...prev, assignedUsers: true }));
                    onChange({ ...taskForm, assignedUserIds: e.target.value as string[] });
                  }}
                  renderValue={(selected) => {
                    if (selected.length === 0) return 'Select users';
                    return selected
                      .map((id) => users.find(u => u.id === id)?.name || 'Unknown')
                      .join(', ');
                  }}
                >
                  {users.map(u => {
                    const checked = taskForm.assignedUserIds.includes(u.id);
                    return (
                      <MenuItem key={u.id} value={u.id}>
                        <Checkbox checked={checked} size="small" />
                        <ListItemText primary={u.name} />
                      </MenuItem>
                    );
                  })}
                </Select>
                {assignedUsersError ? (
                  <FormHelperText>At least one user is required.</FormHelperText>
                ) : (
                  <FormHelperText> </FormHelperText>
                )}
              </FormControl>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <TextField
                size="small"
                type="date"
                label="Due Date"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                value={taskForm.dueDate}
                onChange={(e) => {
                  setTouched(prev => ({ ...prev, dueDate: true }));
                  onChange({ ...taskForm, dueDate: e.target.value });
                }}
                error={dueDateError}
                helperText={dueDateError ? 'Due date is required.' : ' '}
              />
            </div>
            <div>
              <TextField
                size="small"
                type="time"
                label="Due Time"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                value={taskForm.dueTime}
                onChange={(e) => {
                  setTouched(prev => ({ ...prev, dueTime: true }));
                  onChange({ ...taskForm, dueTime: e.target.value });
                }}
                error={dueTimeError}
                helperText={dueTimeError ? 'Due time is required.' : ' '}
              />
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions sx={{ p: 2.5, borderTop: '1px solid #E6EAF2' }}>
        <Button onClick={onClose} disabled={submitting}>Cancel</Button>
        <GradientButton onClick={onSave} disabled={!formValid || submitting}>
          {submitting ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : 'Save'}
        </GradientButton>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDialog;
