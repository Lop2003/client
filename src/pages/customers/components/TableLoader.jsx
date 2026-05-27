import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

export default function TableLoader({ isLoading }) {
  return isLoading ? (
    <LinearProgress 
      sx={{ 
        height: 3, 
        bgcolor: 'rgba(0, 81, 186, 0.08)', 
        '& .MuiLinearProgress-bar': { bgcolor: 'primary.main' } 
      }} 
    />
  ) : (
    <Box sx={{ height: 3 }} />
  );
}
