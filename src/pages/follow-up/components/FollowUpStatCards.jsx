import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { fetchFollowUps } from '../../../services/followUpService';

const STAT_CONFIG = [
  { key: 'all',     label: 'งานติดตามทั้งหมด', statusVal: '',        color: '#0051BA', icon: <AssignmentIcon sx={{ fontSize: 18 }} /> },
  { key: 'pending', label: 'รอดำเนินการ',     statusVal: 'pending',   color: '#F59E0B', icon: <AccessTimeIcon sx={{ fontSize: 18 }} /> },
  { key: 'done',    label: 'เสร็จสิ้นแล้ว',     statusVal: 'done',      color: '#10B981', icon: <CheckCircleIcon sx={{ fontSize: 18 }} /> },
];

function StatCard({ label, value, color, icon, isActive, onClick, isLoading }) {
  return (
    <Box
      onClick={isLoading ? undefined : onClick}
      sx={{
        bgcolor: 'rgba(255, 255, 255, 0.75)',
        backdropFilter: 'blur(20px)',
        p: '20px 24px',
        borderRadius: '20px',
        border: '1.5px solid',
        borderColor: isActive ? color : 'rgba(255, 255, 255, 0.5)',
        cursor: isLoading ? 'default' : 'pointer',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: isActive 
          ? `0 12px 28px -10px ${color}35, 0 0 0 3px ${color}15` 
          : '0 8px 30px rgba(0, 81, 186, 0.02)',
        position: 'relative',
        overflow: 'hidden',
        ...(!isLoading && {
          '&:hover': { 
            borderColor: color, 
            transform: 'translateY(-2px)',
            boxShadow: isActive 
              ? `0 14px 32px -8px ${color}45, 0 0 0 3px ${color}20` 
              : `0 10px 25px -8px ${color}20`,
          },
          '&:active': { transform: 'scale(0.98)' },
        })
      }}
    >
      {/* Background glow */}
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
        {isLoading ? (
          <Skeleton 
            variant="rounded" 
            width="55%" 
            height={28} 
            sx={{ 
              borderRadius: '6px',
              bgcolor: 'rgba(0, 81, 186, 0.06)'
            }} 
          />
        ) : (
          <>
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
              รายการ
            </Typography>
          </>
        )}
      </Box>
    </Box>
  );
}

export default function FollowUpStatCards({ selectedStatus, setSelectedStatus, triggerRefetch }) {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadSummary = useCallback(async () => {
    setIsLoading(true);
    try {
      const [allRes, pendingRes, doneRes] = await Promise.all([
        fetchFollowUps({ limit: 1 }),
        fetchFollowUps({ status: 'pending', limit: 1 }),
        fetchFollowUps({ status: 'done', limit: 1 }),
      ]);
      setSummary({
        all: allRes?.total ?? 0,
        pending: pendingRes?.total ?? 0,
        done: doneRes?.total ?? 0,
      });
    } catch (err) {
      console.error('Failed to fetch summary for follow-up stat cards:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSummary();
  }, [loadSummary, triggerRefetch]);

  const counts = {
    all: summary?.all ?? 0,
    pending: summary?.pending ?? 0,
    done: summary?.done ?? 0,
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
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
          isLoading={isLoading}
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
