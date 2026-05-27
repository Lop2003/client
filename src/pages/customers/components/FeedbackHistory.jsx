import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { getSentiment, getFeedbackCategory } from '../../../utils/statusHelpers';
import { formatDate } from '../../../utils/formatters';

export default function FeedbackHistory({ feedbacks }) {
  const sorted = [...feedbacks].sort((a, b) => b.rating - a.rating);
  return (
    <Box sx={{
      bgcolor: '#ffffff',
      borderRadius: '20px',
      border: '1px solid rgba(226, 232, 240, 0.8)',
      boxShadow: '0 8px 30px rgba(0, 81, 186, 0.02)',
      p: 3
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, pb: 2, borderBottom: '1px solid rgba(226, 232, 240, 0.8)' }}>
        <Box sx={{
          width: 34, height: 34, borderRadius: 2.5,
          bgcolor: 'rgba(0, 81, 186, 0.06)',
          color: 'primary.main',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(0, 81, 186, 0.1)'
        }}>
          <ChatBubbleOutlineIcon sx={{ fontSize: 18 }} />
        </Box>
        <Box>
          <Typography sx={{
            fontSize: '0.75rem', fontWeight: 800, color: 'text.primary',
            textTransform: 'uppercase', letterSpacing: '0.05em'
          }}>
            ประวัติการบันทึกคำติชม (Feedback History)
          </Typography>
          <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary', fontWeight: 500 }}>
            ข้อมูลประเมินและระดับความพึงพอใจการให้บริการ
          </Typography>
        </Box>
      </Box>

      {sorted.length === 0 ? (
        <Box sx={{ py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 48, height: 48, borderRadius: '50%',
            bgcolor: 'rgba(148, 163, 184, 0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'text.disabled'
          }}>
            <ChatBubbleOutlineIcon sx={{ fontSize: 24, opacity: 0.6 }} />
          </Box>
          <Typography sx={{ fontSize: '0.75rem', color: 'text.disabled', fontWeight: 600 }}>
            ยังไม่มีประวัติคำประเมินติชมจากลูกค้าคนนี้
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 360, overflowY: 'auto', pr: 0.5 }}>
          {sorted.map(fb => {
            const sent = getSentiment(fb.sentiment);
            return (
              <Box
                key={fb.id}
                sx={{
                  p: 2,
                  borderRadius: '16px',
                  bgcolor: 'rgba(248, 250, 252, 0.55)',
                  border: '1.5px solid',
                  borderColor: sent.borderColor,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'rgba(248, 250, 252, 0.95)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.015)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rating
                      value={fb.rating}
                      readOnly
                      size="small"
                      sx={{ '& .MuiRating-iconFilled': { color: '#f59e0b' } }}
                    />
                    <Chip
                      label={getFeedbackCategory(fb.category)}
                      size="small"
                      sx={{
                        fontSize: '0.5625rem',
                        fontWeight: 800,
                        height: 18,
                        borderRadius: '4px',
                        bgcolor: 'rgba(0, 81, 186, 0.05)',
                        color: 'primary.main',
                        border: '1px solid rgba(0, 81, 186, 0.1)'
                      }}
                    />
                  </Box>
                  <Typography sx={{ fontSize: '0.625rem', color: 'text.disabled', fontWeight: 700 }}>
                    {formatDate(fb.created_at, 'short')}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: '0.75rem', color: 'text.primary', fontWeight: 600, lineHeight: 1.5, mb: 1.25 }}>
                  "{fb.comment}"
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: sent.color }} />
                  <Typography sx={{ fontSize: '0.625rem', color: sent.color, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Sentiment: {sent.label}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
