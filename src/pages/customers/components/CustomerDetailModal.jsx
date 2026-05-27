import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import AssignmentIcon from '@mui/icons-material/Assignment';
import WarningIcon from '@mui/icons-material/Warning';
import { useNavigate } from 'react-router-dom';
import { useCustomerDetail } from '../../../hooks/useCustomerDetail';
import { PATHS } from '../../../routes/paths';
import CustomerTimeline from './CustomerTimeline';
import CustomerInfoCard from './CustomerInfoCard';
import FeedbackHistory from './FeedbackHistory';

export default function CustomerDetailModal({ selectedCustomerId, isOpen, onClose }) {
  const navigate = useNavigate();
  const { customer, isLoading: detailLoading, loadDetail } = useCustomerDetail(selectedCustomerId);

  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleAddFeedback = () => {
    navigate(`${PATHS.ADD_FEEDBACK}?customerId=${selectedCustomerId}`);
    handleClose();
  };

  const handleAddFollowUp = () => {
    navigate(`${PATHS.FOLLOW_UP}?customerId=${selectedCustomerId}`);
    handleClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="md"
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
            label="Customer Detail"
            size="small"
            sx={{
              bgcolor: 'rgba(99, 102, 241, 0.08)', color: 'primary.main', fontWeight: 800,
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
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'flex-end', mb: 2, mt: 2 }}>
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
