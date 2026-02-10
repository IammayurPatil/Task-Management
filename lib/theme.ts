import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#4f46e5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0ea5e9',
    },
    background: {
      default: '#f8fafc',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, fontSize: '2.25rem', lineHeight: 1.2, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, fontSize: '1.875rem', lineHeight: 1.25, letterSpacing: '-0.015em' },
    h3: { fontWeight: 700, fontSize: '1.5rem', lineHeight: 1.3, letterSpacing: '-0.01em' },
    h4: { fontWeight: 700, fontSize: '1.25rem', lineHeight: 1.35, letterSpacing: '-0.005em' },
    h5: { fontWeight: 600, fontSize: '1.125rem', lineHeight: 1.4 },
    h6: { fontWeight: 600, fontSize: '1rem', lineHeight: 1.45 },
    body1: { fontWeight: 400, fontSize: '0.95rem', lineHeight: 1.6 },
    body2: { fontWeight: 400, fontSize: '0.875rem', lineHeight: 1.6 },
    caption: { fontWeight: 500, fontSize: '0.75rem', lineHeight: 1.5, letterSpacing: '0.01em' },
    button: { textTransform: 'none', fontWeight: 600, fontSize: '0.9rem', lineHeight: 1.4 },
    overline: { fontWeight: 600, fontSize: '0.7rem', lineHeight: 1.4, letterSpacing: '0.08em' }
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          letterSpacing: '0.005em'
        },
        'input, textarea, button, select': {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
  },
});
