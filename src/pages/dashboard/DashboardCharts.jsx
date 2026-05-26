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
  Cell, PieChart, Pie, LineChart, Line, CartesianGrid,
} from 'recharts';
import { useCX } from '../../hooks/useCX';

const CustomTooltip = ({ active, payload, unit = 'ราย' }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ bgcolor: '#1e293b', border: '1px solid #334155', color: '#fff',
                p: 1.25, borderRadius: 2, boxShadow: 4 }}>
      <Typography sx={{ fontSize: '0.6875rem', color: '#94a3b8', fontWeight: 800,
                        textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.25 }}>
        {payload[0].payload.name}
      </Typography>
      <Typography sx={{ fontSize: '0.875rem', fontWeight: 900 }}>
        {payload[0].value} {unit}
      </Typography>
    </Box>
  );
};

export default function DashboardCharts() {
  const { branchStats, filteredFeedbacks, selectedBranch, setSelectedBranch } = useCX();

  // 1. Bar chart: customers by branch (top 5)
  const branchCountsData = useMemo(() => {
    const topStats = [...branchStats].sort((a, b) => b.customer_count - a.customer_count).slice(0, 5);
    return topStats.map(stat => ({
      name: stat.branch,
      count: stat.customer_count,
      isSelected: selectedBranch === stat.branch,
    }));
  }, [branchStats, selectedBranch]);

  // 2. Pie chart: sentiment proportion
  const sentimentData = useMemo(() => {
    const total = filteredFeedbacks.length || 1;
    const pos = filteredFeedbacks.filter(fb => fb.sentiment === 'positive').length;
    const neu = filteredFeedbacks.filter(fb => fb.sentiment === 'neutral').length;
    const neg = filteredFeedbacks.filter(fb => fb.sentiment === 'negative').length;
    const pPos = Math.round((pos / total) * 100);
    const pNeu = Math.round((neu / total) * 100);
    const pNeg = Math.round((neg / total) * 100);
    return {
      percentage: pPos,
      chartData: [
        { name: 'พอใจ (Positive)',   value: pPos, color: '#057A55' },
        { name: 'เฉยๆ (Neutral)',    value: pNeu, color: '#92400E' },
        { name: 'ไม่พอใจ (Negative)', value: pNeg, color: '#C81E1E' },
      ],
    };
  }, [filteredFeedbacks]);

  // 3. Line chart: weekly CSAT trend
  const weeklyTrendsData = useMemo(() => {
    if (filteredFeedbacks.length === 0) {
      return [1,2,3,4].map(i => ({ name: `สัปดาห์ ${i}`, score: 4.0 }));
    }
    const sorted = [...filteredFeedbacks].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    const minTime = new Date(sorted[0].created_at).getTime();
    const maxTimeRaw = new Date(sorted[sorted.length - 1].created_at).getTime();
    const maxTime = minTime === maxTimeRaw ? minTime + 1000 * 60 * 60 * 24 * 28 : maxTimeRaw;
    const interval = (maxTime - minTime) / 4;
    let lastAvg = 4.0;
    return [0, 1, 2, 3].map(i => {
      const start = minTime + i * interval;
      const end = start + interval;
      const periodFbs = sorted.filter(fb => {
        const t = new Date(fb.created_at).getTime();
        return t >= start && t < end;
      });
      let avg = lastAvg;
      if (periodFbs.length > 0) {
        avg = periodFbs.reduce((acc, f) => acc + f.rating, 0) / periodFbs.length;
        lastAvg = avg;
      }
      return { name: `สัปดาห์ ${i + 1}`, score: parseFloat(avg.toFixed(1)) };
    });
  }, [filteredFeedbacks]);

  const handleBarClick = (data) => {
    if (data?.name) {
      setSelectedBranch(selectedBranch === data.name ? '' : data.name);
    }
  };

  const cardSx = {
    borderRadius: 4, overflow: 'visible',
    boxShadow: '6px 6px 15px rgba(163,177,198,0.3),-6px -6px 15px rgba(255,255,255,0.8)',
    border: '1px solid rgba(255,255,255,0.6)',
  };

  const CardHeader = ({ iconBg, iconColor, icon, title, subtitle }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5, pb: 2,
                borderBottom: '1px solid #f3f4f6' }}>
      <Box sx={{ width: 32, height: 32, borderRadius: 2, bgcolor: iconBg,
                  color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </Box>
      <Box>
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: '#111827',
                          textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </Typography>
        <Typography sx={{ fontSize: '0.6875rem', color: '#64748b' }}>{subtitle}</Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(3, 1fr)' }, gap: 3 }}>

      {/* ── 1. Bar Chart: ลูกค้าจำแนกรายสาขา ── */}
      <Card sx={cardSx}>
        <CardContent sx={{ p: '24px !important' }}>
          <CardHeader
            iconBg="#eff6ff" iconColor="#0051BA"
            icon={<StoreIcon sx={{ fontSize: 18 }} />}
            title="ลูกค้าจำแนกรายสาขา"
            subtitle="ประมวลจำนวนสัญญาแยกแต่ละพื้นที่สาขา"
          />
          <Box sx={{ height: 256 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={branchCountsData}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                onClick={e => e?.activePayload && handleBarClick(e.activePayload[0].payload)}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false}
                  tick={{ fontSize: 9, fontWeight: 700, fill: '#6b7280' }} />
                <YAxis axisLine={false} tickLine={false}
                  tick={{ fontSize: 9, fill: '#9ca3af' }} allowDecimals={false} />
                <RechartTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,81,186,0.04)', radius: 8 }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={32} cursor="pointer">
                  {branchCountsData.map((entry, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={entry.isSelected ? '#003a8c' : selectedBranch ? 'rgba(0,81,186,0.25)' : '#0051BA'}
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
            iconBg="#ecfdf5" iconColor="#057A55"
            icon={<EmojiEmotionsIcon sx={{ fontSize: 18 }} />}
            title="สัดส่วน Sentiment"
            subtitle="วิเคราะห์อารมณ์รวมของคำประเมินติชม"
          />
          <Box sx={{ height: 256, display: 'flex', flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: 'center', justifyContent: 'center', gap: 3, px: 1 }}>
            <Box sx={{ position: 'relative', width: 144, height: 144, flexShrink: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <RechartTooltip content={<CustomTooltip unit="%" />} />
                  <Pie data={sentimentData.chartData} cx="50%" cy="50%"
                    innerRadius={48} outerRadius={66} paddingAngle={3} dataKey="value">
                    {sentimentData.chartData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                          alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                <Typography sx={{ fontSize: '0.6875rem', color: '#9ca3af', fontWeight: 800,
                                  textTransform: 'uppercase', letterSpacing: '0.05em' }}>เชิงบวก</Typography>
                <Typography sx={{ fontSize: '1rem', fontWeight: 900, color: '#057A55' }}>
                  {sentimentData.percentage}%
                </Typography>
              </Box>
            </Box>
            <Box sx={{ flex: 1, space: 1.5 }}>
              {sentimentData.chartData.map((d, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: d.color, flexShrink: 0 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', flex: 1 }}>
                    <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, color: '#374151' }}>
                      {d.name.split(' ')[0]}
                    </Typography>
                    <Typography sx={{ fontSize: '0.6875rem', fontWeight: 800, color: '#111827' }}>
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
            iconBg="#fffbeb" iconColor="#92400E"
            icon={<TrendingUpIcon sx={{ fontSize: 18 }} />}
            title="แนวโน้มคะแนน CSAT"
            subtitle="ประวัติค่าเฉลี่ยคะแนนความพอใจรายสัปดาห์"
          />
          <Box sx={{ height: 256 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyTrendsData} margin={{ top: 20, right: 15, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false}
                  tick={{ fontSize: 9, fontWeight: 700, fill: '#6b7280' }} />
                <YAxis axisLine={false} tickLine={false} domain={[1, 5]}
                  tick={{ fontSize: 9, fill: '#9ca3af' }} tickCount={5} />
                <RechartTooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <Box sx={{ bgcolor: '#1e293b', border: '1px solid #334155', color: '#fff',
                                  p: 1, borderRadius: 2, boxShadow: 4 }}>
                        <Typography sx={{ fontSize: '0.6875rem', color: '#94a3b8', mb: 0.25 }}>
                          {payload[0].payload.name}
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 900, color: '#fbbf24' }}>
                          {payload[0].value.toFixed(1)} ★
                        </Typography>
                      </Box>
                    );
                  }}
                />
                <Line type="monotone" dataKey="score" stroke="#0051BA" strokeWidth={3}
                  dot={{ r: 5, strokeWidth: 1.5, fill: '#0051BA', stroke: '#fff' }}
                  activeDot={{ r: 7, strokeWidth: 2, fill: '#003a8c', stroke: '#fff' }} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>

    </Box>
  );
}
