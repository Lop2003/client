import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { fetchSummary } from '../../services/statsService';

const STAT_CONFIG = [
  { key: 'all',       label: 'ลูกค้าทั้งหมด',   statusVal: '',          color: '#0051BA', summaryKey: 'total_customers' },
  { key: 'active',    label: 'ผ่อนชำระปกติ',   statusVal: 'active',    color: '#057A55', summaryKey: 'active_count' },
  { key: 'overdue',   label: 'ค้างชำระค่างวด', statusVal: 'overdue',   color: '#C81E1E', summaryKey: 'overdue_count' },
  { key: 'completed', label: 'จบสัญญาแล้ว',    statusVal: 'completed', color: '#64748b', summaryKey: 'completed_count' },
];

function StatCard({ label, value, color, isActive, onClick }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        bgcolor: '#fff',
        p: 2,
        borderRadius: 3,
        border: '2px solid',
        borderColor: isActive ? color : '#f3f4f6',
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: isActive ? `0 0 0 3px ${color}22` : 'none',
        '&:hover': { borderColor: color, boxShadow: `0 0 0 3px ${color}18` },
        '&:active': { transform: 'scale(0.98)' },
      }}
    >
      <Typography
        sx={{
          fontSize: '0.6875rem',
          fontWeight: 800,
          color: '#9ca3af',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
      >
        {label}
      </Typography>
      <Typography sx={{ fontSize: '1.375rem', fontWeight: 900, color, mt: 0.5 }}>
        {value} ราย
      </Typography>
    </Box>
  );
}

/**
 * CustomerStatCards — 4 quick-stat cards (total / active / overdue / completed)
 * ดึงข้อมูลจำนวนจาก /api/stats/summary API (server-side) แทนการนับจาก array ที่ paginate แล้ว
 * @param {string}   selectedStatus - สถานะที่เลือกอยู่
 * @param {Function} setSelectedStatus
 */
export default function CustomerStatCards({ selectedStatus, setSelectedStatus }) {
  const [summary, setSummary] = useState(null);

  const loadSummary = useCallback(async () => {
    try {
      const data = await fetchSummary();
      setSummary(data);
    } catch (err) {
      console.error('Failed to fetch summary for stat cards:', err);
    }
  }, []);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  const counts = {
    all:       summary?.total_customers ?? 0,
    active:    summary?.active_count ?? 0,
    overdue:   summary?.overdue_count ?? 0,
    completed: summary?.completed_count ?? 0,
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: 2,
      }}
    >
      {STAT_CONFIG.map(({ key, label, statusVal, color }) => (
        <StatCard
          key={key}
          label={label}
          value={counts[key]}
          color={color}
          isActive={selectedStatus === statusVal}
          onClick={() =>
            setSelectedStatus(
              statusVal === '' ? '' : selectedStatus === statusVal ? '' : statusVal
            )
          }
        />
      ))}
    </Box>
  );
}
