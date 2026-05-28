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
import SearchableCustomerDropdown from '../../../components/SearchableCustomerDropdown';

const FOLLOW_UP_TYPES = [
  { value: 'payment_remind', label: 'โทรแจ้งเตือนการค้างชำระเงิน (Payment Remind)' },
  { value: 'feedback_reply', label: 'โทรขอโทษและชี้แจงคำติชมความพึงพอใจ (Feedback Reply)' },
  { value: 'promotion', label: 'โทรแจ้งเสนอโปรโมชั่นพิเศษ (Promotion)' },
];

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
  onSearchChange,
  searchLoading,
  onCancel,
}) {
  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
      {/* Back button */}
      <Box sx={{ width: '100%', maxWidth: 1400, mb: 2.5, display: 'flex' }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onCancel}
          sx={{
            fontSize: '0.75rem',
            fontWeight: 800,
            color: 'primary.main',
            bgcolor: 'rgba(0, 81, 186, 0.04)',
            borderRadius: '10px',
            px: 2,
            py: 0.75,
            transition: 'all 0.2s',
            '&:hover': { bgcolor: 'rgba(0, 81, 186, 0.08)', transform: 'translateX(-2px)' },
          }}
        >
          กลับไปหน้ารายชื่อลูกค้า
        </Button>
      </Box>

      <Card
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '100%',
          maxWidth: 1400,
          borderRadius: '24px',
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          boxShadow: '0 10px 30px -10px rgba(0, 81, 186, 0.05), 0 1px 3px rgba(0, 0, 0, 0.01)',
          overflow: 'hidden',
        }}
      >
        <CardContent sx={{ p: { xs: 3.5, md: 5 }, display: 'flex', flexDirection: 'column', gap: 4 }}>

          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 44, height: 44, borderRadius: 2.5,
                bgcolor: 'rgba(99, 102, 241, 0.08)', color: 'secondary.main',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                boxShadow: '0 4px 10px rgba(99, 102, 241, 0.1)'
              }}
            >
              <AccessTimeIcon sx={{ fontSize: 22 }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.9375rem', fontWeight: 800, color: 'text.primary', letterSpacing: '-0.01em' }}>
                บันทึกประวัติการโทรติดตามลูกค้า (Follow-Up)
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 500, mt: 0.25 }}>
                บันทึกผลการสื่อสารโทรประสานงานแจ้งค่างวด เจรจาหนี้สิน หรือชี้แจงแก้ไขปัญหาความพึงพอใจลูกค้า
              </Typography>
            </Box>
          </Box>

          {/* Error */}
          {error && (
            <Alert severity="error">
              {error}
            </Alert>
          )}

          {/* Overdue alert */}
          {selectedCust?.status === 'overdue' && (
            <Alert
              severity="warning"
              icon={<NotificationsActiveIcon sx={{ fontSize: 18 }} />}
            >
              <strong>ข้อควรระวัง:</strong> บัญชีผู้ใช้นี้อยู่ระหว่างค้างชำระค่างวด (Overdue Case) แนะนำให้ใช้หัวข้อการโทรติดตาม "โทรแจ้งเตือนค้างชำระเงิน"
            </Alert>
          )}

          {/* Customer Dropdown */}
          <SearchableCustomerDropdown
            customers={customers}
            selectedCustomerId={customerId}
            selectedCustomerDetail={selectedCust}
            onChange={id => { setCustomerId(id); setError(''); }}
            onSearchChange={onSearchChange}
            isLoading={searchLoading}
            label="เลือกบัญชีคู่สัญญาลูกค้า (พิมพ์ค้นหารายชื่อได้) *"
            showOverdueBadges
          />

          {/* Type */}
          <FormControl fullWidth size="small">
            <InputLabel sx={{ fontSize: '0.75rem', fontWeight: 500 }}>ประเภทหัวข้อกิจกรรมโทรติดตามดูแล *</InputLabel>
            <Select
              value={type}
              label="ประเภทหัวข้อกิจกรรมโทรติดตามดูแล *"
              onChange={e => setType(e.target.value)}
              sx={{ borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, '& .MuiSelect-select': { py: 1.25 } }}
            >
              {FOLLOW_UP_TYPES.map(opt => (
                <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Note */}
          <TextField
            label="รายละเอียดผลลัพธ์การเจรจาหรือบันทึกข้อประสานงานติดตาม *"
            multiline
            minRows={7}
            value={note}
            onChange={e => { setNote(e.target.value); setError(''); }}
            placeholder="ตัวอย่างเช่น: โทรติดต่อแจ้งยอดค้างชำระเรียบร้อยแล้ว ลูกค้าขอผ่อนผันจ่ายวันศุกร์นี้ผ่านช่องทาง Mobile Banking หน้าแอปพลิเคชันหลัก..."
            InputLabelProps={{ sx: { fontSize: '0.75rem', fontWeight: 500 } }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '14px',
                fontSize: '0.75rem',
                alignItems: 'flex-start',
                p: 2
              },
            }}
          />

          {/* Actions */}
          <Box
            sx={{
              display: 'flex', justifyContent: 'flex-end', gap: 1.5,
              pt: 3, borderTop: '1px solid rgba(226, 232, 240, 0.8)', mt: 1,
            }}
          >
            <Button
              variant="outlined"
              onClick={onCancel}
              sx={{ borderRadius: '10px', fontSize: '0.75rem', px: 3.5, py: 1, fontWeight: 700 }}
            >
              ยกเลิกรายการ
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              startIcon={<CheckIcon sx={{ fontSize: '14px !important' }} />}
              sx={{
                borderRadius: '10px', fontSize: '0.75rem', px: 3.5, py: 1,
              }}
            >
              {isSubmitting ? 'กำลังบันทึกข้อมูล...' : 'บันทึกการติดตาม'}
            </Button>
          </Box>

        </CardContent>
      </Card>
    </Box>
  );
}
