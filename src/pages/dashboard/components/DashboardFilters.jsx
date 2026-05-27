import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CircularProgress from '@mui/material/CircularProgress';

export default function DashboardFilters({
  selectedBranch,
  setSelectedBranch,
  branches = [],
  isLoading = false,
}) {
  return (
    <Paper
      sx={{
        p: '14px 20px',
        borderRadius: '16px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.55)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        boxShadow: '0 8px 30px rgba(0, 81, 186, 0.03)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
        <Box sx={{
          width: 28, height: 28, borderRadius: 2,
          bgcolor: 'rgba(0, 81, 186, 0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'primary.main',
        }}>
          {isLoading ? (
            <CircularProgress size={14} sx={{ color: 'primary.main' }} />
          ) : (
            <FilterAltIcon sx={{ fontSize: 16 }} />
          )}
        </Box>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: 'text.secondary', letterSpacing: '0.01em' }}>
          เลือกวิเคราะห์รายพื้นที่สาขา:
        </Typography>
      </Box>

      {/* Branch filter dropdown */}
      <FormControl size="small" sx={{ minWidth: 220 }}>
        <Select
          value={selectedBranch}
          onChange={e => setSelectedBranch(e.target.value)}
          displayEmpty
          disabled={isLoading}
          sx={{ 
            borderRadius: '12px', 
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'text.primary',
            '& .MuiSelect-select': { py: 1.25, px: 2 }
          }}
        >
          <MenuItem value="" sx={{ fontSize: '0.75rem', fontWeight: 700 }}>
            <em>สาขา: ทุกพื้นที่สาขา (All)</em>
          </MenuItem>
          {branches.map(br => (
            <MenuItem key={br} value={br} sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
              สาขา: {br}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Paper>
  );
}

