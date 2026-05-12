'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Box, Card, Typography, TextField, Button, CircularProgress,
  Alert, IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Link from 'next/link';
import api from '@/lib/api';

interface FormState { username: string; email: string; password: string }

export default function UserFormPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;
  const isEdit = !!id && id !== 'new';

  const [form, setForm] = useState<FormState>({ username: '', email: '', password: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/users/${id}`).then(res => {
      const u = res.data.data;
      setForm({ username: u.username, email: u.email, password: '' });
    });
  }, [id, isEdit]);

  const set = (k: keyof FormState, v: string) => setForm(f => ({ ...f, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const payload: any = { username: form.username, email: form.email };
      if (form.password) payload.password = form.password;
      if (isEdit) await api.put(`/users/${id}`, payload);
      else await api.post('/users', { ...payload, password: form.password });
      router.push('/dashboard/users');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Operation failed');
    } finally { setSaving(false); }
  };

  return (
    <Box sx={{ maxWidth: 560 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <IconButton component={Link} href="/dashboard/users"><ArrowBackIcon /></IconButton>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {isEdit ? 'Edit Admin User' : 'Add Admin User'}
        </Typography>
      </Box>

      <Card sx={{ p: 3, border: '1px solid #2a2a2a' }}>
        <Box component="form" onSubmit={onSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField label="Username" id="field-username" required
            value={form.username} onChange={e => set('username', e.target.value)} />
          <TextField label="Email" type="email" id="field-email" required
            value={form.email} onChange={e => set('email', e.target.value)} />
          <TextField
            label={isEdit ? 'New Password (optional)' : 'Password *'}
            id="field-password"
            type={showPass ? 'text' : 'password'}
            required={!isEdit}
            value={form.password}
            onChange={e => set('password', e.target.value)}
            helperText={isEdit ? 'Leave blank to keep current password' : undefined}
            slotProps={{
              input: {
                endAdornment: (
                  <IconButton onClick={() => setShowPass(p => !p)} edge="end">
                    {showPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                ),
              },
            }}
          />
          {error && <Alert severity="error">{error}</Alert>}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" component={Link} href="/dashboard/users">Cancel</Button>
            <Button type="submit" variant="contained" disabled={saving} id="btn-save-user">
              {saving ? <CircularProgress size={20} color="inherit" /> : (isEdit ? 'Update' : 'Create')}
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
