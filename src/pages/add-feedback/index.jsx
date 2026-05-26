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
import Rating from '@mui/material/Rating';
import Alert from '@mui/material/Alert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import SearchableCustomerDropdown from '../../components/SearchableCustomerDropdown';
import { useCX } from '../../hooks/useCX';
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
  const { selectedCustomerId: globalId, customers, addFeedback } = useCX();

  const [customerId, setCustomerId] = useState(globalId || '');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(-1);
  const [comment, setComment] = useState('');
  const [category, setCategory] = useState('service');
  const [error, setError] = useState('');

  useEffect(() => {
    if (globalId) setCustomerId(globalId);
  }, [globalId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerId) { setError('กรุณาเลือกบัญชีลูกค้าเพื่อบันทึกคำติชม'); return; }
    if (!comment.trim()) { setError('กรุณากรอกความคิดเห็นหรือรายละเอียดคำติชม'); return; }

    const success = await addFeedback({
      customer_id: customerId,
      rating,
      comment: comment.trim(),
      category,
    });
    if (success) {
      setCustomerId('');
      setRating(5);
      setComment('');
      setCategory('service');
      setError('');
    }
  };

  const displayRating = hoverRating !== -1 ? hoverRating : rating;

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
              <StarIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827' }}>
                กรอกบันทึกคำติชมความพึงพอใจลูกค้า
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#9ca3af', mt: 0.5 }}>
                บันทึกข้อมูลคะแนนดาวและข้อความวิจารณ์ลงในแบบสอบถามระดับความพึงพอใจ (CSAT)
              </Typography>
            </Box>
          </Box>

          {/* Error alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2, fontSize: '0.75rem' }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Customer Selector */}
            <SearchableCustomerDropdown
              customers={customers}
              selectedCustomerId={customerId}
              onChange={(id) => { setCustomerId(id); setError(''); }}
              label="เลือกลูกค้าสัญญา (ค้นหารายชื่อได้) *"
            />

            {/* Rating Stars */}
            <Box>
              <Typography sx={{ fontSize: '0.625rem', fontWeight: 800, color: 'text.secondary',
                                textTransform: 'uppercase', letterSpacing: '0.08em', mb: 0.75 }}>
                ให้คะแนนความพึงพอใจ (1 - 5 ดาว) *
              </Typography>
              <Box
                sx={{
                  display: 'flex', flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { sm: 'center' }, gap: 1.5,
                  bgcolor: '#f8fafc', p: 1.5, borderRadius: 3,
                  border: '1px solid #e5e7eb',
                }}
              >
                <Rating
                  value={rating}
                  onChange={(_, v) => setRating(v ?? 1)}
                  onChangeActive={(_, v) => setHoverRating(v)}
                  size="large"
                  icon={<StarIcon sx={{ fontSize: 32, color: '#f59e0b' }} />}
                  emptyIcon={<StarBorderIcon sx={{ fontSize: 32, color: '#d1d5db' }} />}
                />
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b7280' }}>
                  ({displayRating} เต็ม 5 คะแนน / {RATING_LABELS[displayRating]})
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

            {/* Comment */}
            <TextField
              label="รายละเอียดคำวิจารณ์/ความคิดเห็นเพิ่มเติม *"
              multiline
              rows={5}
              value={comment}
              onChange={e => { setComment(e.target.value); setError(''); }}
              placeholder="เช่น บริการรวดเร็วมากค่ะ พนักงานสาขาพูดจาสุภาพ หรือ พนักงานทวงหนี้พูดจาไม่สุภาพ..."
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
              ✓ บันทึกคำติชม
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
