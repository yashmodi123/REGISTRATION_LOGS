'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary:   { main: '#F57C00' },
    secondary: { main: '#FF9800' },
    background: { default: '#121212', paper: '#1A1A1A' },
    error:   { main: '#f44336' },
    success: { main: '#4caf50' },
  },
  typography: {
    fontFamily: '"Roboto", "Inter", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: { backgroundColor: '#000000' },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { backgroundColor: '#111111', borderRight: '1px solid #2a2a2a' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, borderRadius: 6 },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          border: '1px solid #F57C00',
          boxShadow: '0 0 20px rgba(0,0,0,0.8), inset 0 0 1px #000',
          backgroundColor: '#1A1A1A',
        },
      },
    },
  },
});

export default theme;
