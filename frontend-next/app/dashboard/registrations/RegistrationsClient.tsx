'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Box, Card, Typography, TextField, Button, Chip,
  IconButton, Tooltip, Dialog, DialogTitle, DialogContent,
  DialogActions, RadioGroup, FormControlLabel, Radio, CircularProgress,
} from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import DevicesIcon from '@mui/icons-material/Devices';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface Registration {
  id: number;
  machine_number: string;
  company_name: string;
  email: string;
  country: string;
  is_using_sinar_mcal: boolean;
  created_at: string;
}

export default function RegistrationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const debugMode = searchParams.get('debug') === '1';

  const [rows, setRows] = useState<Registration[]>([]);
  const [total, setTotal] = useState(0);
  const [usingMcal, setUsingMcal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Export dialog ──────────────────────────────────────────────────────────
  const [exportOpen, setExportOpen] = useState(false);
  const [exportMode, setExportMode] = useState<'full' | 'range'>('full');
  const [exportStart, setExportStart] = useState('');
  const [exportEnd, setExportEnd] = useState('');
  const [exporting, setExporting] = useState(false);

  const load = useCallback(async (s: string, pg: GridPaginationModel) => {
    setLoading(true);
    try {
      const res = await api.get('/registrations', {
        params: { page: pg.page + 1, limit: pg.pageSize, search: s },
      });
      setRows(res.data.data ?? []);
      setTotal(res.data.total ?? 0);
      setUsingMcal(res.data.usingMcalCount ?? 0);
    } catch { /* handled by interceptor */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(search, paginationModel); }, [paginationModel]);

  const handleSearch = (val: string) => {
    setSearch(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPaginationModel(p => ({ ...p, page: 0 }));
      load(val, { ...paginationModel, page: 0 });
    }, 500);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this registration?')) return;
    await api.delete(`/registrations/${id}`);
    load(search, paginationModel);
  };

  const buildCSV = (data: Registration[]) => {
    const headers = ['ID', 'Machine #', 'Company', 'Email', 'Country', 'SINAR-MCAL', 'Registered At'];
    return [headers.join(','),
      ...data.map(r => [r.id, r.machine_number, r.company_name, r.email, r.country,
        r.is_using_sinar_mcal ? 'Yes' : 'No', r.created_at]
        .map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const params: Record<string, string | number> = { limit: 99999, page: 1 };
      if (exportMode === 'range') {
        if (exportStart) params.startDate = new Date(exportStart).toISOString();
        if (exportEnd)   params.endDate   = new Date(exportEnd).toISOString();
      }
      const res = await api.get('/registrations', { params });
      const data: Registration[] = res.data.data ?? [];
      if (!data.length) { alert('No records found for the selected range.'); return; }
      const csv = buildCSV(data);
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
      const suffix = exportMode === 'range'
        ? `${exportStart.slice(0, 10)}_to_${exportEnd.slice(0, 10)}`
        : 'full';
      a.download = `registrations_${suffix}.csv`;
      a.click();
      setExportOpen(false);
    } finally { setExporting(false); }
  };

  const columns: GridColDef[] = [
    {
      field: '_no',
      headerName: 'Sr. No',
      width: 70,
      sortable: false,
      renderCell: (p) => {
        const index = rows.findIndex(r => r.id === p.row.id);
        return paginationModel.page * paginationModel.pageSize + index + 1;
      },
    },
    { field: 'machine_number', headerName: 'Machine #', flex: 1, renderCell: (p) => <strong>{p.value}</strong> },
    { field: 'company_name', headerName: 'Company', flex: 1.2 },
    { field: 'email', headerName: 'Email', flex: 1.5 },
    { field: 'country', headerName: 'Country', width: 120, renderCell: (p) => p.value || '—' },
    {
      field: 'is_using_sinar_mcal', headerName: 'SINAR-MCAL', width: 130,
      renderCell: (p) => <Chip label={p.value ? 'Yes' : 'No'} size="small" color={p.value ? 'success' : 'error'} variant="outlined" />,
    },
    {
      field: 'created_at', headerName: 'Registered', width: 130,
      renderCell: (p) => new Date(p.value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    },
    {
      field: 'actions', headerName: 'Actions', width: 140, sortable: false,
      renderCell: (p) => (
        <Box sx={{ display: 'flex' }}>
          <Tooltip title="View Logs">
            <IconButton size="small" color="primary" onClick={() => router.push(`/dashboard/logs?email=${p.row.email}`)}>
              <ReceiptLongIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" component={Link} href={`/dashboard/registrations/${p.row.id}/edit`}>
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
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        {[
          { icon: <DevicesIcon color="primary" />, value: total, label: 'Total Devices' },
          { icon: <CheckCircleIcon color="success" />, value: usingMcal, label: 'Using SINAR-MCAL' },
        ].map(({ icon, value, label }) => (
          <Card key={label} sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5, maxWidth: 220, flex: 1, background: 'linear-gradient(135deg, #1e1e1e, #252525)', border: '1px solid #2a2a2a' }}>
            {icon}
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>{value}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>{label}</Typography>
            </Box>
          </Card>
        ))}
      </Box>
      <Card sx={{ border: '1px solid #2a2a2a' }}>
        <Box sx={{ p: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField placeholder="Search machines…" size="small" sx={{ flex: 1, minWidth: 200 }}
            value={search} onChange={(e) => handleSearch(e.target.value)}
            slotProps={{ input: { startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} /> } }} />
          <Button variant="outlined" startIcon={<FileDownloadIcon />} onClick={() => setExportOpen(true)} size="small">Export CSV</Button>
          <Button variant="contained" startIcon={<AddIcon />} component={Link} href="/dashboard/registrations/new" size="small" id="btn-add-reg">Add Registration</Button>
        </Box>
        <DataGrid rows={rows} columns={columns} rowCount={total}
          paginationMode="server" paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 25, 50]} loading={loading}
          disableRowSelectionOnClick autoHeight sx={{ border: 'none', minHeight: 400 }} />
      </Card>
      {/* ── Export Dialog ── */}
      <Dialog open={exportOpen} onClose={() => setExportOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, borderBottom: '1px solid #eee', pb: 1.5 }}>
          📥 Export Registrations CSV
        </DialogTitle>
        <DialogContent sx={{ pt: 2.5 }}>
          <RadioGroup value={exportMode} onChange={(e) => setExportMode(e.target.value as 'full' | 'range')}>
            <FormControlLabel value="full" control={<Radio />} label="Full Report (all records)" />
            <FormControlLabel value="range" control={<Radio />} label="Filter by Date Range" />
          </RadioGroup>

          {exportMode === 'range' && (
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="From Date" type="date" size="small" fullWidth
                value={exportStart}
                onChange={(e) => setExportStart(e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                label="To Date" type="date" size="small" fullWidth
                value={exportEnd}
                onChange={(e) => setExportEnd(e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button variant="outlined" onClick={() => setExportOpen(false)} disabled={exporting}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleExport}
            disabled={exporting || (exportMode === 'range' && (!exportStart || !exportEnd))}
            startIcon={exporting ? <CircularProgress size={16} color="inherit" /> : <FileDownloadIcon />}
          >
            {exporting ? 'Exporting…' : 'Download CSV'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
