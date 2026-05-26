import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Alert from '@mui/material/Alert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CheckIcon from '@mui/icons-material/Check';
import SearchableCustomerDropdown from '../../components/SearchableCustomerDropdown';

const FOLLOW_UP_TYPES = [
  { value: 'payment_remind', label: 'โทรแจ้งเตือนการค้างชำระเงิน (Payment Remind)' },
  { value: 'feedback_reply', label: 'โทรขอโทษและชี้แจงคำติชมความพึงพอใจ (Feedback Reply)' },
  { value: 'promotion',      label: 'โทรแจ้งเสนอโปรโมชั่นพิเศษ (Promotion)' },
];

/**
 * FollowUpForm — form card สำหรับบันทึกการติดตาม follow-up
 */
export default function FollowUpForm({
  customers,
  customerId,
  setCustomerId,
  type,
  setType,
  note,
  setNote,
  error,
  setError,
  isSubmitting,
  handleSubmit,
  selectedCust,
  onCancel,
}) {
  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
      {/* Back button */}
      <Box sx={{ width: '100%', maxWidth: 860, mb: 2, display: 'flex' }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onCancel}
          sx={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'primary.main',
            '&:hover': { bgcolor: '#EEF2FF' },
          }}
        >
          กลับหน้ารายชื่อลูกค้า
        </Button>
      </Box>

      <Card
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '100%',
          maxWidth: 860,
          borderRadius: 6,
          boxShadow: '8px 8px 30px rgba(163,177,198,0.25), -8px -8px 30px rgba(255,255,255,0.7)',
          border: '1px solid rgba(255,255,255,0.6)',
          background: '#fff',
          overflow: 'hidden',
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 5 }, display: 'flex', flexDirection: 'column', gap: 3.5 }}>

          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 44, height: 44, borderRadius: 3,
                bgcolor: '#EEF2FF', color: 'primary.main',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}
            >
              <AccessTimeIcon sx={{ fontSize: 22 }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.9375rem', fontWeight: 800, color: '#111827' }}>
                บันทึกการติดตามความคืบหน้าลูกค้า (Follow-Up Log)
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#9ca3af', mt: 0.5 }}>
                บันทึกผลการเจรจาทวงถาม, ประสานงานคำติชม, หรือการชี้แจงเพื่อป้องกันปัญหาความเสี่ยงลูกค้าสัมพันธ์
              </Typography>
            </Box>
          </Box>

          {/* Error */}
          {error && (
            <Alert severity="error" sx={{ borderRadius: 2.5, fontSize: '0.75rem' }}>
              {error}
            </Alert>
          )}

          {/* Overdue alert */}
          {selectedCust?.status === 'overdue' && (
            <Alert
              severity="warning"
              icon={<NotificationsActiveIcon sx={{ fontSize: 18 }} />}
              sx={{ borderRadius: 2.5, fontSize: '0.75rem' }}
            >
              ลูกค้ารายนี้มียอดค้างชำระ (Overdue) แนะนำให้ใช้หัวข้อ "โทรแจ้งเตือนยอดชำระ" เพื่อบันทึกความคืบหน้า
            </Alert>
          )}

          {/* Customer Dropdown */}
          <SearchableCustomerDropdown
            customers={customers}
            selectedCustomerId={customerId}
            onChange={id => { setCustomerId(id); setError(''); }}
            label="เลือกบัญชีลูกค้าสัญญา (ค้นหารายชื่อได้) *"
            showOverdueBadges
          />

          {/* Type */}
          <FormControl fullWidth size="small">
            <InputLabel sx={{ fontSize: '0.75rem' }}>ประเภทกิจกรรมการติดตาม *</InputLabel>
            <Select
              value={type}
              label="ประเภทกิจกรรมการติดตาม *"
              onChange={e => setType(e.target.value)}
              sx={{ borderRadius: 3, fontSize: '0.75rem' }}
            >
              {FOLLOW_UP_TYPES.map(opt => (
                <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: '0.75rem' }}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Note */}
          <TextField
            label="บันทึกรายละเอียดการประสานงานติดตาม *"
            multiline
            minRows={8}
            value={note}
            onChange={e => { setNote(e.target.value); setError(''); }}
            placeholder="ตัวอย่าง: โทรแจ้งยอดค้างงวดที่ 2 แล้ว ลูกค้าแจ้งเครื่องขัดข้องหน้าสาขา จะเข้ามาชำระยอดค้างสะสมพร้อมค่าบริการในวันพุธถัดไป..."
            InputLabelProps={{ sx: { fontSize: '0.75rem' } }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                fontSize: '0.75rem',
                alignItems: 'flex-start',
              },
            }}
          />

          {/* Actions */}
          <Box
            sx={{
              display: 'flex', justifyContent: 'flex-end', gap: 1.5,
              pt: 2.5, borderTop: '1px solid #f3f4f6', mt: 1,
            }}
          >
            <Button
              variant="outlined"
              onClick={onCancel}
              sx={{ borderRadius: 3, fontSize: '0.75rem', px: 3 }}
            >
              ยกเลิก
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              startIcon={<CheckIcon sx={{ fontSize: '14px !important' }} />}
              sx={{
                borderRadius: 3, fontSize: '0.75rem', px: 3,
                bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' },
              }}
            >
              {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกการติดตาม'}
            </Button>
          </Box>

        </CardContent>
      </Card>
    </Box>
  );
}
