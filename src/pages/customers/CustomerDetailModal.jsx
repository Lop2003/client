import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Rating from '@mui/material/Rating';
import Alert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TagIcon from '@mui/icons-material/Tag';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import AssignmentIcon from '@mui/icons-material/Assignment';
import WarningIcon from '@mui/icons-material/Warning';
import { useNavigate } from 'react-router-dom';
import { useCustomerDetail } from '../../hooks/useCustomerDetail';
import { getCustomerStatus, getSentiment, getFeedbackCategory } from '../../utils/statusHelpers';
import { formatDate, formatContractId } from '../../utils/formatters';
import { PATHS } from '../../routes/paths';
import CustomerTimeline from './CustomerTimeline';

// ─── Customer Info Card ──────────────────────────────────────────────────────
function CustomerInfoCard({ customer }) {
  const s = getCustomerStatus(customer.status);
  const isOverdue = customer.status === 'overdue';

  const infoItems = [
    { icon: <TagIcon sx={{ fontSize: 15 }} />, label: 'รหัสอ้างอิงสัญญา', value: formatContractId(customer.id), isCode: true },
    { icon: <SmartphoneIcon sx={{ fontSize: 15 }} />, label: 'สินค้าผ่อนชำระ', value: customer.product },
    { icon: <PhoneIcon sx={{ fontSize: 15 }} />, label: 'เบอร์ติดต่อลูกค้า', value: customer.phone, isCode: true },
    { icon: <LocationOnIcon sx={{ fontSize: 15 }} />, label: 'สาขาที่ทำรายการ', value: `สาขา${customer.branch}` },
    { icon: <AccessTimeFilledIcon sx={{ fontSize: 15 }} />, label: 'ระยะสัญญาทั้งหมด', value: `${customer.plan_months} เดือน` },
    { icon: <CalendarTodayIcon sx={{ fontSize: 15 }} />, label: 'วันที่เริ่มทำสัญญา', value: formatDate(customer.created_at, 'long') },
  ];

  return (
    <Box sx={{
      bgcolor: '#ffffff',
      borderRadius: '20px',
      border: '1px solid rgba(226, 232, 240, 0.8)',
      boxShadow: '0 8px 30px rgba(0, 81, 186, 0.02)',
      p: 3
    }}>
      <Box sx={{
        display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between',
        alignItems: 'center', gap: 2, pb: 2.5, borderBottom: '1px solid rgba(226, 232, 240, 0.8)', mb: 2.5
      }}>
        <Box>
          <Typography sx={{
            fontSize: '0.625rem', fontWeight: 800, color: 'text.disabled',
            textTransform: 'uppercase', letterSpacing: '0.1em', mb: 0.25
          }}>
            ข้อมูลบัญชีผู้ผ่อนชำระ
          </Typography>
          <Typography sx={{ fontSize: '1.25rem', fontWeight: 800, color: 'text.primary', letterSpacing: '-0.01em' }}>
            {customer.name}
          </Typography>
        </Box>
        <Chip
          label={s.label}
          variant="outlined"
          sx={{
            ...s.chipSx,
            fontSize: '0.6875rem',
            fontWeight: 800,
            height: 26,
            borderRadius: '6px',
            borderWidth: '1.5px !important'
          }}
        />
      </Box>

      {isOverdue && (
        <Alert
          severity="error"
          icon={<WarningIcon sx={{ fontSize: 20 }} />}
          sx={{ mb: 2.5 }}
        >
          <Typography sx={{ fontWeight: 800, fontSize: '0.75rem', mb: 0.5 }}>
            ระบบตรวจพบบัญชีมียอดค้างชำระ (Payment Overdue Case)
          </Typography>
          สัญญานี้มีจำนวนค้างชำระสะสม กรุณาดำเนินการโทรติดต่อประสานงาน แจ้งสิทธิพิเศษ หรือเจรจาประนอมหนี้ เพื่อช่วยแนะนำการจ่ายชำระโดยด่วนที่สุด
        </Alert>
      )}

      {/* Info Tiles Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }, gap: 2 }}>
        {infoItems.map((item, idx) => (
          <Box
            key={idx}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.75,
              bgcolor: 'rgba(248, 250, 252, 0.55)',
              border: '1px solid rgba(226, 232, 240, 0.6)',
              p: 2,
              borderRadius: '14px',
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: 'rgba(248, 250, 252, 0.9)',
                borderColor: 'rgba(0, 81, 186, 0.15)'
              }
            }}
          >
            <Box sx={{
              width: 32, height: 32, borderRadius: 2,
              bgcolor: '#ffffff', color: 'text.secondary',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
            }}>
              {item.icon}
            </Box>
            <Box>
              <Typography sx={{
                fontSize: '0.625rem', fontWeight: 800, color: 'text.disabled',
                textTransform: 'uppercase', letterSpacing: '0.08em', mb: 0.25
              }}>
                {item.label}
              </Typography>
              <Typography sx={{
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: 'text.primary',
                fontFamily: item.isCode ? 'monospace' : 'inherit',
                letterSpacing: item.isCode ? '0.02em' : 'inherit'
              }}>
                {item.value}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

// ─── Feedback History ────────────────────────────────────────────────────────
function FeedbackHistory({ feedbacks }) {
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
                  bgcolor: 'rgba(248, 250, 252, 0.75)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  p: 2.25,
                  border: '1px solid rgba(226, 232, 240, 0.6)',
                  boxShadow: '0 4px 15px rgba(0, 81, 186, 0.01)',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'rgba(248, 250, 252, 0.95)',
                    transform: 'translateY(-1px)',
                    borderColor: 'rgba(0, 81, 186, 0.2)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Rating value={fb.rating} readOnly size="small" sx={{ '& .MuiRating-iconFilled': { color: '#f59e0b' } }} />
                  <Typography sx={{ fontSize: '0.6875rem', color: 'text.disabled', fontWeight: 700, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                    {formatDate(fb.created_at)}
                  </Typography>
                </Box>
                <Typography sx={{
                  fontSize: '0.75rem', color: 'text.primary', fontWeight: 600,
                  fontStyle: 'italic', lineHeight: 1.6, mb: 2,
                  bgcolor: '#ffffff', p: 1.5, borderRadius: '10px',
                  border: '1px solid rgba(226, 232, 240, 0.6)'
                }}>
                  "{fb.comment}"
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    label={`หมวดหมู่: ${getFeedbackCategory(fb.category)}`}
                    size="small"
                    sx={{
                      height: 20, fontSize: '0.625rem', fontWeight: 800, borderRadius: '6px',
                      bgcolor: 'rgba(0, 81, 186, 0.06)', color: 'primary.main',
                      border: '1px solid rgba(0, 81, 186, 0.12)'
                    }}
                  />
                  <Chip
                    label={`อารมณ์: ${sent.label}`}
                    size="small"
                    sx={{
                      height: 20, fontSize: '0.625rem', fontWeight: 800, borderRadius: '6px',
                      ...sent.sx,
                      border: '1px solid currentColor'
                    }}
                  />
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}

// ─── Main Modal ──────────────────────────────────────────────────────────────
export default function CustomerDetailModal({ selectedCustomerId, isOpen, onClose }) {
  const navigate = useNavigate();
  const { customer, isLoading: detailLoading, refetch: loadDetail } = useCustomerDetail(selectedCustomerId);

  const handleClose = () => onClose && onClose();

  const handleAddFeedback = () => {
    handleClose();
    navigate(PATHS.ADD_FEEDBACK, { state: { customerId: selectedCustomerId } });
  };

  const handleAddFollowUp = () => {
    handleClose();
    navigate(PATHS.FOLLOW_UP, { state: { customerId: selectedCustomerId } });
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '28px',
          maxHeight: '92vh',
        }
      }}
    >
      {/* Dialog Header */}
      <DialogTitle sx={{
        px: 3.5, py: 2.25,
        borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        bgcolor: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(10px)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Chip
            label="CX Customer Portal"
            size="small"
            sx={{
              bgcolor: 'rgba(99, 102, 241, 0.08)', color: 'secondary.main', fontWeight: 800,
              fontSize: '0.6875rem', textTransform: 'uppercase', height: 22, borderRadius: '6px',
              border: '1.5px solid rgba(99, 102, 241, 0.15)'
            }}
          />
          <Typography sx={{ color: 'rgba(226, 232, 240, 0.8)', mx: 0.5 }}>/</Typography>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: 'text.secondary', letterSpacing: '0.02em' }}>
            ประวัติการประสานงานและดูแลลูกค้าเชิงลึก
          </Typography>
        </Box>
        <IconButton
          size="small"
          onClick={handleClose}
          sx={{
            bgcolor: 'rgba(241, 245, 249, 0.8)',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            '&:hover': { bgcolor: '#f1f5f9', transform: 'scale(1.05)' },
            borderRadius: '8px',
            width: 28, height: 28,
            transition: 'all 0.2s'
          }}
        >
          <CloseIcon sx={{ fontSize: 14, color: '#64748b' }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3.5, bgcolor: '#F3F7FC', overflowY: 'auto' }}>
        {detailLoading && (
          <Alert
            severity="info"
            icon={<WarningIcon sx={{ fontSize: 20 }} />}
            sx={{ mb: 2.5 }}
          >
            กำลังเชื่อมต่อและประมวลผลข้อมูลบัญชีผู้ใช้เชิงลึกจาก Server...
          </Alert>
        )}

        {/* Action buttons */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'flex-end', mb: 3 }}>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={handleAddFeedback}
            startIcon={<ChatBubbleOutlineIcon sx={{ fontSize: '14px !important' }} />}
            sx={{
              borderRadius: '10px',
              fontSize: '0.75rem', px: 2.5, py: 1,
            }}
          >
            บันทึกการส่งคำติชม
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleAddFollowUp}
            startIcon={<AssignmentIcon sx={{ fontSize: '14px !important' }} />}
            sx={{
              borderRadius: '10px',
              fontSize: '0.75rem', px: 2.5, py: 1,
            }}
          >
            บันทึกการติดตามลูกค้า
          </Button>
        </Box>

        {!customer ? (
          <Box sx={{ py: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Typography sx={{ color: 'text.disabled', fontSize: '0.875rem', fontWeight: 600 }}>
              ขออภัย ไม่พบเอกสารสัญญารายการลูกค้านี้ในระบบ
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
            {/* Customer Info */}
            <CustomerInfoCard customer={customer} />

            {/* Feedback & Timeline Split Grid */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3.5 }}>
              <FeedbackHistory feedbacks={customer?.feedbacks ?? []} />
              <CustomerTimeline
                followUps={customer?.follow_ups ?? []}
                customerId={selectedCustomerId}
                onRefresh={loadDetail}
              />
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
