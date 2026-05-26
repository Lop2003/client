import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
import Rating from '@mui/material/Rating';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import CheckIcon from '@mui/icons-material/Check';
import SearchableCustomerDropdown from '../../components/SearchableCustomerDropdown';
import { useCustomers } from '../../hooks/useCustomers';
import { useAddFeedback } from '../../hooks/useAddFeedback';
import { PATHS } from '../../routes/paths';

const CATEGORIES = [
  { value: 'service',  label: 'ด้านการบริการของพนักงานสาขา/ฝ่ายขาย' },
  { value: 'payment',  label: 'ด้านช่องทางการจ่ายค่างวดและกระบวนการทวงถาม' },
  { value: 'product',  label: 'ด้านอุปกรณ์/สินค้าและสัญญา (iPhone, iPad)' },
  { value: 'branch',   label: 'ด้านสถานที่และการเดินทางอำนวยความสะดวกในสาขา' },
];

const RATING_LABELS = {
  1: 'ไม่พึงพอใจอย่างมาก',
  2: 'ไม่พึงพอใจ',
  3: 'ทั่วไป',
  4: 'พึงพอใจ',
  5: 'พึงพอใจมาก',
};

export default function AddFeedbackPage() {
  const navigate = useNavigate();
  const { customers } = useCustomers({ sortBy: 'name', sortOrder: 'asc' });

  const {
    customerId,
    setCustomerId,
    rating,
    setRating,
    hoverRating,
    setHoverRating,
    comment,
    setComment,
    category,
    setCategory,
    error,
    setError,
    handleSubmit,
  } = useAddFeedback();

  const selectedCust = customers.find(c => c.id === customerId);

  const displayRating = hoverRating !== -1 ? hoverRating : rating;

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
      {/* Back button wrapper */}
      <Box sx={{ width: '100%', maxWidth: 860, mb: 2, display: 'flex' }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(PATHS.CUSTOMERS)}
          sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'primary.main',
                '&:hover': { bgcolor: '#EEF2FF' } }}
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
            <Box sx={{ width: 44, height: 44, borderRadius: 3, bgcolor: '#EEF2FF', color: 'primary.main',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <StarIcon sx={{ fontSize: 22 }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.9375rem', fontWeight: 800, color: '#111827' }}>
                กรอกบันทึกคำติชมความพึงพอใจลูกค้า
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#9ca3af', mt: 0.5 }}>
                บันทึกข้อมูลคะแนนดาวและข้อความวิจารณ์ลงในแบบสอบถามระดับความพึงพอใจ (CSAT)
              </Typography>
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ borderRadius: 2.5, fontSize: '0.75rem' }}>
              {error}
            </Alert>
          )}

          {/* Customer Dropdown */}
          <SearchableCustomerDropdown
            customers={customers}
            selectedCustomerId={customerId}
            onChange={(id) => { setCustomerId(id); setError(''); }}
            label="เลือกลูกค้าสัญญา (ค้นหารายชื่อได้) *"
          />

          {/* Rating Stars Selector */}
          <Box>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: 'text.secondary',
                              textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1.5 }}>
              ให้คะแนนความพึงพอใจ (1 - 5 ดาว) *
            </Typography>
            <Box
              sx={{
                display: 'flex', flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2,
                bgcolor: '#f8fafc', p: 2, borderRadius: 3,
                border: '1px solid #e5e7eb',
              }}
            >
              <Rating
                value={rating}
                onChange={(_, v) => setRating(v ?? 1)}
                onChangeActive={(_, v) => setHoverRating(v)}
                size="large"
                icon={<StarIcon sx={{ fontSize: 30, color: '#f59e0b' }} />}
                emptyIcon={<StarBorderIcon sx={{ fontSize: 30, color: '#d1d5db' }} />}
              />
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b7280' }}>
                ({displayRating} เต็ม 5 คะแนน / {rating >= 4 ? 'พึงพอใจมาก' : rating <= 2 ? 'ไม่พึงพอใจ' : 'ทั่วไป'})
              </Typography>
            </Box>
          </Box>

          {/* Category Select */}
          <FormControl fullWidth size="small">
            <InputLabel sx={{ fontSize: '0.75rem' }}>หมวดหมู่หัวข้อคำร้องเรียนติชม *</InputLabel>
            <Select
              value={category}
              label="หมวดหมู่หัวข้อคำร้องเรียนติชม *"
              onChange={e => setCategory(e.target.value)}
              sx={{ borderRadius: 3, fontSize: '0.75rem' }}
            >
              {CATEGORIES.map(opt => (
                <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: '0.75rem' }}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Comment detail Textbox */}
          <TextField
            label="รายละเอียดคำวิจารณ์/ความคิดเห็นเพิ่มเติม *"
            multiline
            minRows={8}
            value={comment}
            onChange={e => { setComment(e.target.value); setError(''); }}
            placeholder="เช่น บริการรวดเร็วมากค่ะ พนักงานสาขาพูดจาสุภาพ หรือ พนักงานทวงหนี้พูดจาไม่สุภาพ..."
            InputLabelProps={{ sx: { fontSize: '0.75rem' } }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                fontSize: '0.75rem',
                alignItems: 'flex-start',
              }
            }}
          />

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, pt: 2.5, borderTop: '1px solid #f3f4f6', mt: 1 }}>
            <Button
              variant="outlined"
              onClick={() => navigate(PATHS.CUSTOMERS)}
              sx={{ borderRadius: 3, fontSize: '0.75rem', px: 3 }}
            >
              ยกเลิก
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<CheckIcon sx={{ fontSize: '14px !important' }} />}
              sx={{
                borderRadius: 3, fontSize: '0.75rem', px: 3,
                bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' }
              }}
            >
              บันทึกคำติชม
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
