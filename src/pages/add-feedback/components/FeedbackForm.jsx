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
import CheckIcon from '@mui/icons-material/Check';
import SearchableCustomerDropdown from '../../../components/SearchableCustomerDropdown';

const CATEGORIES = [
  { value: 'service', label: 'ด้านการบริการของพนักงานสาขา/ฝ่ายขาย' },
  { value: 'payment', label: 'ด้านช่องทางการจ่ายค่างวดและกระบวนการทวงถาม' },
  { value: 'product', label: 'ด้านอุปกรณ์/สินค้าและสัญญา (iPhone, iPad)' },
  { value: 'branch', label: 'ด้านสถานที่และการเดินทางอำนวยความสะดวกในสาขา' },
];

export default function FeedbackForm({
  customers,
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
  isSubmitting,
  handleSubmit,
  onCancel,
}) {
  const displayRating = hoverRating !== -1 ? hoverRating : rating;

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
                bgcolor: 'rgba(0, 81, 186, 0.06)', color: 'primary.main',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                boxShadow: '0 4px 10px rgba(0, 81, 186, 0.1)'
              }}
            >
              <StarIcon sx={{ fontSize: 22 }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.9375rem', fontWeight: 800, color: 'text.primary', letterSpacing: '-0.01em' }}>
                กรอกรายละเอียดบันทึกข้อมูลคำติชมลูกค้า (CSAT)
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 500, mt: 0.25 }}>
                กรุณาระบุคะแนนระดับความสุขและการวิจารณ์ลงระบบข้อมูลความพึงพอใจของแบรนด์ uFriend
              </Typography>
            </Box>
          </Box>

          {/* Error */}
          {error && (
            <Alert severity="error">
              {error}
            </Alert>
          )}

          {/* Customer Dropdown */}
          <SearchableCustomerDropdown
            customers={customers}
            selectedCustomerId={customerId}
            onChange={id => { setCustomerId(id); setError(''); }}
            label="เลือกลูกค้าตามสัญญารายการ (พิมพ์ค้นหารายชื่อได้) *"
          />

          {/* Rating */}
          <Box>
            <Typography
              sx={{
                fontSize: '0.6875rem', fontWeight: 800, color: 'text.secondary',
                textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1.5,
              }}
            >
              ให้คะแนนระดับความพึงพอใจการใช้บริการ (1 - 5 ดาว) *
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: 2.5,
                bgcolor: 'rgba(248, 250, 252, 0.55)', p: 2.25, borderRadius: '14px',
                border: '1px solid rgba(226, 232, 240, 0.6)',
              }}
            >
              <Rating
                value={rating}
                onChange={(_, v) => setRating(v ?? 1)}
                onChangeActive={(_, v) => setHoverRating(v)}
                size="large"
                icon={<StarIcon sx={{ fontSize: 32, color: '#f59e0b' }} />}
                emptyIcon={<StarBorderIcon sx={{ fontSize: 32, color: 'rgba(148,163,184,0.4)' }} />}
              />
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'text.secondary' }}>
                ({displayRating} เต็ม 5.0 คะแนน / {rating >= 4 ? 'อยู่ในระดับ: พอใจมาก' : rating <= 2 ? 'อยู่ในระดับ: ควรแก้ไขปรับปรุง' : 'อยู่ในระดับ: ปานกลาง'})
              </Typography>
            </Box>
          </Box>

          {/* Category */}
          <FormControl fullWidth size="small">
            <InputLabel sx={{ fontSize: '0.75rem', fontWeight: 500 }}>หมวดหมู่หัวข้อที่มีความประสงค์จะติชมแจ้งร้องเรียน *</InputLabel>
            <Select
              value={category}
              label="หมวดหมู่หัวข้อที่มีความประสงค์จะติชมแจ้งร้องเรียน *"
              onChange={e => setCategory(e.target.value)}
              sx={{ borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, '& .MuiSelect-select': { py: 1.25 } }}
            >
              {CATEGORIES.map(opt => (
                <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Comment */}
          <TextField
            label="รายละเอียดคำวิจารณ์เชิงลึกหรือข้อเสนอแนะเพิ่มเติมสำหรับบริการ *"
            multiline
            minRows={7}
            value={comment}
            onChange={e => { setComment(e.target.value); setError(''); }}
            placeholder="ตัวอย่างเช่น: พนักงานหน้าสาขาบริการดี สุภาพ รวดเร็วมาก หรือ ต้องการให้ปรับปรุงระยะเวลาดำเนินการอนุมัติเอกสาร..."
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
              {isSubmitting ? 'กำลังบันทึกข้อมูล...' : 'บันทึกประวัติคำติชม'}
            </Button>
          </Box>

        </CardContent>
      </Card>
    </Box>
  );
}
