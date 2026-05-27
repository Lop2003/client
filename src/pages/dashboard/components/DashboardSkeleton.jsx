import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';

// 1. โครงร่างของแถบตัวกรองสาขา (Filter Bar Skeleton)
export function FilterSkeleton() {
  return (
    <Skeleton
      variant="rounded"
      height={60}
      sx={{
        borderRadius: '16px',
        bgcolor: 'rgba(255, 255, 255, 0.65)',
        border: '1px solid rgba(226, 232, 240, 0.8)',
      }}
    />
  );
}

// 2. โครงร่างของการ์ดดัชนีชี้วัดหลัก (KPI Cards Skeleton)
export function KPICardsSkeleton() {
  const skeletonCards = [
    { border: 'rgba(0, 81, 186, 0.12)', iconBg: 'rgba(0, 81, 186, 0.06)' },
    { border: 'rgba(245, 158, 11, 0.15)', iconBg: 'rgba(245, 158, 11, 0.06)' },
    { border: 'rgba(239, 68, 68, 0.18)', iconBg: 'rgba(239, 68, 68, 0.06)' },
    { border: 'rgba(16, 185, 129, 0.15)', iconBg: 'rgba(16, 185, 129, 0.06)' },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
        gap: 2.5,
      }}
    >
      {skeletonCards.map((card, i) => (
        <Card
          key={i}
          sx={{
            borderRadius: '20px',
            border: '1px solid',
            borderColor: card.border,
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            p: 3,
            boxShadow: '0 10px 25px -10px rgba(0, 81, 186, 0.04), 0 1px 2px rgba(0, 0, 0, 0.01)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Skeleton variant="text" width="60%" height={20} />
            <Skeleton variant="rounded" width={34} height={34} sx={{ borderRadius: 2.5, bgcolor: card.iconBg }} />
          </Box>
          <Skeleton variant="text" width="45%" height={38} sx={{ mb: 1.5 }} />
          <Skeleton variant="text" width="85%" height={15} />
        </Card>
      ))}
    </Box>
  );
}

// 3. โครงร่างของกราฟการวิเคราะห์ (Charts & Graphs Skeleton)
export function ChartsSkeleton() {
  const skeletonCharts = [
    { iconBg: 'rgba(0, 81, 186, 0.06)', border: 'rgba(0, 81, 186, 0.08)' },
    { iconBg: 'rgba(16, 185, 129, 0.06)', border: 'rgba(16, 185, 129, 0.08)' },
    { iconBg: 'rgba(245, 158, 11, 0.06)', border: 'rgba(245, 158, 11, 0.08)' },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: 'repeat(3, 1fr)' },
        gap: 3.5,
      }}
    >
      {skeletonCharts.map((chart, i) => (
        <Card
          key={i}
          sx={{
            borderRadius: '24px',
            border: '1px solid',
            borderColor: chart.border,
            background: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(20px)',
            p: 3,
            boxShadow: '0 10px 30px -10px rgba(0, 81, 186, 0.05), 0 1px 3px rgba(0, 0, 0, 0.01)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 1.75,
              mb: 3,
              pb: 2,
              borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
              alignItems: 'center',
            }}
          >
            <Skeleton variant="rounded" width={36} height={36} sx={{ borderRadius: '10px', bgcolor: chart.iconBg }} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" height={20} />
              <Skeleton variant="text" width="40%" height={14} />
            </Box>
          </Box>
          <Skeleton variant="rounded" height={260} sx={{ borderRadius: '14px' }} />
        </Card>
      ))}
    </Box>
  );
}
