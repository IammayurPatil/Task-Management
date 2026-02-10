import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, CircularProgress } from '@mui/material';
import GradientButton from '../ui/GradientButton';

type Props = {
  open: boolean;
  name: string;
  desc: string;
  endDate: string;
  category: string;
  mode: 'create' | 'edit';
  canCreate: boolean;
  submitting: boolean;
  onClose: () => void;
  onCreate: () => void;
  onNameChange: (value: string) => void;
  onDescChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
};

const ProjectDialog: React.FC<Props> = ({
  open,
  name,
  desc,
  endDate,
  category,
  mode,
  canCreate,
  submitting,
  onClose,
  onCreate,
  onNameChange,
  onDescChange,
  onEndDateChange,
  onCategoryChange
}) => {
  const [touched, setTouched] = useState({
    name: false,
    desc: false,
    category: false,
    endDate: false
  });

  useEffect(() => {
    if (open) {
      setTouched({
        name: false,
        desc: false,
        category: false,
        endDate: false
      });
    }
  }, [open]);

  const nameMissing = name.trim().length === 0;
  const descMissing = desc.trim().length === 0;
  const categoryMissing = category.trim().length === 0;
  const endDateMissing = !endDate;

  const nameError = touched.name && nameMissing;
  const descError = touched.desc && descMissing;
  const categoryError = touched.category && categoryMissing;
  const endDateError = touched.endDate && endDateMissing;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2, border: '1px solid #E6EAF2', boxShadow: '0 20px 40px rgba(15, 23, 42, 0.12)' } }}
    >
      <DialogTitle sx={{ fontWeight: 700, color: '#0F172A' }}>
        {mode === 'edit' ? 'Edit Project' : 'Create New Project'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="Project Name"
            fullWidth
            variant="outlined"
            size="small"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
            required
            error={nameError}
            helperText={nameError ? 'Project name is required.' : ' '}
            autoFocus
          />
          <TextField
            label="Project Category"
            fullWidth
            variant="outlined"
            size="small"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            onBlur={() => setTouched(prev => ({ ...prev, category: true }))}
            required
            error={categoryError}
            helperText={categoryError ? 'Project category is required.' : ' '}
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            size="small"
            value={desc}
            onChange={(e) => onDescChange(e.target.value)}
            onBlur={() => setTouched(prev => ({ ...prev, desc: true }))}
            required
            error={descError}
            helperText={descError ? 'Project description is required.' : ' '}
          />
          <TextField
            label="End Date / Deadline"
            fullWidth
            type="date"
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            size="small"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            onBlur={() => setTouched(prev => ({ ...prev, endDate: true }))}
            required
            error={endDateError}
            helperText={endDateError ? 'End date is required.' : ' '}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, borderTop: '1px solid #E6EAF2' }}>
        <Button onClick={onClose} color="inherit" disabled={submitting}>Cancel</Button>
        <GradientButton onClick={onCreate} disabled={!canCreate || submitting}>
          {submitting ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : (mode === 'edit' ? 'Save Changes' : 'Create Project')}
        </GradientButton>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectDialog;
