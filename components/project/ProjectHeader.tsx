import React from 'react';
import { Box, Typography } from '@mui/material';
import { Plus } from 'lucide-react';
import GradientButton from '../ui/GradientButton';

type Props = {
  name: string;
  description?: string;
  onCreate: () => void;
};

const ProjectHeader: React.FC<Props> = ({ name, description, onCreate }) => {
  return (
    <Box sx={{ mb: 2.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, flexWrap: 'wrap' }}>
        {/* <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A' }}>Project Board</Typography>
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              mt: 0.4,
              letterSpacing: '0.12em',
              fontWeight: 700,
              color: '#94A3B8',
              textTransform: 'uppercase'
            }}
          >
            {name}
          </Typography>
        </Box> */}
        {/* <GradientButton startIcon={<Plus size={18} />} onClick={onCreate}>
          Create
        </GradientButton> */}
      </Box>
      {/* {description && (
        <Typography variant="body2" sx={{ color: '#64748B', mt: 1.2 }}>
          {description}
        </Typography>
      )} */}
    </Box>
  );
};

export default ProjectHeader;
