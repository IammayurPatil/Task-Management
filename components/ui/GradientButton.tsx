import React from 'react';
import { Button, ButtonProps } from '@mui/material';

const baseSx = {
  background: 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
  color: 'white',
  borderRadius: 1.5,
  px: 3,
  py: 1.1,
  boxShadow: '0 10px 20px rgba(37, 99, 235, 0.25)',
  textTransform: 'none',
  fontWeight: 700,
  '&:hover': { background: 'linear-gradient(135deg, #1D4ED8 0%, #0891B2 100%)' }
} as const;

const GradientButton: React.FC<ButtonProps> = ({ sx, ...props }) => {
  return <Button {...props} sx={[baseSx, sx]} />;
};

export default GradientButton;
