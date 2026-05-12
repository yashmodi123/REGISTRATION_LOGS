import { Suspense } from 'react';
import { CircularProgress, Box } from '@mui/material';
import LogsClient from './LogsClient';

export default function LogsWrapper() {
  return (
    <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>}>
      <LogsClient />
    </Suspense>
  );
}
