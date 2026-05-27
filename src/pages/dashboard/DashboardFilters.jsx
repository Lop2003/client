import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

/**
 * DashboardFilters — filter bar สำหรับเลือกสาขาในหน้า Dashboard
 * @param {string}   selectedBranch
 * @param {Function} setSelectedBranch
 * @param {string[]} branches          - รายชื่อสาขาทั้งหมด
 */
export default function DashboardFilters({
  selectedBranch,
  setSelectedBranch,
  branches = [],
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 3,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        alignItems: 'center',
        borderColor: 'divider',
        background: 'linear-gradient(to right, #ffffff, #fcfcfd)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <FilterAltIcon sx={{ fontSize: 18, color: 'primary.main' }} />
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'text.secondary' }}>
          เลือกดูข้อมูลรายสาขา:
        </Typography>
      </Box>

      {/* Branch filter */}
      <FormControl size="small" sx={{ minWidth: 200 }}>
        <Select
          value={selectedBranch}
          onChange={e => setSelectedBranch(e.target.value)}
          displayEmpty
          sx={{ 
            borderRadius: 3, 
            fontSize: '0.75rem',
            fontWeight: 600,
            '& .MuiSelect-select': { py: 1 }
          }}
        >
          <MenuItem value="" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
            <em>สาขา: ทั้งหมดทุกสาขา</em>
          </MenuItem>
          {branches.map(br => (
            <MenuItem key={br} value={br} sx={{ fontSize: '0.75rem' }}>
              สาขา: {br}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Paper>
  );
}
