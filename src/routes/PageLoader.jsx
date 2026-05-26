import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

/**
 * PageLoader — fallback UI ขณะ lazy-load page component
 */
export default function PageLoader() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
      }}
    >
      <CircularProgress size={32} thickness={4} />
    </Box>
  );
}
