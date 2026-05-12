import { Suspense } from 'react';
import { CircularProgress, Box } from '@mui/material';
import UsersClient from './UsersClient';

export default function UsersWrapper() {
  return (
    <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>}>
      <UsersClient />
    </Suspense>
  );
}
