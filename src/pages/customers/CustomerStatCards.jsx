import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const STAT_CONFIG = [
  { key: 'all',       label: 'ลูกค้าทั้งหมด',   statusVal: '',          color: '#0051BA' },
  { key: 'active',    label: 'ผ่อนชำระปกติ',   statusVal: 'active',    color: '#057A55' },
  { key: 'overdue',   label: 'ค้างชำระค่างวด', statusVal: 'overdue',   color: '#C81E1E' },
  { key: 'completed', label: 'จบสัญญาแล้ว',    statusVal: 'completed', color: '#64748b' },
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
 * @param {Object[]} customers      - รายการลูกค้าปัจจุบัน
 * @param {string}   selectedStatus - สถานะที่เลือกอยู่
 * @param {Function} setSelectedStatus
 */
export default function CustomerStatCards({ customers, selectedStatus, setSelectedStatus }) {
  const counts = {
    all:       customers.length,
    active:    customers.filter(c => c.status === 'active').length,
    overdue:   customers.filter(c => c.status === 'overdue').length,
    completed: customers.filter(c => c.status === 'completed').length,
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
