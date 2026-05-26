import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PieChartIcon from '@mui/icons-material/PieChart';
import ListAltIcon from '@mui/icons-material/ListAlt';
import DashboardCards from './DashboardCards';
import DashboardCharts from './DashboardCharts';
import CustomerTable from '../customers/CustomerTable';
import { useCX } from '../../hooks/useCX';
import * as api from '../../services/api';

const SECTION_TITLE_SX = {
  fontSize: '0.75rem', fontWeight: 800, color: '#64748b',
  textTransform: 'uppercase', letterSpacing: '0.08em',
  display: 'flex', alignItems: 'center', gap: 0.75,
};

export default function DashboardPage() {
  const {
    searchQuery, setSearchQuery,
    selectedStatus, setSelectedStatus,
    selectedBranch, setSelectedBranch,
    resetFilters,
  } = useCX();

  const [branches, setBranches] = useState([]);
  const [isFetchingBranches, setIsFetchingBranches] = useState(false);

  const handleFetchBranches = async () => {
    if (branches.length > 0 || isFetchingBranches) return;
    setIsFetchingBranches(true);
    try {
      const stats = await api.fetchBranchStats();
      setBranches([...new Set(stats.map(s => s.branch))]);
    } catch {
      setBranches(['วงเวียนใหญ่', 'รังสิต', 'ลาดพร้าว', 'สยาม']);
    } finally {
      setIsFetchingBranches(false);
    }
  };

  const hasFilters = searchQuery || selectedStatus || selectedBranch;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

      {/* ── Section 0: Filters ── */}
      <Box>
        <Typography sx={{ ...SECTION_TITLE_SX, mb: 1.5 }}>
          <TuneIcon sx={{ fontSize: 13, color: '#9ca3af' }} /> ตัวกรองและค้นหาข้อมูลแดชบอร์ด (Search &amp; Filters)
        </Typography>
        <Paper
          variant="outlined"
          sx={{ p: 2, borderRadius: 3, display: 'flex', flexWrap: 'wrap', gap: 1.5,
                alignItems: 'center', borderColor: 'divider' }}
        >
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

          <FormControl size="small" sx={{ minWidth: 160 }} onMouseEnter={handleFetchBranches}>
            <Select
              value={selectedBranch}
              onChange={e => setSelectedBranch(e.target.value)}
              displayEmpty
              sx={{ borderRadius: 3, fontSize: '0.75rem' }}
            >
              <MenuItem value=""><em>สาขา: ทั้งหมด</em></MenuItem>
              {branches.map(br => <MenuItem key={br} value={br}>{br}</MenuItem>)}
            </Select>
          </FormControl>

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

          {hasFilters && (
            <Button size="small" variant="outlined" onClick={resetFilters}
              sx={{ borderRadius: 3, fontSize: '0.6875rem', px: 2 }}>
              รีเซ็ต
            </Button>
          )}
        </Paper>
      </Box>

      {/* ── Section 1: KPI Cards ── */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Typography sx={SECTION_TITLE_SX}>
            <AssessmentIcon sx={{ fontSize: 13, color: '#9ca3af' }} /> ดัชนีชี้วัดหลัก (KPI &amp; Metrics)
          </Typography>
          {selectedBranch && (
            <Typography sx={{ fontSize: '0.6875rem', fontWeight: 800, color: 'primary.main',
                              bgcolor: '#EEF2FF', border: '1px solid', borderColor: 'primary.light',
                              px: 1.5, py: 0.35, borderRadius: 99 }}>
              ฟิลเตอร์สาขา: {selectedBranch}
            </Typography>
          )}
        </Box>
        <DashboardCards />
      </Box>

      {/* ── Section 2: Charts ── */}
      <Box>
        <Typography sx={{ ...SECTION_TITLE_SX, mb: 1.5 }}>
          <PieChartIcon sx={{ fontSize: 13, color: '#9ca3af' }} /> การวิเคราะห์และแนวโน้มความพึงพอใจ (Charts &amp; Graphs)
        </Typography>
        <DashboardCharts />
      </Box>

      {/* ── Section 3: Customer Table ── */}
      <Box>
        <Typography sx={{ ...SECTION_TITLE_SX, mb: 1.5 }}>
          <ListAltIcon sx={{ fontSize: 13, color: '#9ca3af' }} /> บัญชีรายชื่อลูกค้าสัญญา{selectedBranch ? ` เฉพาะสาขา ${selectedBranch}` : ' ทั้งหมดในระบบ'}
        </Typography>

        <CustomerTable />
      </Box>

    </Box>
  );
}
