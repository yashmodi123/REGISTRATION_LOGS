'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Box, Card, Typography, TextField, Button, Chip,
  MenuItem, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import InfoIcon from '@mui/icons-material/Info';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloseIcon from '@mui/icons-material/Close';
import api from '@/lib/api';

interface Log {
  id: number;
  email: string;
  type: string;
  message: string;
  details: any;
  created_at: string;
  registration?: { machine_number: string; company_name: string };
}

const LOG_TYPES = ['', 'USAGE', 'ERROR'];
type ChipColor = 'warning' | 'error' | 'default';
function typeColor(t: string): ChipColor {
  if (t === 'USAGE') return 'warning';
  if (t === 'ERROR') return 'error';
  return 'default';
}

export default function LogsClient() {
  const searchParams = useSearchParams();
  const now = new Date();
  const lastWeek = new Date(); lastWeek.setDate(now.getDate() - 7);
  const fmt = (d: Date) => d.toISOString().slice(0, 16);

  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterEmail, setFilterEmail] = useState(searchParams.get('email') ?? '');
  const [startDate, setStartDate] = useState(fmt(lastWeek));
  const [endDate, setEndDate] = useState(fmt(now));
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);

  const load = useCallback(async (email: string, type: string, start: string, end: string) => {
    setLoading(true);
    try {
      const res = await api.get('/logs', {
        params: {
          email: email || undefined, type: type || undefined,
          startDate: start ? new Date(start).toISOString() : undefined,
          endDate: end ? new Date(end).toISOString() : undefined,
        },
      });
      setLogs(res.data.data ?? []);
    } catch { /* handled by interceptor */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(filterEmail, filterType, startDate, endDate); }, []);

  const filtered = logs
    .filter(l => ['USAGE', 'ERROR'].includes(l.type))
    .filter(l => !search || JSON.stringify(l).toLowerCase().includes(search.toLowerCase()));
  const usageCount = logs.filter(l => l.type === 'USAGE').length;
  const errorCount = logs.filter(l => l.type === 'ERROR').length;

  const downloadCSV = () => {
    if (!filtered.length) return;
    const headers = ['ID', 'Type', 'Machine #', 'Company', 'Email', 'Message', 'Details', 'Created At'];
    const csv = [headers.join(','),
      ...filtered.map(l => [l.id, l.type, l.registration?.machine_number ?? '', l.registration?.company_name ?? '',
        l.email ?? '', l.message, typeof l.details === 'object' ? JSON.stringify(l.details) : l.details ?? '', l.created_at]
        .map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `logs_${Date.now()}.csv`; a.click();
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: '#', width: 60 },
    { field: 'type', headerName: 'Type', width: 120, renderCell: (p) => <Chip label={p.value} size="small" color={typeColor(p.value)} variant="outlined" /> },
    { field: 'machine_number', headerName: 'Machine #', width: 120, valueGetter: (_v: any, row: any) => row.registration?.machine_number ?? '—' },
    { field: 'company_name', headerName: 'Company', flex: 1, valueGetter: (_v: any, row: any) => row.registration?.company_name ?? '—' },
    { field: 'email', headerName: 'Email', flex: 1.2 },
    { field: 'message', headerName: 'Message', flex: 1.5 },
    { field: 'created_at', headerName: 'Timestamp', width: 160, renderCell: (p) => new Date(p.value).toLocaleString() },
    {
      field: 'actions', headerName: 'Details', width: 70, sortable: false,
      renderCell: (p) => (
        <Tooltip title="View Details">
          <IconButton size="small" color="primary" onClick={() => setSelectedLog(p.row)}><InfoIcon fontSize="small" /></IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        {[
          { label: 'Usage Events', count: usageCount, icon: <InfoIcon color="warning" /> },
          { label: 'Errors', count: errorCount, icon: <InfoIcon color="error" /> },
        ].map(({ label, count, icon }) => (
          <Card key={label} sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5, maxWidth: 220, flex: 1, border: '1px solid #2a2a2a', background: 'linear-gradient(135deg, #1e1e1e, #252525)' }}>
            {icon}
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>{count}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>{label}</Typography>
            </Box>
          </Card>
        ))}
      </Box>

      <Card sx={{ p: 2, mb: 2, border: '1px solid #2a2a2a' }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <TextField label="Email" size="small" value={filterEmail} onChange={(e) => setFilterEmail(e.target.value)} sx={{ flex: 1, minWidth: 180 }} />
          <TextField label="Type" select size="small" value={filterType} onChange={(e) => setFilterType(e.target.value)} sx={{ width: 140 }}>
            {LOG_TYPES.map(t => <MenuItem key={t} value={t}>{t || 'All Types'}</MenuItem>)}
          </TextField>
          <TextField label="From" type="datetime-local" size="small" value={startDate}
            onChange={(e) => setStartDate(e.target.value)} slotProps={{ inputLabel: { shrink: true } }} sx={{ flex: 1 }} />
          <TextField label="To" type="datetime-local" size="small" value={endDate}
            onChange={(e) => setEndDate(e.target.value)} slotProps={{ inputLabel: { shrink: true } }} sx={{ flex: 1 }} />
          <Button variant="contained" size="small" onClick={() => load(filterEmail, filterType, startDate, endDate)}>Apply</Button>
          <Button variant="outlined" size="small" onClick={() => {
            setFilterEmail(''); setFilterType(''); setStartDate(fmt(lastWeek)); setEndDate(fmt(now));
            load('', '', fmt(lastWeek), fmt(now));
          }}>Clear</Button>
        </Box>
      </Card>

      <Card sx={{ border: '1px solid #2a2a2a' }}>
        <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField placeholder="Quick search…" size="small" sx={{ flex: 1 }} value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{ input: { startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} /> } }} />
          <Button variant="contained" startIcon={<FileDownloadIcon />} onClick={downloadCSV} size="small"
            sx={{ bgcolor: '#27a82e', '&:hover': { bgcolor: '#1e8a25' } }}>Export CSV</Button>
        </Box>
        <DataGrid rows={filtered} columns={columns} loading={loading}
          pageSizeOptions={[25, 50, 100]} initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
          disableRowSelectionOnClick autoHeight sx={{ border: 'none', minHeight: 400 }} />
      </Card>

      <Dialog open={!!selectedLog} onClose={() => setSelectedLog(null)} maxWidth="md" fullWidth
        slotProps={{ paper: { sx: { border: '1px solid #F57C00', bgcolor: '#1A1A1A' } } }}>
        {selectedLog && (
          <>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: 'rgba(0,0,0,0.2)', borderBottom: '1px solid #2a2a2a' }}>
              <Chip label={selectedLog.type} size="small" color={typeColor(selectedLog.type)} variant="outlined" />
              <Typography sx={{ fontWeight: 700, flex: 1 }}>Log Entry #{selectedLog.id}</Typography>
              <IconButton size="small" onClick={() => setSelectedLog(null)}><CloseIcon /></IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
              {[['Email', selectedLog.email || '—'], ['Machine #', selectedLog.registration?.machine_number || '—'],
                ['Company', selectedLog.registration?.company_name || '—'],
                ['Timestamp', new Date(selectedLog.created_at).toLocaleString()], ['Message', selectedLog.message]
              ].map(([k, v]) => (
                <Box key={k} sx={{ mb: 1.5 }}>
                  <Typography component="span" sx={{ fontWeight: 700, color: 'text.secondary', mr: 1 }}>{k}:</Typography>
                  <Typography component="span">{v}</Typography>
                </Box>
              ))}
              {selectedLog.details && (
                <Box sx={{ mt: 2.5 }}>
                  <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1, mb: 1 }}>
                    METADATA / DETAILS
                  </Typography>
                  <Box component="pre" sx={{
                    background: '#1e1e1e', color: '#dcdcdc', p: 2, borderRadius: 1, fontSize: '0.85rem',
                    maxHeight: 500, overflow: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all',
                    '&::-webkit-scrollbar': { width: 6 }, '&::-webkit-scrollbar-thumb': { background: '#444', borderRadius: 3 },
                  }}>
                    {typeof selectedLog.details === 'object' ? JSON.stringify(selectedLog.details, null, 2) : selectedLog.details}
                  </Box>
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button variant="outlined" onClick={() => setSelectedLog(null)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
