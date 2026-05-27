import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import PeopleIcon from '@mui/icons-material/People';
import StarIcon from '@mui/icons-material/Star';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';

export default function DashboardCards({
  summaryStats = { totalCustomers: 0, avgRating: '0.0', overdueCount: 0, satisfactionRate: '0' },
  selectedStatus = '',
  setSelectedStatus = () => { },
}) {

  const cards = [
    {
      key: '',
      title: 'ลูกค้าทั้งหมดในระบบ',
      value: summaryStats.totalCustomers.toLocaleString(),
      unit: 'ราย',
      sub: 'ยอดรวมบัญชีลูกค้าค้างชำระ & ปกติ',
      icon: <PeopleIcon sx={{ fontSize: 20 }} />,
      // White Glassmorphic Card
      bg: 'rgba(255, 255, 255, 0.8)',
      border: 'rgba(0, 81, 186, 0.12)',
      iconBg: 'rgba(0, 81, 186, 0.06)',
      iconColor: '#0051bb',
      titleColor: '#0051bb',
      valueColor: '#0F172A',
      subColor: '#64748B',
      noClick: true,
    },
    {
      key: '__avg',
      title: 'คะแนนความพึงพอใจเฉลี่ย',
      value: summaryStats.avgRating,
      unit: '/ 5.0',
      sub: 'คะแนนสะสมความสุขของลูกค้า',
      icon: <StarIcon sx={{ fontSize: 20 }} />,
      bg: 'rgba(255, 255, 255, 0.8)',
      border: 'rgba(245, 158, 11, 0.15)',
      iconBg: 'rgba(245, 158, 11, 0.06)',
      iconColor: '#ffdb1b', // Brand yellow icon
      titleColor: '#B45309',
      valueColor: '#0F172A',
      subColor: '#64748B',
      noClick: true,
    },
    {
      key: 'overdue',
      title: 'ค้างชำระค่างวดสะสม',
      value: summaryStats.overdueCount.toLocaleString(),
      unit: 'ราย',
      sub: 'ต้องเร่งโทรเจรจาติดตามหนี้ด่วน',
      icon: <WarningAmberIcon sx={{ fontSize: 20 }} />,
      bg: 'rgba(255, 255, 255, 0.8)',
      border: 'rgba(239, 68, 68, 0.18)',
      iconBg: 'rgba(239, 68, 68, 0.06)',
      iconColor: '#EF4444',
      titleColor: '#B91C1C',
      valueColor: '#EF4444', // Dark Red warning text color
      subColor: '#EF4444',
      pulse: true,
      noClick: true,
    },
    {
      key: '__sat',
      title: 'เปอร์เซ็นต์ความพึงพอใจ',
      value: `${summaryStats.satisfactionRate}%`,
      unit: 'ของลูกค้า',
      sub: 'ลูกค้าที่ประเมินพอใจขึ้นไป',
      icon: <SentimentSatisfiedAltIcon sx={{ fontSize: 20 }} />,
      bg: 'rgba(255, 255, 255, 0.8)',
      border: 'rgba(16, 185, 129, 0.15)',
      iconBg: 'rgba(16, 185, 129, 0.06)',
      iconColor: '#10B981',
      titleColor: '#047857',
      valueColor: '#0F172A',
      subColor: '#64748B',
      noClick: true,
    },
  ];

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2.5 }}>
      {cards.map(card => {
        const isActive = !card.noClick && selectedStatus === card.key;
        return (
          <Card
            key={card.key}
            onClick={card.noClick ? undefined : () => setSelectedStatus(isActive ? '' : card.key)}
            sx={{
              background: card.bg,
              backdropFilter: 'blur(20px)',
              border: '1px solid',
              borderColor: card.border,
              borderRadius: '20px',
              cursor: card.noClick ? 'default' : 'pointer',
              boxShadow: '0 10px 25px -10px rgba(0, 81, 186, 0.04), 0 1px 2px rgba(0, 0, 0, 0.01)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              ...(card.pulse && {
                animation: 'pulseGlow 2.5s infinite ease-in-out',
                '@keyframes pulseGlow': {
                  '0%': { boxShadow: '0 8px 24px -10px rgba(239, 68, 68, 0.1), 0 0 0 0px rgba(239, 68, 68, 0.15)' },
                  '50%': { boxShadow: '0 12px 30px -5px rgba(239, 68, 68, 0.2), 0 0 0 8px rgba(239, 68, 68, 0)' },
                  '100%': { boxShadow: '0 8px 24px -10px rgba(239, 68, 68, 0.1), 0 0 0 0px rgba(239, 68, 68, 0)' },
                }
              }),
              '&:hover': {
                transform: card.noClick ? 'translateY(-2px)' : 'translateY(-4px) scale(1.01)',
                boxShadow: card.pulse
                  ? '0 16px 36px -5px rgba(239, 68, 68, 0.25)'
                  : '0 15px 35px -10px rgba(0, 81, 186, 0.1), 0 2px 5px rgba(0, 0, 0, 0.02)',
                borderColor: card.iconColor,
              },
            }}
          >
            {/* Soft inner card ambient highlight glows */}
            <Box sx={{
              position: 'absolute', top: -35, right: -35, width: 85, height: 85,
              borderRadius: '50%', background: `radial-gradient(circle, ${card.iconColor}10 0%, transparent 75%)`,
              filter: 'blur(10px)', pointerEvents: 'none'
            }} />

            <CardContent sx={{ p: '24px !important' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{
                  fontSize: '0.6875rem', fontWeight: 800, color: card.titleColor,
                  textTransform: 'uppercase', letterSpacing: '0.08em'
                }}>
                  {card.title}
                </Typography>
                <Box sx={{
                  width: 34, height: 34, borderRadius: 2.5, bgcolor: card.iconBg,
                  color: card.iconColor === '#ffdb1b' ? '#D97706' : card.iconColor, // Adjust dark contrast for yellow icon box
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '.MuiCard-root:hover &': {
                    transform: 'scale(1.1) rotate(6deg)',
                  }
                }}>
                  {card.icon}
                </Box>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                  <Typography sx={{
                    fontSize: '2.125rem', fontWeight: 800, color: card.valueColor,
                    lineHeight: 1, letterSpacing: '-0.02em',
                  }}>
                    {card.value}
                  </Typography>
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: 'text.secondary', ml: 0.5 }}>
                    {card.unit}
                  </Typography>
                </Box>
                <Typography sx={{
                  fontSize: '0.6875rem', fontWeight: 700, color: card.subColor, mt: 1.5,
                  display: 'flex', alignItems: 'center', gap: 0.75
                }}>
                  <Box sx={{
                    width: 6, height: 6, borderRadius: '50%',
                    bgcolor: card.iconColor,
                    ...(card.pulse && {
                      animation: 'blinkDot 1.5s infinite ease-in-out',
                      '@keyframes blinkDot': {
                        '0%': { opacity: 0.4 },
                        '50%': { opacity: 1 },
                        '100%': { opacity: 0.4 },
                      }
                    })
                  }} />
                  {card.sub}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        );
      })}
    </Box >
  );
}
