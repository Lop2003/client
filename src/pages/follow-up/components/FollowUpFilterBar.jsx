import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

const FOLLOW_UP_TYPES = [
  { value: 'payment_remind', label: 'โทรแจ้งเตือนค้างชำระ (Payment)' },
  { value: 'feedback_reply', label: 'โทรชี้แจงความพึงพอใจ (Feedback)' },
  { value: 'promotion', label: 'โทรแจ้งสิทธิ์โปรโมชั่น (Promotion)' },
];

export default function FollowUpFilterBar({
  searchQuery,
  setSearchQuery,
  selectedBranch,
  setSelectedBranch,
  selectedStatus,
  setSelectedStatus,
  selectedType,
  setSelectedType,
  branches = [],
  isLoading = false,
}) {
  return (
    <Paper
      sx={{
        p: '16px 20px',
        borderRadius: '20px',
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
      {/* Search Field */}
      <TextField
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        placeholder="พิมพ์ค้นหาชื่อลูกค้า, เบอร์โทรศัพท์, หรือรายละเอียดบันทึกติดตาม..."
        sx={{ 
          flex: 2, 
          minWidth: 280,
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
              borderWidth: '1.5px'
            }
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
            </InputAdornment>
          ),
          endAdornment: isLoading ? (
            <InputAdornment position="end">
              <CircularProgress size={16} thickness={5} sx={{ color: 'primary.main', mr: 0.5 }} />
            </InputAdornment>
          ) : null
        }}
      />

      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', flex: { xs: 1, lg: 'none' }, minWidth: { xs: '100%', sm: 'auto' }, alignItems: 'center' }}>
        <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', gap: 0.75, mr: 0.5 }}>
          <FilterAltIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: 'text.secondary' }}>
            ตัวกรองเพิ่มเติม:
          </Typography>
        </Box>

        {/* Branch Filter dropdown */}
        <FormControl size="small" sx={{ minWidth: 160, flex: 1 }}>
          <Select
            value={selectedBranch}
            onChange={e => setSelectedBranch(e.target.value)}
            displayEmpty
            sx={{ 
              borderRadius: '12px', 
              fontSize: '0.75rem',
              fontWeight: 700,
              '& .MuiSelect-select': { py: 1.25 }
            }}
          >
            <MenuItem value="" sx={{ fontSize: '0.75rem', fontWeight: 700 }}>
              <em>สาขา: ทุกพื้นที่สาขา</em>
            </MenuItem>
            {branches.map(br => (
              <MenuItem key={br} value={br} sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                สาขา: {br}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Type Filter dropdown */}
        <FormControl size="small" sx={{ minWidth: 160, flex: 1 }}>
          <Select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            displayEmpty
            sx={{ 
              borderRadius: '12px', 
              fontSize: '0.75rem',
              fontWeight: 700,
              '& .MuiSelect-select': { py: 1.25 }
            }}
          >
            <MenuItem value="" sx={{ fontSize: '0.75rem', fontWeight: 700 }}>
              <em>หัวข้อ: ทุกประเภทกิจกรรม</em>
            </MenuItem>
            {FOLLOW_UP_TYPES.map(opt => (
              <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Status Filter dropdown */}
        <FormControl size="small" sx={{ minWidth: 160, flex: 1 }}>
          <Select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            displayEmpty
            sx={{ 
              borderRadius: '12px', 
              fontSize: '0.75rem',
              fontWeight: 700,
              '& .MuiSelect-select': { py: 1.25 }
            }}
          >
            <MenuItem value="" sx={{ fontSize: '0.75rem', fontWeight: 700 }}>
              <em>สถานะ: ทั้งหมด</em>
            </MenuItem>
            <MenuItem value="pending" sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#F59E0B' }}>รอดำเนินการ (Pending)</MenuItem>
            <MenuItem value="done" sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#10B981' }}>เสร็จสิ้นแล้ว (Done)</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Paper>
  );
}
