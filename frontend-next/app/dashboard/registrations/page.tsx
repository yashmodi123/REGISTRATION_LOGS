import { Suspense } from 'react';
import { CircularProgress, Box } from '@mui/material';
import RegistrationsPage from './RegistrationsClient';

export default function RegistrationsWrapper() {
  return (
    <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>}>
      <RegistrationsPage />
    </Suspense>
  );
}
