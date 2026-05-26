import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import PeopleIcon from '@mui/icons-material/People';
import StarIcon from '@mui/icons-material/Star';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import { useCX } from '../../hooks/useCX';

export default function DashboardCards() {
  const { summaryStats, selectedStatus, setSelectedStatus } = useCX();

  const cards = [
    {
      key: '',
      title: 'ลูกค้าทั้งหมด',
      value: summaryStats.totalCustomers,
      unit: 'ราย',
      sub: 'จำนวนลูกค้าสะสมในระบบ',
      icon: <PeopleIcon sx={{ fontSize: 22 }} />,
      bg: 'linear-gradient(135deg, rgba(239,246,255,0.9) 0%, rgba(219,234,254,0.4) 100%)',
      iconBg: 'rgba(0,81,186,0.1)',
      iconColor: '#0051BA',
      titleColor: '#1e3a8a',
      valueColor: '#1e3a8a',
      subColor: 'rgba(0,81,186,0.7)',
      ring: '#0051BA',
    },
    {
      key: '__avg',
      title: 'คะแนนเฉลี่ย',
      value: summaryStats.avgRating,
      unit: '/ 5.0',
      sub: 'คะแนนความพึงพอใจสะสม',
      icon: <StarIcon sx={{ fontSize: 22 }} />,
      bg: 'linear-gradient(135deg, rgba(255,251,235,0.9) 0%, rgba(254,243,199,0.4) 100%)',
      iconBg: '#fef3c7',
      iconColor: '#92400E',
      titleColor: '#78350f',
      valueColor: '#78350f',
      subColor: 'rgba(146,64,14,0.7)',
      ring: '#f59e0b',
      noClick: true,
    },
    {
      key: 'overdue',
      title: 'ค้างชำระ',
      value: summaryStats.overdueCount,
      unit: 'ราย',
      sub: '🚨 เร่งโทรเจรจาติดตามหนี้ด่วน',
      icon: <WarningAmberIcon sx={{ fontSize: 22 }} />,
      bg: 'linear-gradient(135deg, #fff0f2 0%, #ffe3e7 100%)',
      iconBg: '#fee2e2',
      iconColor: '#C81E1E',
      titleColor: '#C81E1E',
      valueColor: '#C81E1E',
      subColor: '#C81E1E',
      ring: '#C81E1E',
      pulse: true,
    },
    {
      key: '__sat',
      title: '% พอใจ',
      value: `${summaryStats.satisfactionRate}%`,
      unit: 'ของลูกค้า',
      sub: 'ลูกค้าประเมินความพึงพอใจ',
      icon: <SentimentSatisfiedAltIcon sx={{ fontSize: 22 }} />,
      bg: 'linear-gradient(135deg, rgba(236,253,245,0.9) 0%, rgba(209,250,229,0.4) 100%)',
      iconBg: '#d1fae5',
      iconColor: '#057A55',
      titleColor: '#065f46',
      valueColor: '#065f46',
      subColor: 'rgba(5,122,85,0.7)',
      ring: '#057A55',
      noClick: true,
    },
  ];

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', xl: 'repeat(4, 1fr)' }, gap: 2.5 }}>
      {cards.map(card => {
        const isActive = !card.noClick && selectedStatus === card.key;
        return (
          <Card
            key={card.key}
            onClick={card.noClick ? undefined : () => setSelectedStatus(isActive ? '' : card.key)}
            sx={{
              background: card.bg,
              border: '1px solid',
              borderColor: isActive ? card.ring : 'rgba(255,255,255,0.6)',
              borderRadius: 4,
              cursor: card.noClick ? 'default' : 'pointer',
              transition: 'all 0.25s',
              boxShadow: isActive
                ? `0 0 0 2px ${card.ring}, 6px 6px 15px rgba(163,177,198,0.3)`
                : '6px 6px 15px rgba(163,177,198,0.3),-6px -6px 15px rgba(255,255,255,0.7)',
              transform: isActive ? 'scale(1.02)' : 'none',
              position: 'relative', overflow: 'hidden',
              animation: card.pulse && !isActive ? 'none' : 'none',
              '&:hover': card.noClick ? {} : {
                transform: isActive ? 'scale(1.02)' : 'translateY(-4px)',
                boxShadow: isActive
                  ? `0 0 0 2px ${card.ring}, 8px 8px 20px rgba(163,177,198,0.4)`
                  : '6px 6px 20px rgba(163,177,198,0.45),-6px -6px 20px rgba(255,255,255,0.8)',
              },
              '&:active': card.noClick ? {} : { transform: 'scale(0.98)' },
            }}
          >
            <CardContent sx={{ p: '16px !important' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography sx={{ fontSize: '0.625rem', fontWeight: 800, color: card.titleColor,
                                  textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {card.title}
                </Typography>
                <Box sx={{ width: 32, height: 32, borderRadius: 2, bgcolor: card.iconBg,
                            color: card.iconColor, display: 'flex', alignItems: 'center',
                            justifyContent: 'center', transition: 'transform 0.3s',
                            '.MuiCard-root:hover &': card.noClick ? {} : { transform: 'rotate(6deg) scale(1.1)' } }}>
                  {card.icon}
                </Box>
              </Box>
              <Box sx={{ mt: 1 }}>
                <Typography sx={{ fontSize: '1.75rem', fontWeight: 800, color: card.valueColor, lineHeight: 1.1 }}>
                  {card.value}{' '}
                  <Box component="span" sx={{ fontSize: '0.6875rem', fontWeight: 600, opacity: 0.7 }}>
                    {card.unit}
                  </Box>
                </Typography>
                <Typography sx={{ fontSize: '0.5625rem', fontWeight: 700, color: card.subColor, mt: 1,
                                  display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {!card.sub.startsWith('🚨') && (
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: card.iconColor, flexShrink: 0 }} />
                  )}
                  {card.sub}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
}
