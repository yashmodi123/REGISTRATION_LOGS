'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Box, Card, Typography, TextField, Button,
  Switch, FormControlLabel, CircularProgress, Alert, IconButton, MenuItem,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
import api from '@/lib/api';

interface FormState {
  machine_number: string;
  company_name: string;
  email: string;
  is_using_sinar_mcal: boolean;
  device_type: string;
  country: string;
  date_of_purchase: string;
}

const defaultForm: FormState = {
  machine_number: '',
  company_name: '',
  email: '',
  is_using_sinar_mcal: false,
  device_type: '',
  country: '',
  date_of_purchase: '',
};


export default function RegistrationFormPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;
  const isEdit = !!id && id !== 'new';

  const [form, setForm] = useState<FormState>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/registrations/${id}`).then(res => {
      const r = res.data.data;
      setForm({
        machine_number:      r.machine_number ?? '',
        company_name:        r.company_name ?? '',
        email:               r.email ?? '',
        is_using_sinar_mcal: !!r.is_using_sinar_mcal,
        device_type:         r.device_type ?? '',
        country:             r.country ?? '',
        date_of_purchase:    r.date_of_purchase ? r.date_of_purchase.slice(0, 10) : '',
      });
    });
  }, [id, isEdit]);

  const set = (k: keyof FormState, v: string | boolean) =>
    setForm(f => ({ ...f, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const payload = { ...form };
      if (isEdit) await api.put(`/registrations/${id}`, payload);
      else await api.post('/auth/register', payload);
      router.push('/dashboard/registrations');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Operation failed');
    } finally { setSaving(false); }
  };

  return (
    <Box sx={{ maxWidth: 700 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <IconButton component={Link} href="/dashboard/registrations"><ArrowBackIcon /></IconButton>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {isEdit ? 'Edit Registration' : 'Add Registration'}
        </Typography>
      </Box>

      <Card sx={{ p: 3, border: '1px solid #2a2a2a' }}>
        <Box component="form" onSubmit={onSubmit}
          sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>

          <TextField label="Machine Number" id="field-machine-number" required
            value={form.machine_number} onChange={e => set('machine_number', e.target.value)} />
          <TextField label="Company Name" required
            value={form.company_name} onChange={e => set('company_name', e.target.value)} />
          <TextField label="Email" type="email" required
            value={form.email} onChange={e => set('email', e.target.value)} />
          <TextField label="Country"
            value={form.country} onChange={e => set('country', e.target.value)} />
          <TextField label="Date of Purchase" type="date"
            value={form.date_of_purchase} onChange={e => set('date_of_purchase', e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }} />
          <TextField label="Device Type" select
            value={form.device_type} onChange={e => set('device_type', e.target.value)}>
            <MenuItem value="">None</MenuItem>
            <MenuItem value="Android">Android</MenuItem>
            <MenuItem value="iOS">iOS</MenuItem>
          </TextField>

          <Box sx={{ gridColumn: '1 / -1' }}>
            <FormControlLabel
              control={<Switch checked={form.is_using_sinar_mcal}
                onChange={(_, v) => set('is_using_sinar_mcal', v)} color="primary" />}
              label="Using SINAR-MCAL"
            />
          </Box>

          {error && <Alert severity="error" sx={{ gridColumn: '1 / -1' }}>{error}</Alert>}

          <Box sx={{ gridColumn: '1 / -1', display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" component={Link} href="/dashboard/registrations">Cancel</Button>
            <Button type="submit" variant="contained" disabled={saving} id="btn-save-reg">
              {saving ? <CircularProgress size={20} color="inherit" /> : (isEdit ? 'Update' : 'Create')}
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
