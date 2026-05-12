'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Box, Drawer, AppBar, Toolbar, IconButton, Typography, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Divider, Avatar, Tooltip,
  useMediaQuery, useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DevicesIcon from '@mui/icons-material/Devices';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LogoutIcon from '@mui/icons-material/Logout';
import Image from 'next/image';
import Link from 'next/link';

const DRAWER_WIDTH = 260;

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
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Brand */}
      <Box sx={{
        p: 2.5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        background: 'linear-gradient(160deg, rgba(245,124,0,0.08) 0%, transparent 100%)',
        borderBottom: '1px solid rgba(245,124,0,0.15)',
      }}>
        <Image
          src="/assets/SINAR-TECHNOLOGY-LOGO.avif"
          alt="Sinar Technology Logo"
          width={150}
          height={60}
          style={{ objectFit: 'contain', width: '100%', maxWidth: 150, height: 'auto' }}
          priority
        />
        <Box sx={{ textAlign: 'center' }}>
          <Typography sx={{ fontWeight: 700, fontSize: 13, color: 'primary.main', letterSpacing: 0.5 }}>
            Admin Portal
          </Typography>
          <Typography sx={{ fontSize: 10, color: 'text.secondary', letterSpacing: 0.3 }}>
            Device Registry Management
          </Typography>
        </Box>
      </Box>

      <List sx={{ flex: 1, px: 1, py: 1.5 }}>
        {navItems.map(({ label, icon, href }) => {
          const active = pathname?.startsWith(href);
          return (
            <ListItem key={href} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link} href={href}
                selected={active}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    background: 'rgba(245,124,0,0.15)',
                    borderLeft: '3px solid #F57C00',
                    '& .MuiListItemIcon-root': { color: 'primary.main' },
                    '& .MuiListItemText-primary': { color: 'primary.main', fontWeight: 700 },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: active ? 'primary.main' : 'text.secondary' }}>
                  {icon}
                </ListItemIcon>
                <ListItemText primary={label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: '#2a2a2a' }} />
      {/* User info */}
      {user && (
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14 }}>
            {user.username[0]?.toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            <Typography sx={{ fontSize: 13, fontWeight: 600 }} noWrap>{user.username}</Typography>
            <Typography sx={{ fontSize: 11, color: 'text.secondary' }} noWrap>{user.email}</Typography>
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
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main */}
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
