'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Box, Drawer, AppBar, Toolbar, IconButton, Typography,
  Avatar, Tooltip, useMediaQuery, useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DevicesIcon from '@mui/icons-material/Devices';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Image from 'next/image';
import Link from 'next/link';

const DRAWER_WIDTH = 240;

const navItems = [
  { label: 'Admin Users', icon: <ManageAccountsIcon />, href: '/dashboard/users' },
  { label: 'Registrations', icon: <DevicesIcon />, href: '/dashboard/registrations' },
  { label: 'Log History', icon: <ReceiptLongIcon />, href: '/dashboard/logs' },
];

const pageTitles: Record<string, string> = {
  '/dashboard/registrations': 'Machine Registrations',
  '/dashboard/logs': 'Log History',
  '/dashboard/users': 'Admin Users',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(!isMobile);
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) { router.push('/login'); return; }
    const u = localStorage.getItem('admin_user');
    if (u) setUser(JSON.parse(u));
  }, [router]);

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    router.push('/login');
  };

  const pageTitle = Object.entries(pageTitles).find(([k]) => pathname?.startsWith(k))?.[1] ?? 'Dashboard';

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#0d0d0d' }}>

      {/* ── Brand header ── */}
      <Box sx={{
        px: 2.5, py: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0.5,
        borderBottom: '1px solid #1a1a1a',
      }}>
        <Image
          src="/assets/SINAR-TECHNOLOGY-LOGO.avif"
          alt="Sinar Technology"
          width={160} height={56}
          style={{ objectFit: 'contain', width: '100%', maxWidth: 160, height: 'auto' }}
          priority
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 20, color: '#fff', letterSpacing: 0.4 }}>
            Admin Portal
          </Typography>
        </Box>
      </Box>
      <Box sx={{ width: '100%', height: '0.5px', bgcolor: 'rgba(251, 251, 251, 0.64)' }} />

      {/* ── Navigation ── */}
      <Box sx={{ flex: 1, py: 1.5 }}>
        {navItems.map(({ label, icon, href }) => {
          const active = pathname?.startsWith(href);
          return (
            <Box
              key={href}
              component={Link}
              href={href}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 2,
                py: 1.4,
                mx: 1,
                mb: 0.5,
                borderRadius: '6px',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'background 0.15s',
                bgcolor: active ? '#F57C00' : 'transparent',
                '&:hover': {
                  bgcolor: active ? '#e65100' : 'rgba(255,255,255,0.06)',
                },
              }}
            >
              <Box sx={{ color: active ? '#fff' : '#888', display: 'flex', fontSize: 20 }}>
                {icon}
              </Box>
              <Typography sx={{
                fontSize: 13.5,
                fontWeight: active ? 700 : 400,
                color: active ? '#fff' : '#aaa',
                letterSpacing: 0.2,
              }}>
                {label}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* ── User section ── */}
      {user && (
        <Box sx={{ borderTop: '1px solid #1a1a1a' }}>
          <Box sx={{ px: 2, py: 1.8, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <AccountCircleIcon sx={{ fontSize: 36, color: '#555' }} />
            <Box sx={{ flex: 1, overflow: 'hidden' }}>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#ddd' }} noWrap>
                {user.username}
              </Typography>
              <Typography sx={{ fontSize: 11, color: '#666' }} noWrap>
                {user.email}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          width: open ? DRAWER_WIDTH : 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            bgcolor: '#0d0d0d',
            border: 'none',
            borderRight: '1px solid #1a1a1a',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AppBar position="sticky" elevation={0}
          sx={{ borderBottom: '1px solid #1e1e1e', zIndex: theme.zIndex.drawer - 1 }}>
          <Toolbar>
            <IconButton color="inherit" onClick={() => setOpen(p => !p)} sx={{ mr: 1 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
              {pageTitle}
            </Typography>
            <Tooltip title="Logout">
              <IconButton color="inherit" onClick={logout}>
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>

        <Box sx={{ flex: 1, p: 3, backgroundColor: 'background.default', overflow: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
