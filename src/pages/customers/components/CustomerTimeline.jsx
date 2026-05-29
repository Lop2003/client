import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import CheckIcon from '@mui/icons-material/Check';
import CircularProgress from '@mui/material/CircularProgress';
import { useToast } from '../../../components/Toast';
import { updateFollowUpStatus } from '../../../services/followUpMutations';
import { getFollowUpType } from '../../../utils/statusHelpers';
import { formatDate } from '../../../utils/formatters';

export default function CustomerTimeline({ followUps = [], customerId, onRefresh }) {
  const { showToast } = useToast();
  const [updatingId, setUpdatingId] = useState(null);

  const handleComplete = async (followUpId) => {
    setUpdatingId(followUpId);
    try {
      await updateFollowUpStatus(followUpId, 'done');
      showToast('success', 'บันทึกการติดตามดำเนินการเรียบร้อยแล้ว');
      if (onRefresh) await onRefresh();
    } catch (err) {
      console.error('Failed to update follow up:', err);
      showToast('error', 'ไม่สามารถปรับปรุงสถานะการติดตามได้');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <Box sx={{
      bgcolor: '#ffffff',
      borderRadius: '20px',
      border: '1px solid rgba(226, 232, 240, 0.8)',
      boxShadow: '0 8px 30px rgba(0, 81, 186, 0.02)',
      p: 3
    }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, pb: 2, borderBottom: '1px solid rgba(226, 232, 240, 0.8)' }}>
        <Box sx={{
          width: 34, height: 34, borderRadius: 2.5,
          bgcolor: 'rgba(99, 102, 241, 0.08)',
          color: 'secondary.main',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(99, 102, 241, 0.1)'
        }}>
          <AssignmentIcon sx={{ fontSize: 18 }} />
        </Box>
        <Box>
          <Typography sx={{
            fontSize: '0.75rem', fontWeight: 800, color: 'text.primary',
            textTransform: 'uppercase', letterSpacing: '0.05em'
          }}>
            บันทึกการติดตามความคืบหน้า (Timeline)
          </Typography>
          <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary', fontWeight: 500 }}>
            ประวัติการประสานงานและแนวทางการดูแลผู้บริโภค
          </Typography>
        </Box>
      </Box>

      {/* Logs timeline list */}
      {followUps.length === 0 ? (
        <Box sx={{ py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 48, height: 48, borderRadius: '50%',
            bgcolor: 'rgba(148, 163, 184, 0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'text.disabled'
          }}>
            <AccessTimeFilledIcon sx={{ fontSize: 24, opacity: 0.6 }} />
          </Box>
          <Typography sx={{ fontSize: '0.75rem', color: 'text.disabled', fontWeight: 600 }}>
            ยังไม่มีประวัติการโทรหรือติดตามลูกค้ารายนี้
          </Typography>
        </Box>
      ) : (
        <Box sx={{ position: 'relative', pl: 1, maxHeight: 360, overflowY: 'auto', pr: 0.5 }}>
          {followUps.map((fu, idx) => {
            const typeInfo = getFollowUpType(fu.type);
            const isDone = fu.status === 'done';
            const isPending = fu.status === 'pending';

            return (
              <Box key={fu.id} sx={{ position: 'relative', pl: 4, pb: 3.5 }}>
                
                {/* Vertical timeline track line */}
                {idx < followUps.length - 1 && (
                  <Box sx={{
                    position: 'absolute', left: 7, top: 22, bottom: -14,
                    width: 2,
                    background: isDone 
                      ? 'linear-gradient(180deg, #10B981 0%, rgba(226, 232, 240, 0.8) 100%)' 
                      : 'rgba(226, 232, 240, 0.8)',
                    zIndex: 0
                  }} />
                )}

                {/* Interactive timeline node dot */}
                <Box sx={{
                  position: 'absolute', left: 0, top: 4, width: 16, height: 16,
                  borderRadius: '50%',
                  bgcolor: isDone ? '#10B981' : typeInfo.color,
                  border: '3px solid #ffffff',
                  boxShadow: isDone 
                    ? '0 0 0 3px rgba(16, 185, 129, 0.15), 0 2px 4px rgba(0,0,0,0.1)' 
                    : `0 0 0 3px ${typeInfo.color}15, 0 2px 4px rgba(0,0,0,0.1)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 1,
                  transition: 'all 0.25s ease'
                }}>
                  {isDone ? (
                    <CheckIcon sx={{ fontSize: 8, color: '#ffffff', strokeWidth: 3 }} />
                  ) : (
                    <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#ffffff' }} />
                  )}
                </Box>

                {/* Glass detail block */}
                <Box sx={{
                  bgcolor: 'rgba(248, 250, 252, 0.75)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  p: 2.25,
                  border: '1px solid rgba(226, 232, 240, 0.6)',
                  boxShadow: '0 4px 15px rgba(0, 81, 186, 0.01)',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    bgcolor: 'rgba(248, 250, 252, 0.95)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 6px 18px rgba(0, 81, 186, 0.025)',
                    borderColor: isDone ? 'rgba(16, 185, 129, 0.3)' : 'rgba(99, 102, 241, 0.2)'
                  }
                }}>
                  {/* Top: Date and Type Badge */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
                    <Chip
                      label={typeInfo.label}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.625rem',
                        fontWeight: 800,
                        borderRadius: '6px',
                        bgcolor: `${typeInfo.color}10`,
                        color: typeInfo.color,
                        border: `1.5px solid ${typeInfo.color}25`
                      }}
                    />
                    <Typography sx={{ fontSize: '0.6875rem', color: 'text.disabled', fontWeight: 700, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                      {formatDate(fu.created_at)}
                    </Typography>
                  </Box>

                  {/* Log description card */}
                  <Typography sx={{
                    fontSize: '0.75rem',
                    color: 'text.primary',
                    fontWeight: 500,
                    lineHeight: 1.6,
                    bgcolor: '#ffffff',
                    p: 1.5,
                    borderRadius: '10px',
                    border: '1px solid rgba(226, 232, 240, 0.6)',
                    mb: 1.75
                  }}>
                    {fu.note}
                  </Typography>

                  {/* Actions & Author Footer */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                    <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary', fontWeight: 600 }}>
                      ผู้บันทึก: ฝ่ายลูกค้าสัมพันธ์ uFriend
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {/* Done update action button */}
                      {isPending && (
                        <Button
                          size="small"
                          variant="outlined"
                          disabled={updatingId === fu.id}
                          startIcon={updatingId === fu.id ? <CircularProgress size={10} color="inherit" /> : <CheckIcon sx={{ fontSize: '10px !important' }} />}
                          onClick={() => handleComplete(fu.id)}
                          sx={{
                            fontSize: '0.625rem',
                            height: 22,
                            px: 1.25,
                            borderRadius: '6px',
                            borderColor: 'primary.main',
                            color: 'primary.main',
                            fontWeight: 700,
                            '&:hover': {
                              bgcolor: 'primary.main',
                              color: '#ffffff',
                            }
                          }}
                        >
                          เสร็จสิ้นงาน
                        </Button>
                      )}

                      {/* Status chip */}
                      <Chip
                        icon={isDone ? <CheckCircleIcon sx={{ fontSize: '11px !important', color: 'inherit !important' }} /> : undefined}
                        label={isDone ? 'สำเร็จเรียบร้อย' : 'อยู่ระหว่างดำเนินการ'}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.625rem',
                          fontWeight: 800,
                          borderRadius: '6px',
                          ...(isDone
                            ? { bgcolor: '#E8FDF0', color: '#10B981', border: '1.5px solid rgba(16, 185, 129, 0.2)' }
                            : { bgcolor: '#FFF1F2', color: '#EF4444', border: '1.5px solid rgba(239, 68, 68, 0.2)' }
                          )
                        }}
                      />
                    </Box>
                  </Box>

                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
