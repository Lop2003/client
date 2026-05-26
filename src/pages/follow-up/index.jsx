import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import SearchableCustomerDropdown from '../../components/SearchableCustomerDropdown';
import { useCX } from '../../hooks/useCX';
import { PATHS } from '../../routes/paths';

const FOLLOW_UP_TYPES = [
  { value: 'payment_remind', label: 'โทรแจ้งเตือนการค้างชำระเงิน (Payment Remind)' },
  { value: 'feedback_reply', label: 'โทรขอโทษและชี้แจงคำติชมความพึงพอใจ (Feedback Reply)' },
  { value: 'promotion',      label: 'โทรแจ้งเสนอโปรโมชั่นพิเศษ (Promotion)' },
];

export default function FollowUpPage() {
  const navigate = useNavigate();
  const { selectedCustomerId: globalId, customers, addFollowUp } = useCX();

  const [customerId, setCustomerId] = useState(globalId || '');
  const [type, setType] = useState('payment_remind');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (globalId) setCustomerId(globalId);
  }, [globalId]);

  const selectedCust = customers.find(c => c.id === customerId);

  // Auto-switch to payment_remind when overdue customer selected
  useEffect(() => {
    if (selectedCust?.status === 'overdue') {
      setType('payment_remind');
    }
  }, [customerId, selectedCust]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerId) { setError('กรุณาเลือกรายชื่อลูกค้าเพื่อบันทึกการติดตาม'); return; }
    if (!note.trim()) { setError('กรุณากรอกบันทึกรายละเอียดการโทรติดตามลูกค้า'); return; }

    const success = await addFollowUp({ customer_id: customerId, type, note: note.trim() });
    if (success) {
      setNote('');
      setError('');
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Back button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(PATHS.CUSTOMERS)}
        sx={{ mb: 3, fontSize: '0.75rem', fontWeight: 700, color: 'primary.main',
              '&:hover': { bgcolor: '#EEF2FF' } }}
      >
        กลับหน้ารายชื่อลูกค้า
      </Button>

      <Card
        component="form"
        onSubmit={handleSubmit}
        sx={{
          borderRadius: 4,
          boxShadow: '8px 8px 30px rgba(163,177,198,0.25),-8px -8px 30px rgba(255,255,255,0.7)',
          border: '1px solid rgba(255,255,255,0.6)',
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
          {/* Form Header */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: 3, bgcolor: '#EEF2FF', color: 'primary.main',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <AccessTimeIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827' }}>
                บันทึกการติดตามความคืบหน้าลูกค้า (Follow-Up Log)
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#9ca3af', mt: 0.5 }}>
                บันทึกผลการเจรจาทวงถาม, ประสานงานคำติชม, หรือการชี้แจงเพื่อป้องกันปัญหาลูกค้าสัมพันธ์
              </Typography>
            </Box>
          </Box>

          {/* Error alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2, fontSize: '0.75rem' }}>
              {error}
            </Alert>
          )}

          {/* Overdue warning */}
          {selectedCust?.status === 'overdue' && (
            <Alert
              severity="warning"
              icon={<NotificationsActiveIcon />}
              sx={{ mb: 2.5, borderRadius: 2, fontSize: '0.75rem' }}
            >
              ลูกค้ารายนี้มียอดค้างชำระ (Overdue) แนะนำให้ใช้หัวข้อ "โทรแจ้งเตือนยอดชำระ"
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Customer Selector */}
            <SearchableCustomerDropdown
              customers={customers}
              selectedCustomerId={customerId}
              onChange={(id) => { setCustomerId(id); setError(''); }}
              label="เลือกบัญชีลูกค้าสัญญา (ค้นหารายชื่อได้) *"
              showOverdueBadges
            />

            {/* Type Select */}
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

            {/* Note Textarea */}
            <TextField
              label="บันทึกรายละเอียดการประสานงานติดตาม *"
              multiline
              rows={5}
              value={note}
              onChange={e => { setNote(e.target.value); setError(''); }}
              placeholder="ตัวอย่าง: โทรแจ้งยอดค้างงวดที่ 2 แล้ว ลูกค้าแจ้งจะมาชำระในวันพุธถัดไป..."
              InputLabelProps={{ sx: { fontSize: '0.75rem' } }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, fontSize: '0.75rem' } }}
            />
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 3,
                      pt: 2.5, borderTop: '1px solid #f3f4f6' }}>
            <Button variant="outlined" onClick={() => navigate(PATHS.CUSTOMERS)}
              sx={{ borderRadius: 3, fontSize: '0.75rem', px: 3 }}>
              ยกเลิก
            </Button>
            <Button type="submit" variant="contained"
              sx={{ borderRadius: 3, fontSize: '0.75rem', px: 3,
                    bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}>
              ✓ บันทึกการติดตาม
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
