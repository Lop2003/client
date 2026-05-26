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
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
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
import { useNavigate } from 'react-router-dom';
import { useCX } from '../../hooks/useCX';
import { fetchCustomerDetail, updateFollowUpStatus } from '../../services/api';
import { showToast } from '../../components/Toast';
import { getCustomerStatus, getSentiment, getFeedbackCategory, getFollowUpType } from '../../utils/statusHelpers';
import { formatDate, formatContractId } from '../../utils/formatters';
import { PATHS } from '../../routes/paths';

// ─── Customer Info Card ──────────────────────────────────────────────────────
function CustomerInfoCard({ customer }) {
  const s = getCustomerStatus(customer.status);
  const isOverdue = customer.status === 'overdue';

  const infoItems = [
    { icon: <SmartphoneIcon sx={{ fontSize: 16 }} />, label: 'สินค้าสัญญาผ่อน', value: customer.product },
    { icon: <PhoneIcon sx={{ fontSize: 16 }} />, label: 'เบอร์ติดต่อสายด่วน', value: customer.phone },
    { icon: <LocationOnIcon sx={{ fontSize: 16 }} />, label: 'สาขาที่ทำสัญญา', value: `สาขา${customer.branch}` },
    { icon: <AccessTimeFilledIcon sx={{ fontSize: 16 }} />, label: 'ระยะเวลาผ่อน', value: `${customer.plan_months} เดือน` },
    { icon: <CalendarTodayIcon sx={{ fontSize: 16 }} />, label: 'วันที่ทำสัญญา', value: formatDate(customer.created_at, 'long') },
    { icon: <TagIcon sx={{ fontSize: 16 }} />, label: 'รหัสสัญญา', value: formatContractId(customer.id) },
  ];

  return (
    <Box sx={{ bgcolor: '#fff', borderRadius: 3, border: '1px solid #e5e7eb', p: 3 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between',
                  alignItems: 'flex-start', gap: 2, pb: 2.5, borderBottom: '1px solid #f3f4f6', mb: 2.5 }}>
        <Box>
          <Typography sx={{ fontSize: '0.5625rem', fontWeight: 800, color: '#9ca3af',
                            textTransform: 'uppercase', letterSpacing: '0.08em', mb: 0.5 }}>
            ชื่อลูกค้าตามสัญญา
          </Typography>
          <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827' }}>
            {customer.name}
          </Typography>
        </Box>
        <Chip
          label={s.shortLabel}
          variant="outlined"
          sx={{ ...s.chipSx, fontSize: '0.6875rem', fontWeight: 700, height: 28, borderRadius: 2 }}
        />
      </Box>

      {isOverdue && (
        <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2, fontSize: '0.6875rem' }}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.6875rem', mb: 0.5 }}>
            ตรวจพบบัญชีมียอดค้างชำระ (Payment Overdue)
          </Typography>
          สัญญาของลูกค้ารายนี้มียอดค้างชำระ กรุณาโทรติดต่อแจ้งเตือนและแนะนำการชำระผ่านช่องทางด่วน
        </Alert>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }, gap: 2 }}>
        {infoItems.map((item, idx) => (
          <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
            <Box sx={{ width: 32, height: 32, borderRadius: 1.5, bgcolor: '#f3f4f6', color: '#6b7280',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: 0.25 }}>
              {item.icon}
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.5625rem', fontWeight: 800, color: '#9ca3af',
                                textTransform: 'uppercase', letterSpacing: '0.08em', mb: 0.25 }}>
                {item.label}
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#111827' }}>
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
    <Box sx={{ bgcolor: '#fff', borderRadius: 3, border: '1px solid #e5e7eb', p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, pb: 2, borderBottom: '1px solid #f3f4f6' }}>
        <Box sx={{ width: 32, height: 32, borderRadius: 2, bgcolor: '#EEF2FF', color: '#0051BA',
                    display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChatBubbleOutlineIcon sx={{ fontSize: 18 }} />
        </Box>
        <Typography sx={{ fontSize: '0.6875rem', fontWeight: 800, color: '#111827',
                          textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          ประวัติคำติชม (Feedback History)
        </Typography>
      </Box>

      {sorted.length === 0 ? (
        <Typography sx={{ fontSize: '0.75rem', color: 'text.disabled', textAlign: 'center', py: 4 }}>
          ยังไม่มีประวัติคำติชมจากลูกค้าคนนี้
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, maxHeight: 320, overflowY: 'auto' }}>
          {sorted.map(fb => {
            const sent = getSentiment(fb.sentiment);
            return (
              <Box key={fb.id} sx={{ bgcolor: '#f8fafc', borderRadius: 2.5, p: 2,
                                      border: '1px solid #f3f4f6' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Rating value={fb.rating} readOnly size="small" sx={{ '& .MuiRating-iconFilled': { color: '#f59e0b' } }} />
                  <Typography sx={{ fontSize: '0.625rem', color: '#9ca3af', fontWeight: 700 }}>
                    {formatDate(fb.created_at)}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: '0.75rem', color: '#374151', fontWeight: 600,
                                  fontStyle: 'italic', lineHeight: 1.6, mb: 1 }}>
                  "{fb.comment}"
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.75 }}>
                  <Chip label={`หมวด: ${getFeedbackCategory(fb.category)}`} size="small"
                    sx={{ height: 18, fontSize: '0.5625rem', fontWeight: 700,
                          bgcolor: '#EEF2FF', color: '#0051BA' }} />
                  <Chip label={`อารมณ์: ${sent.label}`} size="small"
                    sx={{ height: 18, fontSize: '0.5625rem', fontWeight: 700, ...sent.sx }} />
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}

// ─── Follow-Up Log ───────────────────────────────────────────────────────────
function FollowUpLog({ followUps, customerId, onRefresh }) {
  return (
    <Box sx={{ bgcolor: '#fff', borderRadius: 3, border: '1px solid #e5e7eb', p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, pb: 2, borderBottom: '1px solid #f3f4f6' }}>
        <Box sx={{ width: 32, height: 32, borderRadius: 2, bgcolor: '#EEF2FF', color: '#0051BA',
                    display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AssignmentIcon sx={{ fontSize: 18 }} />
        </Box>
        <Typography sx={{ fontSize: '0.6875rem', fontWeight: 800, color: '#111827',
                          textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          บันทึกการติดตาม (Follow-Up Logs)
        </Typography>
      </Box>

      {followUps.length === 0 ? (
        <Typography sx={{ fontSize: '0.75rem', color: 'text.disabled', textAlign: 'center', py: 4 }}>
          ยังไม่มีบันทึกการโทรหรือติดตามลูกค้า
        </Typography>
      ) : (
        <Box sx={{ position: 'relative', maxHeight: 320, overflowY: 'auto', pl: 1 }}>
          {followUps.map((fu, idx) => {
            const t = getFollowUpType(fu.type);
            return (
              <Box key={fu.id} sx={{ position: 'relative', pl: 3.5, pb: 2.5 }}>
                {/* Vertical line */}
                {idx < followUps.length - 1 && (
                  <Box sx={{ position: 'absolute', left: 7, top: 20, bottom: -8,
                              width: 2, bgcolor: '#e5e7eb' }} />
                )}
                {/* Node circle */}
                <Box sx={{ position: 'absolute', left: 0, top: 6, width: 16, height: 16,
                            borderRadius: '50%', bgcolor: t.color, border: '2px solid #fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: 1, zIndex: 1 }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#fff' }} />
                </Box>

                <Box sx={{ bgcolor: '#f8fafc', borderRadius: 2.5, p: 2, border: '1px solid #f3f4f6' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#111827' }}>
                      {t.label}
                    </Typography>
                    <Typography sx={{ fontSize: '0.625rem', color: '#9ca3af', fontWeight: 700 }}>
                      {formatDate(fu.created_at)}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: '0.6875rem', color: '#374151', fontWeight: 600,
                                    lineHeight: 1.6, mb: 1.5, bgcolor: '#fff', p: 1.25,
                                    borderRadius: 2, border: '1px solid #f3f4f6' }}>
                    {fu.note}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontSize: '0.5625rem', color: '#9ca3af', fontWeight: 700 }}>
                      โดย: ฝ่ายบริการลูกค้า uFriend
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center' }}>
                      {fu.status === 'pending' && (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={async () => {
                            try {
                              await updateFollowUpStatus(fu.id, 'done');
                              showToast('success', 'อัพเดทสถานะเรียบร้อยแล้ว');
                              onRefresh();
                            } catch {
                              showToast('error', 'ไม่สามารถอัพเดทสถานะได้');
                            }
                          }}
                          sx={{ fontSize: '0.5625rem', height: 20, px: 1, borderRadius: 1.5,
                                borderColor: 'primary.light', color: 'primary.main',
                                '&:hover': { bgcolor: 'primary.main', color: '#fff' } }}
                        >
                          ✔ เสร็จแล้ว
                        </Button>
                      )}
                      <Chip
                        label={fu.status === 'done' ? 'สำเร็จแล้ว' : 'รอดำเนินการ'}
                        size="small"
                        sx={{
                          height: 18, fontSize: '0.5625rem', fontWeight: 700, borderRadius: 1,
                          ...(fu.status === 'done'
                            ? { bgcolor: '#dcfce7', color: '#057A55' }
                            : { bgcolor: '#fee2e2', color: '#C81E1E' }),
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

// ─── Main Modal ──────────────────────────────────────────────────────────────
export default function CustomerDetailModal() {
  const { isDetailModalOpen, setIsDetailModalOpen, selectedCustomerId, customers } = useCX();
  const navigate = useNavigate();

  const [apiDetail, setApiDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const customer = customers.find(c => c.id === selectedCustomerId);

  const loadDetail = () => {
    if (!selectedCustomerId) return;
    let cancelled = false;
    setDetailLoading(true);
    fetchCustomerDetail(selectedCustomerId)
      .then(data => {
        if (!cancelled) setApiDetail({ feedbacks: data.feedbacks || [], follow_ups: data.follow_ups || [] });
      })
      .catch(() => { if (!cancelled) setApiDetail(null); })
      .finally(() => { if (!cancelled) setDetailLoading(false); });
    return () => { cancelled = true; };
  };

  useEffect(() => {
    const cancel = loadDetail();
    return cancel;
  }, [selectedCustomerId]);

  const handleClose = () => setIsDetailModalOpen(false);

  const handleAddFeedback = () => {
    setIsDetailModalOpen(false);
    navigate(PATHS.ADD_FEEDBACK);
  };

  const handleAddFollowUp = () => {
    setIsDetailModalOpen(false);
    navigate(PATHS.FOLLOW_UP);
  };

  return (
    <Dialog
      open={isDetailModalOpen}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{ sx: { borderRadius: 4, maxHeight: '92vh' } }}
    >
      {/* Dialog Header */}
      <DialogTitle sx={{ px: 3, py: 1.75, borderBottom: '1px solid #f3f4f6', display: 'flex',
                          alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip label="CX Insight" size="small"
            sx={{ bgcolor: '#EEF2FF', color: 'primary.main', fontWeight: 800,
                  fontSize: '0.5625rem', textTransform: 'uppercase', height: 20, borderRadius: 1 }} />
          <Typography sx={{ color: '#cbd5e1', mx: 0.5 }}>/</Typography>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'text.secondary' }}>
            ข้อมูลประวัติลูกค้าสัมพันธ์เชิงลึก
          </Typography>
        </Box>
        <IconButton size="small" onClick={handleClose}
          sx={{ bgcolor: '#f1f5f9', '&:hover': { bgcolor: '#e2e8f0' }, borderRadius: 2 }}>
          <CloseIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, bgcolor: '#f8fafc', overflowY: 'auto' }}>
        {detailLoading && (
          <Alert severity="info" icon={<CircularProgress size={16} />}
            sx={{ mb: 2, borderRadius: 2, fontSize: '0.75rem' }}>
            กำลังโหลดข้อมูลเชิงลึกจาก API...
          </Alert>
        )}

        {/* Action buttons */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'flex-end', mb: 2.5 }}>
          <Button variant="contained" size="small" onClick={handleAddFeedback}
            sx={{ bgcolor: '#6366f1', '&:hover': { bgcolor: '#4f46e5' }, borderRadius: 2.5,
                  fontSize: '0.6875rem', px: 2 }}>
            💬 บันทึกคำติชม
          </Button>
          <Button variant="contained" size="small" onClick={handleAddFollowUp}
            sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' }, borderRadius: 2.5,
                  fontSize: '0.6875rem', px: 2 }}>
            📝 บันทึกการติดตาม
          </Button>
        </Box>

        {!customer ? (
          <Typography sx={{ textAlign: 'center', color: 'text.disabled', py: 8, fontSize: '0.875rem' }}>
            ไม่พบข้อมูลลูกค้า
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Customer Info */}
            <CustomerInfoCard customer={customer} />

            {/* Feedback + FollowUp Grid */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2.5 }}>
              <FeedbackHistory feedbacks={apiDetail?.feedbacks ?? []} />
              <FollowUpLog
                followUps={apiDetail?.follow_ups ?? []}
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
