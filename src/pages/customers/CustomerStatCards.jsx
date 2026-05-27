import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { fetchSummary } from '../../services/statsService';

const STAT_CONFIG = [
  { key: 'all',       label: 'ลูกค้าทั้งหมด',   statusVal: '',          color: '#0051BA', summaryKey: 'total_customers', icon: <PeopleIcon sx={{ fontSize: 18 }} /> },
  { key: 'active',    label: 'ผ่อนชำระปกติ',   statusVal: 'active',    color: '#10B981', summaryKey: 'active_count', icon: <CheckCircleIcon sx={{ fontSize: 18 }} /> },
  { key: 'overdue',   label: 'ค้างชำระค่างวด', statusVal: 'overdue',   color: '#EF4444', summaryKey: 'overdue_count', icon: <WarningAmberIcon sx={{ fontSize: 18 }} /> },
  { key: 'completed', label: 'จบสัญญาแล้ว',    statusVal: 'completed', color: '#64748B', summaryKey: 'completed_count', icon: <TaskAltIcon sx={{ fontSize: 18 }} /> },
];

function StatCard({ label, value, color, icon, isActive, onClick }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        bgcolor: 'rgba(255, 255, 255, 0.75)',
        backdropFilter: 'blur(20px)',
        p: '20px 24px',
        borderRadius: '20px',
        border: '1.5px solid',
        borderColor: isActive ? color : 'rgba(255, 255, 255, 0.5)',
        cursor: 'pointer',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: isActive 
          ? `0 12px 28px -10px ${color}35, 0 0 0 3px ${color}15` 
          : '0 8px 30px rgba(0, 81, 186, 0.02)',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': { 
          borderColor: color, 
          transform: 'translateY(-2px)',
          boxShadow: isActive 
            ? `0 14px 32px -8px ${color}45, 0 0 0 3px ${color}20` 
            : `0 10px 25px -8px ${color}20`,
        },
        '&:active': { transform: 'scale(0.98)' },
      }}
    >
      {/* Decorative background glow */}
      <Box sx={{
        position: 'absolute', top: -20, right: -20, width: 60, height: 60,
        borderRadius: '50%', background: `radial-gradient(circle, ${color}12 0%, transparent 75%)`,
        filter: 'blur(8px)', pointerEvents: 'none'
      }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
        <Typography
          sx={{
            fontSize: '0.6875rem',
            fontWeight: 800,
            color: 'text.secondary',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          {label}
        </Typography>
        <Box sx={{
          width: 28, height: 28, borderRadius: 1.75,
          bgcolor: `${color}08`, color: color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `inset 0 1px 1px ${color}05`
        }}>
          {icon}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
        <Typography sx={{ 
          fontSize: '1.625rem', 
          fontWeight: 800, 
          color: isActive ? color : 'text.primary', 
          lineHeight: 1.1,
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          letterSpacing: '-0.02em'
        }}>
          {value.toLocaleString()}
        </Typography>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'text.disabled', ml: 0.5 }}>
          ราย
        </Typography>
      </Box>
    </Box>
  );
}

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
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
        gap: 2.5,
      }}
    >
      {STAT_CONFIG.map(({ key, label, statusVal, color, icon }) => (
        <StatCard
          key={key}
          label={label}
          value={counts[key]}
          color={color}
          icon={icon}
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
