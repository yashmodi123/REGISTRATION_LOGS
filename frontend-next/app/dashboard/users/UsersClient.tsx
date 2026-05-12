'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Box, Card, Typography, TextField, Button, Avatar,
  IconButton, Tooltip,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import GroupIcon from '@mui/icons-material/Group';
import Link from 'next/link';
import api from '@/lib/api';

interface AdminUser { id: number; username: string; email: string; created_at: string }

export default function UsersClient() {
  const searchParams = useSearchParams();
  const debugMode = searchParams.get('debug') === '1';

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users');
      setUsers(res.data.data ?? []);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this admin?')) return;
    await api.delete(`/users/${id}`);
    load();
  };

  const filtered = users.filter(u =>
    !search || u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const columns: GridColDef[] = [
    { field: 'id', headerName: '#', width: 60 },
    {
      field: 'username', headerName: 'Username', flex: 1,
      renderCell: (p) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main', fontSize: 13 }}>
            {p.value?.[0]?.toUpperCase()}
          </Avatar>
          {p.value}
        </Box>
      ),
    },
    { field: 'email', headerName: 'Email', flex: 1.5 },
    {
      field: 'created_at', headerName: 'Created', width: 140,
      renderCell: (p) => new Date(p.value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    },
    {
      field: 'actions', headerName: 'Actions', width: 110, sortable: false,
      renderCell: (p) => (
        <Box sx={{ display: 'flex' }}>
          <Tooltip title="Edit">
            <IconButton size="small" component={Link} href={`/dashboard/users/${p.row.id}/edit`}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {debugMode && (
            <Tooltip title="Delete">
              <IconButton size="small" color="error" onClick={() => handleDelete(p.row.id)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Card sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, maxWidth: 220, border: '1px solid #2a2a2a', background: 'linear-gradient(135deg, #1e1e1e, #252525)' }}>
        <GroupIcon color="primary" />
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>{users.length}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Total Admins</Typography>
        </Box>
      </Card>
      <Card sx={{ border: '1px solid #2a2a2a' }}>
        <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField placeholder="Search by name or email…" size="small" sx={{ flex: 1 }}
            value={search} onChange={(e) => setSearch(e.target.value)}
            slotProps={{ input: { startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} /> } }} />
          <Button variant="contained" startIcon={<AddIcon />} component={Link} href="/dashboard/users/new" size="small" id="btn-add-user">
            Add Admin
          </Button>
        </Box>
        <DataGrid rows={filtered} columns={columns} loading={loading}
          pageSizeOptions={[10, 25]} initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          disableRowSelectionOnClick autoHeight sx={{ border: 'none', minHeight: 300 }} />
      </Card>
    </Box>
  );
}
