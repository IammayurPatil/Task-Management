import React, { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import { ThemeProvider, CssBaseline, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { theme } from '../lib/theme';
import '../styles/globals.css';
import Layout from '../components/layout/Layout';
import { Provider } from 'react-redux';
import { store, initApp, logoutUser } from '../store/store';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { useRouter } from 'next/router';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap'
});

const InitApp = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initApp());
  }, [dispatch]);

  return null;
};

const TokenWatcher = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector(s => s.app.token);
  const hydrated = useAppSelector(s => s.app.hydrated);

  useEffect(() => {
    if (!hydrated || typeof window === 'undefined') return;

    const checkToken = () => {
      const storedToken = localStorage.getItem('tf_token');
      if (token && token !== storedToken) {
        dispatch(logoutUser());
      }
    };

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'tf_token') {
        checkToken();
      }
    };

    const intervalId = window.setInterval(checkToken, 1000);
    window.addEventListener('storage', onStorage);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('storage', onStorage);
    };
  }, [dispatch, token, hydrated]);

  return null;
};

const AuthExpiredDialog = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onAuthExpired = () => {
      dispatch(logoutUser());
      setOpen(true);
    };

    window.addEventListener('auth-expired', onAuthExpired);
    return () => window.removeEventListener('auth-expired', onAuthExpired);
  }, [dispatch]);

  const handleLogin = () => {
    setOpen(false);
    router.push('/auth');
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Session Expired</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          Please log in again to perform this action.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={() => setOpen(false)} color="inherit">Cancel</Button>
        <Button onClick={handleLogin} variant="contained">Go to Login</Button>
      </DialogActions>
    </Dialog>
  );
};

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className={inter.className}>
          <Layout>
            <InitApp />
            <TokenWatcher />
            <AuthExpiredDialog />
            <Component {...pageProps} />
          </Layout>
        </div>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
