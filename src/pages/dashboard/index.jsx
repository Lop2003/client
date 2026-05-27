import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PieChartIcon from '@mui/icons-material/PieChart';
import ListAltIcon from '@mui/icons-material/ListAlt';
import TuneIcon from '@mui/icons-material/Tune';
import { useNavigate } from 'react-router-dom';
import { useCustomers } from '../../hooks/useCustomers';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { useCustomerFilters } from '../../hooks/useCustomerFilters';
import { useFeedbacks } from '../../hooks/useFeedbacks';
import { PATHS } from '../../routes/paths';
import DashboardSection from './DashboardSection';
import DashboardFilters from './DashboardFilters';
import DashboardCards from './DashboardCards';
import DashboardCharts from './DashboardCharts';
import CustomerTable from '../customers/CustomerTable';

export default function DashboardPage() {
  const navigate = useNavigate();

  const {
    searchQuery, setSearchQuery,
    selectedBranch, setSelectedBranch,
    selectedStatus, setSelectedStatus,
    sortBy, setSortBy,
    sortOrder, setSortOrder,
    resetFilters,
    hasFilters,
  } = useCustomerFilters();

  const { summaryStats, branchStats, branches } = useDashboardStats({ branch: selectedBranch });

  const {
    customers,
    total,
    page,
    limit,
    setPage,
    setLimit,
  } = useCustomers({
    search: searchQuery,
    branch: selectedBranch,
    status: selectedStatus,
    sortBy,
    sortOrder,
  });

  const { feedbacks } = useFeedbacks({ branch: selectedBranch });

  // คำนวณ satisfactionRate จาก feedbacks จริงๆ
  const satisfactionRate = useMemo(() => {
    if (!feedbacks.length) return '0';
    const pos = feedbacks.filter(fb => fb.sentiment === 'positive').length;
    return ((pos / feedbacks.length) * 100).toFixed(0);
  }, [feedbacks]);

  const statsForCards = useMemo(() => ({
    ...summaryStats,
    satisfactionRate,
  }), [summaryStats, satisfactionRate]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

      {/* Filters */}
      <DashboardSection
        icon={<TuneIcon sx={{ fontSize: 13, color: '#9ca3af' }} />}
        label="ตัวกรองและค้นหาข้อมูลแดชบอร์ด (Search & Filters)"
      >
        <DashboardFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedBranch={selectedBranch}
          setSelectedBranch={setSelectedBranch}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          branches={branches}
          hasFilters={hasFilters}
          resetFilters={resetFilters}
        />
      </DashboardSection>

      {/* KPI Cards */}
      <DashboardSection
        icon={<AssessmentIcon sx={{ fontSize: 13, color: '#9ca3af' }} />}
        label="ดัชนีชี้วัดหลัก (KPI & Metrics)"
        rightSlot={
          selectedBranch && (
            <Typography
              sx={{
                fontSize: '0.6875rem', fontWeight: 800, color: 'primary.main',
                bgcolor: '#EEF2FF', border: '1px solid', borderColor: 'primary.light',
                px: 1.5, py: 0.35, borderRadius: 99,
              }}
            >
              ฟิลเตอร์สาขา: {selectedBranch}
            </Typography>
          )
        }
      >
        <DashboardCards
          summaryStats={statsForCards}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
        />
      </DashboardSection>

      {/* Charts */}
      <DashboardSection
        icon={<PieChartIcon sx={{ fontSize: 13, color: '#9ca3af' }} />}
        label="การวิเคราะห์และแนวโน้มความพึงพอใจ (Charts & Graphs)"
      >
        <DashboardCharts
          branchStats={branchStats}
          filteredFeedbacks={feedbacks}
          selectedBranch={selectedBranch}
          setSelectedBranch={setSelectedBranch}
        />
      </DashboardSection>

      {/* Customer Table */}
      <DashboardSection
        icon={<ListAltIcon sx={{ fontSize: 13, color: '#9ca3af' }} />}
        label={`บัญชีรายชื่อลูกค้าสัญญา${selectedBranch ? ` เฉพาะสาขา ${selectedBranch}` : ' ทั้งหมดในระบบ'}`}
      >
        <CustomerTable
          customers={customers}
          total={total}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={setLimit}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          onRowClick={id => navigate(`${PATHS.CUSTOMERS}?id=${id}`)}
        />
      </DashboardSection>

    </Box>
  );
}
