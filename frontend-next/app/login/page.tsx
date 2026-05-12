'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box, Card, TextField, Button, Typography, InputAdornment,
  IconButton, Alert, CircularProgress,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Image from 'next/image';
import api from '@/lib/api';

const schema = yup.object({
  email: yup.string().required('Username or email is required'),
  password: yup.string().required('Password is required'),
});

type FormData = yup.InferType<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/user-auth/login', data);
      localStorage.setItem('admin_token', res.data.data.token);
      localStorage.setItem('admin_user', JSON.stringify(res.data.data.user));
      router.push('/dashboard/registrations');
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at top left, #1a0a00 0%, #121212 60%)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Decorative shapes */}
      {['20%,10%', '80%,70%', '50%,90%'].map((pos, i) => (
        <Box key={i} sx={{
          position: 'absolute',
          width: [300, 400, 200][i], height: [300, 400, 200][i],
          left: pos.split(',')[0], top: pos.split(',')[1],
          borderRadius: '50%',
          background: `rgba(245,124,0,${[0.06, 0.04, 0.03][i]})`,
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }} />
      ))}

      <Card sx={{
        p: 4, width: '100%', maxWidth: 420,
        background: 'rgba(26,26,26,0.9)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(245,124,0,0.2)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        zIndex: 1,
      }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Image src="/assets/SINAR-TECHNOLOGY-LOGO.avif" alt="Sinar Logo"
            width={140} height={60} style={{ objectFit: 'contain', marginBottom: 12 }} />
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Admin Portal</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>Device Registration Management</Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Username or Email"
            id="login-email"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            slotProps={{ input: { startAdornment: <AccountCircleIcon sx={{ mr: 1, color: 'text.secondary' }} /> } }}
            fullWidth
          />
          <TextField
            label="Password"
            id="login-password"
            type={showPass ? 'text' : 'password'}
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            slotProps={{
              input: {
                startAdornment: <LockIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                endAdornment: (
                  <IconButton onClick={() => setShowPass(p => !p)} edge="end">
                    {showPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                ),
              },
            }}
            fullWidth
          />

          {error && <Alert severity="error">{error}</Alert>}

          <Button
            type="submit" variant="contained" fullWidth size="large" id="login-submit"
            disabled={loading}
            sx={{ mt: 1, py: 1.4, fontSize: '1rem' }}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : 'Sign In'}
          </Button>
        </Box>
      </Card>
    </Box>
  );
}
