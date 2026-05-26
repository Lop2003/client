import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import SearchIcon from '@mui/icons-material/Search';

/**
 * CustomerFilterBar — filter bar สำหรับหน้า Customers
 * @param {string}   searchQuery
 * @param {Function} setSearchQuery
 * @param {string}   selectedBranch
 * @param {Function} setSelectedBranch
 * @param {string}   selectedStatus
 * @param {Function} setSelectedStatus
 * @param {string[]} branches
 */
export default function CustomerFilterBar({
  searchQuery,
  setSearchQuery,
  selectedBranch,
  setSelectedBranch,
  selectedStatus,
  setSelectedStatus,
  branches,
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 3,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1.5,
        alignItems: 'center',
        borderColor: 'divider',
      }}
    >
      {/* Search */}
      <TextField
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        placeholder="ค้นหาชื่อลูกค้า, เบอร์โทร, สินค้าผ่อน..."
        sx={{ flex: 1, minWidth: 200 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />

      {/* Branch filter */}
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <Select
          value={selectedBranch}
          onChange={e => setSelectedBranch(e.target.value)}
          displayEmpty
          sx={{ borderRadius: 3, fontSize: '0.75rem' }}
        >
          <MenuItem value=""><em>สาขา: ทั้งหมด</em></MenuItem>
          {branches.map(br => (
            <MenuItem key={br} value={br}>{br}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Status filter */}
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <Select
          value={selectedStatus}
          onChange={e => setSelectedStatus(e.target.value)}
          displayEmpty
          sx={{ borderRadius: 3, fontSize: '0.75rem' }}
        >
          <MenuItem value=""><em>สถานะ: ทั้งหมด</em></MenuItem>
          <MenuItem value="active">ปกติ (Active)</MenuItem>
          <MenuItem value="overdue">ค้างชำระ (Overdue)</MenuItem>
          <MenuItem value="completed">จบสัญญา (Completed)</MenuItem>
        </Select>
      </FormControl>
    </Paper>
  );
}
