import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PieChartIcon from '@mui/icons-material/PieChart';
import TuneIcon from '@mui/icons-material/Tune';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import DashboardSection from './DashboardSection';
import DashboardFilters from './DashboardFilters';
import DashboardCards from './DashboardCards';
import DashboardCharts from './DashboardCharts';

export default function DashboardPage() {
  const [selectedBranch, setSelectedBranch] = useState('');

  const { summaryStats, branchStats } = useDashboardStats({ branch: selectedBranch });

  // รวบรวมรายชื่อสาขาทั้งหมดจากผลลัพธ์ของ branchStats เพื่อส่งต่อให้ Dropdown
  const branchesList = useMemo(() => {
    if (!branchStats || !branchStats.length) return [];
    return branchStats.map(stat => stat.branch).filter(Boolean);
  }, [branchStats]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

      {/* Filters */}
      <DashboardSection
        icon={<TuneIcon sx={{ fontSize: 13, color: '#9ca3af' }} />}
        label="ตัวกรองเลือกสาขาแดชบอร์ด (Branch Filter)"
      >
        <DashboardFilters
          selectedBranch={selectedBranch}
          setSelectedBranch={setSelectedBranch}
          branches={branchesList}
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
          summaryStats={summaryStats}
        />
      </DashboardSection>

      {/* Charts */}
      <DashboardSection
        icon={<PieChartIcon sx={{ fontSize: 13, color: '#9ca3af' }} />}
        label="การวิเคราะห์และแนวโน้มความพึงพอใจ (Charts & Graphs)"
      >
        <DashboardCharts
          branchStats={branchStats}
          summaryStats={summaryStats}
          selectedBranch={selectedBranch}
          setSelectedBranch={setSelectedBranch}
        />
      </DashboardSection>

    </Box>
  );
}
