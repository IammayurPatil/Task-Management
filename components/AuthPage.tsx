import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Container, 
  Tabs, 
  Tab,
  Alert,
  InputAdornment,
  IconButton
} from '@mui/material';
import { LayoutDashboard, Eye, EyeOff, Mail, Lock, User as UserIcon } from 'lucide-react';
import { loginUser, registerUser } from '../store/store';
import { useAppDispatch, useAppSelector } from '../store/hooks';

const AuthPage: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const loading = useAppSelector(s => s.app.loading);
  const error = useAppSelector(s => s.app.error);

  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === 0) {
      await dispatch(loginUser({ email: form.email, password: form.password }));
    } else {
      await dispatch(registerUser(form));
    }
  };

  return (
    <Container maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <div className="inline-block bg-indigo-600 p-4 rounded-2xl mb-4 shadow-xl shadow-indigo-200">
            <LayoutDashboard className="text-white" size={32} />
          </div>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>Task Management</Typography>
        </Box>

        <Card sx={{ borderRadius: 4, overflow: 'hidden' }}>
          <Tabs value={tab} onChange={(_, val) => setTab(val)} variant="fullWidth">
            <Tab label="Sign In" />
            <Tab label="SIgn Up" />
          </Tabs>

          <CardContent sx={{ p: 4 }}>
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            
            <form onSubmit={handleAuth}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {tab === 1 && (
                  <TextField
                    label="Full Name"
                    required
                    fullWidth
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                )}
                <TextField
                  label="Email"
                  type="email"
                  required
                  fullWidth
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <TextField
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  fullWidth
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff /> : <Eye />}</IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                <Button type="submit" fullWidth variant="contained" size="large" disabled={loading}>
                  {loading ? 'Processing...' : tab === 0 ? 'Sign In' : 'Create Account'}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default AuthPage;
