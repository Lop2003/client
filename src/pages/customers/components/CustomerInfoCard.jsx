import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TagIcon from '@mui/icons-material/Tag';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import WarningIcon from '@mui/icons-material/Warning';
import { getCustomerStatus } from '../../../utils/statusHelpers';
import { formatDate, formatContractId } from '../../../utils/formatters';

export default function CustomerInfoCard({ customer }) {
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
