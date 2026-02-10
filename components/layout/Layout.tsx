import React from 'react';
import { logoutUser } from '../../store/store';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material';
import { LogOut, LayoutDashboard } from 'lucide-react';
import { useRouter } from 'next/router';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(s => s.app.user);
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logoutUser());
    router.push('/auth');
  };

  if (!user) return <>{children}</>;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#F6F7FB' }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: '#FFFFFF',
          color: 'text.primary',
          borderBottom: '1px solid #E6EAF2',
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, cursor: 'pointer' }} onClick={() => router.push('/')}>
              <Box
                sx={{
                  width: 26,
                  height: 26,
                  borderRadius: 1.5,
                  background: 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
                  mr: 1.25,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <LayoutDashboard size={14} color="#FFFFFF" />
              </Box>
              <Typography variant="h6" component="div" sx={{ fontWeight: 700, letterSpacing: '-0.3px', color: '#0F172A' }}>
                Task Management
              </Typography>
            </Box>

            <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F172A' }}>
                Hello,
                {user?.name ? (
                  <Box component="span" sx={{ color: '#2563EB' }}>
                    {` ${user.name}`}
                  </Box>
                ) : ''}
              </Typography>
              <Tooltip title="User Profile">
                <Avatar sx={{ bgcolor: '#E0F2FE', color: '#0F172A', fontWeight: 700, width: 32, height: 32 }}>
                  {user.name?.charAt(0) || 'U'}
                </Avatar>
              </Tooltip>
              <IconButton onClick={handleLogout} color="error" size="small">
                <LogOut size={20} />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 3, mb: 4, flexGrow: 1 }}>
        {children}
      </Container>

      <Box component="footer" sx={{ py: 2, bgcolor: '#FFFFFF', borderTop: '1px solid #E6EAF2' }}>
        <Container maxWidth="xl">
          <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: '#64748B', fontWeight: 600 }}>
            Developed by Mayur Patil
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
