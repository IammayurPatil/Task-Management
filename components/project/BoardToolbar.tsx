import React, { useState } from 'react';
import { Box, Stack, Chip, Button, Menu, MenuItem } from '@mui/material';
import { Filter, ArrowUpDown, LayoutGrid, List } from 'lucide-react';
import { TaskPriority } from '../../types';

type ViewMode = 'board' | 'list' | 'calendar';
type SortMode = 'due' | 'priority' | 'title';

type Props = {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  filterPriority: 'all' | TaskPriority;
  onFilterPriorityChange: (value: 'all' | TaskPriority) => void;
  sortBy: SortMode;
  onSortByChange: (value: SortMode) => void;
};

const BoardToolbar: React.FC<Props> = ({
  viewMode,
  onViewModeChange,
  filterPriority,
  onFilterPriorityChange,
  sortBy,
  onSortByChange
}) => {
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 2 }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Chip
          icon={<LayoutGrid size={16} />}
          label="Board"
          onClick={() => onViewModeChange('board')}
          variant={viewMode === 'board' ? 'filled' : 'outlined'}
          sx={{
            bgcolor: viewMode === 'board' ? '#EEF2FF' : 'transparent',
            borderColor: '#E6EAF2',
            color: viewMode === 'board' ? '#2563EB' : '#64748B',
            fontWeight: 700,
            '& .MuiChip-icon': { color: viewMode === 'board' ? '#2563EB' : '#94A3B8' }
          }}
        />
        <Chip
          icon={<List size={16} />}
          label="List"
          onClick={() => onViewModeChange('list')}
          variant={viewMode === 'list' ? 'filled' : 'outlined'}
          sx={{
            bgcolor: viewMode === 'list' ? '#EEF2FF' : 'transparent',
            borderColor: '#E6EAF2',
            color: viewMode === 'list' ? '#2563EB' : '#64748B',
            fontWeight: 600,
            '& .MuiChip-icon': { color: viewMode === 'list' ? '#2563EB' : '#94A3B8' }
          }}
        />
      </Stack>
      <Stack direction="row" spacing={1}>
        <Button
          variant="outlined"
          startIcon={<Filter size={16} />}
          onClick={(e) => setFilterAnchorEl(e.currentTarget)}
          sx={{
            borderColor: '#E6EAF2',
            color: '#0F172A',
            bgcolor: '#FFFFFF',
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': { borderColor: '#CBD5F5', bgcolor: '#F8FAFF' }
          }}
        >
          Filter: {filterPriority === 'all' ? 'All' : filterPriority}
        </Button>
        <Button
          variant="outlined"
          startIcon={<ArrowUpDown size={16} />}
          onClick={(e) => setSortAnchorEl(e.currentTarget)}
          sx={{
            borderColor: '#E6EAF2',
            color: '#0F172A',
            bgcolor: '#FFFFFF',
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': { borderColor: '#CBD5F5', bgcolor: '#F8FAFF' }
          }}
        >
          Sort: {sortBy === 'due' ? 'Due date' : sortBy === 'priority' ? 'Priority' : 'Title'}
        </Button>
      </Stack>

      <Menu anchorEl={filterAnchorEl} open={Boolean(filterAnchorEl)} onClose={() => setFilterAnchorEl(null)}>
        <MenuItem onClick={() => { onFilterPriorityChange('all'); setFilterAnchorEl(null); }}>All priorities</MenuItem>
        <MenuItem onClick={() => { onFilterPriorityChange(TaskPriority.HIGH); setFilterAnchorEl(null); }}>High</MenuItem>
        <MenuItem onClick={() => { onFilterPriorityChange(TaskPriority.MEDIUM); setFilterAnchorEl(null); }}>Medium</MenuItem>
        <MenuItem onClick={() => { onFilterPriorityChange(TaskPriority.LOW); setFilterAnchorEl(null); }}>Low</MenuItem>
      </Menu>
      <Menu anchorEl={sortAnchorEl} open={Boolean(sortAnchorEl)} onClose={() => setSortAnchorEl(null)}>
        <MenuItem onClick={() => { onSortByChange('due'); setSortAnchorEl(null); }}>Due date</MenuItem>
        <MenuItem onClick={() => { onSortByChange('priority'); setSortAnchorEl(null); }}>Priority</MenuItem>
        <MenuItem onClick={() => { onSortByChange('title'); setSortAnchorEl(null); }}>Title</MenuItem>
      </Menu>
    </Box>
  );
};

export default BoardToolbar;
