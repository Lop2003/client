import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import StoreIcon from '@mui/icons-material/Store';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartTooltip, ResponsiveContainer,
  Cell, PieChart, Pie, LineChart, Line, CartesianGrid, AreaChart, Area
} from 'recharts';

const CustomTooltip = ({ active, payload, unit = 'ราย' }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{
      bgcolor: 'rgba(15, 23, 42, 0.9)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      color: '#ffffff',
      p: 1.5,
      borderRadius: '12px',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
    }}>
      <Typography sx={{
        fontSize: '0.625rem', color: '#94A3B8', fontWeight: 800,
        textTransform: 'uppercase', letterSpacing: '0.08em', mb: 0.5
      }}>
        {payload[0].payload.name}
      </Typography>
      <Typography sx={{ fontSize: '0.9375rem', fontWeight: 900, color: '#38BDF8' }}>
        {payload[0].value.toLocaleString()} <Box component="span" sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#94A3B8' }}>{unit}</Box>
      </Typography>
    </Box>
  );
};

export default function DashboardCharts({
  branchStats = [],
  summaryStats = { positiveCount: 0, neutralCount: 0, negativeCount: 0, weeklyCSAT: [4.0, 4.0, 4.0, 4.0] },
  selectedBranch = '',
  setSelectedBranch = () => { },
}) {

  // 1. Bar chart: customers by branch (All branches)
  const branchCountsData = useMemo(() => {
    const sortedStats = [...branchStats].sort((a, b) => b.customer_count - a.customer_count);
    return sortedStats.map(stat => ({
      name: stat.branch,
      count: stat.customer_count,
      isSelected: selectedBranch === stat.branch,
    }));
  }, [branchStats, selectedBranch]);

  // 2. Pie chart: sentiment proportion
  const sentimentData = useMemo(() => {
    const total = (summaryStats.positiveCount + summaryStats.neutralCount + summaryStats.negativeCount) || 1;
    const pos = summaryStats.positiveCount;
    const neu = summaryStats.neutralCount;
    const neg = summaryStats.negativeCount;
    const pPos = Math.round((pos / total) * 100);
    const pNeu = Math.round((neu / total) * 100);
    const pNeg = Math.round((neg / total) * 100);
    return {
      percentage: pPos,
      chartData: [
        { name: 'พอใจ (Positive)', value: pPos, color: '#10B981' },
        { name: 'เฉยๆ (Neutral)', value: pNeu, color: '#F59E0B' },
        { name: 'ไม่พอใจ (Negative)', value: pNeg, color: '#EF4444' },
      ],
    };
  }, [summaryStats]);

  // 3. Line chart: weekly CSAT trend (represented beautifully with an Area glowing fill)
  const weeklyTrendsData = useMemo(() => {
    const csat = summaryStats.weeklyCSAT || [4.0, 4.0, 4.0, 4.0];
    return csat.map((score, i) => ({
      name: `สัปดาห์ ${i + 1}`,
      score: score,
    }));
  }, [summaryStats]);

  const handleBarClick = (data) => {
    if (data?.name) {
      setSelectedBranch(selectedBranch === data.name ? '' : data.name);
    }
  };

  const cardSx = {
    borderRadius: '24px',
    overflow: 'visible',
    background: 'rgba(255, 255, 255, 0.75)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    boxShadow: '0 10px 30px -10px rgba(0, 81, 186, 0.05), 0 1px 3px rgba(0, 0, 0, 0.01)',
  };

  const CardHeader = ({ iconBg, iconColor, icon, title, subtitle }) => (
    <Box sx={{
      display: 'flex', alignItems: 'center', gap: 1.75, mb: 3, pb: 2,
      borderBottom: '1px solid rgba(226, 232, 240, 0.8)'
    }}>
      <Box sx={{
        width: 36, height: 36, borderRadius: 2.5, bgcolor: iconBg,
        color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 4px 10px ${iconColor}15`
      }}>
        {icon}
      </Box>
      <Box>
        <Typography sx={{
          fontSize: '0.75rem', fontWeight: 800, color: 'text.primary',
          textTransform: 'uppercase', letterSpacing: '0.05em'
        }}>
          {title}
        </Typography>
        <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary', fontWeight: 500 }}>{subtitle}</Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(3, 1fr)' }, gap: 3.5 }}>

      {/* ── 1. Bar Chart: ลูกค้าจำแนกรายสาขา ── */}
      <Card sx={cardSx}>
        <CardContent sx={{ p: '24px !important' }}>
          <CardHeader
            iconBg="rgba(0, 81, 186, 0.06)" iconColor="#0051BA"
            icon={<StoreIcon sx={{ fontSize: 18 }} />}
            title="ลูกค้าแยกรายสาขา"
            subtitle="สัญญาทั้งหมดจำแนกตามพื้นที่สาขาให้บริการ"
          />
          <Box sx={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={branchCountsData}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                onClick={e => e?.activePayload && handleBarClick(e.activePayload[0].payload)}
              >
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0051BA" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="#ffdb1b" stopOpacity={0.9} />
                  </linearGradient>
                  <linearGradient id="barSelectedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffdb1b" stopOpacity={1} />
                    <stop offset="100%" stopColor="#0051BA" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(226, 232, 240, 0.6)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false}
                  tick={{ fontSize: 9, fontWeight: 700, fill: '#64748B' }} />
                <YAxis axisLine={false} tickLine={false}
                  tick={{ fontSize: 9, fontWeight: 600, fill: '#94A3B8' }} allowDecimals={false} />
                <RechartTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,81,186,0.03)', radius: 8 }} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={28} cursor="pointer">
                  {branchCountsData.map((entry, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={entry.isSelected ? 'url(#barSelectedGradient)' : selectedBranch ? 'rgba(0, 81, 186, 0.15)' : 'url(#barGradient)'}
                      style={{
                        filter: entry.isSelected ? 'drop-shadow(0px 4px 10px rgba(0, 81, 186, 0.25))' : 'none',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>

      {/* ── 2. Pie Chart: สัดส่วน Sentiment ── */}
      <Card sx={cardSx}>
        <CardContent sx={{ p: '24px !important' }}>
          <CardHeader
            iconBg="rgba(16, 185, 129, 0.06)" iconColor="#10B981"
            icon={<EmojiEmotionsIcon sx={{ fontSize: 18 }} />}
            title="สัดส่วน Sentiment ความรู้สึก"
            subtitle="ผลลัพธ์การวิเคราะห์อารมณ์ในข้อความติชม"
          />
          <Box sx={{
            height: 260, display: 'flex', flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center', justifyContent: 'center', gap: 3.5, px: 1
          }}>
            <Box sx={{ position: 'relative', width: 140, height: 140, flexShrink: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <RechartTooltip content={<CustomTooltip unit="%" />} />
                  <Pie
                    data={sentimentData.chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                    cornerRadius={4}
                  >
                    {sentimentData.chartData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} style={{ filter: `drop-shadow(0 2px 4px ${entry.color}20)` }} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <Box sx={{
                position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', pointerEvents: 'none'
              }}>
                <Typography sx={{
                  fontSize: '0.625rem', color: 'text.disabled', fontWeight: 800,
                  textTransform: 'uppercase', letterSpacing: '0.08em'
                }}>เชิงบวก</Typography>
                <Typography sx={{ fontSize: '1.25rem', fontWeight: 900, color: '#10B981', fontFamily: '"Plus Jakarta Sans", sans-serif', lineHeight: 1.1 }}>
                  {sentimentData.percentage}%
                </Typography>
              </Box>
            </Box>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
              {sentimentData.chartData.map((d, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1.5 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: d.color, boxShadow: `0 0 6px ${d.color}`, flexShrink: 0 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', flex: 1 }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.primary' }}>
                      {d.name.split(' ')[0]}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: 'text.primary', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                      {d.value}%
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* ── 3. Line Chart: แนวโน้มคะแนน CSAT ── */}
      <Card sx={cardSx}>
        <CardContent sx={{ p: '24px !important' }}>
          <CardHeader
            iconBg="rgba(245, 158, 11, 0.06)" iconColor="#F59E0B"
            icon={<TrendingUpIcon sx={{ fontSize: 18 }} />}
            title="แนวโน้มคะแนน CSAT"
            subtitle="ค่าคะแนนเฉลี่ยความพอใจรายสัปดาห์ (1-5 ดาว)"
          />
          <Box sx={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyTrendsData} margin={{ top: 15, right: 15, left: -25, bottom: 5 }}>
                <defs>
                  <linearGradient id="areaGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0051BA" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#0051BA" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(226, 232, 240, 0.6)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false}
                  tick={{ fontSize: 9, fontWeight: 700, fill: '#64748B' }} />
                <YAxis axisLine={false} tickLine={false} domain={[1, 5]}
                  tick={{ fontSize: 9, fontWeight: 600, fill: '#94A3B8' }} tickCount={5} />
                <RechartTooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <Box sx={{
                        bgcolor: 'rgba(15, 23, 42, 0.9)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#ffffff',
                        p: 1.25,
                        borderRadius: '10px',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.25)'
                      }}>
                        <Typography sx={{ fontSize: '0.625rem', color: '#94A3B8', mb: 0.5, letterSpacing: '0.02em' }}>
                          {payload[0].payload.name}
                        </Typography>
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 900, color: '#F59E0B' }}>
                          {payload[0].value.toFixed(2)} <Box component="span" sx={{ fontSize: '0.75rem' }}>★</Box>
                        </Typography>
                      </Box>
                    );
                  }}
                />
                <Area type="monotone" dataKey="score" stroke="none" fill="url(#areaGlow)" />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#0051BA"
                  strokeWidth={4.5}
                  dot={{ r: 5, strokeWidth: 2, fill: '#ffffff', stroke: '#0051BA' }}
                  activeDot={{ r: 7, strokeWidth: 2.5, fill: '#ffffff', stroke: '#6366F1' }}
                  style={{ filter: 'drop-shadow(0px 4px 6px rgba(0, 81, 186, 0.2))' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>

    </Box>
  );
}
