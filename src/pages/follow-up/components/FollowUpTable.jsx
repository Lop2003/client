import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import TablePagination from '@mui/material/TablePagination';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import InfoIcon from '@mui/icons-material/Info';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TableLoader from '../../customers/components/TableLoader';

const HEAD_CELLS = [
  { id: 'type', label: 'ประเภทกิจกรรม', sortable: false },
  { id: 'customer', label: 'รายชื่อลูกค้า / เบอร์โทร', sortable: false },
  { id: 'branch', label: 'พื้นที่สาขา', sortable: false },
  { id: 'note', label: 'บันทึกรายละเอียดการโทรประสานงาน', sortable: false },
  { id: 'created_at', label: 'วันที่โทรบันทึก', sortable: false },
  { id: 'status', label: 'สถานะงาน', sortable: false },
  { id: 'actions', label: 'การดำเนินการ', sortable: false, align: 'right' },
];

const TYPE_CONFIG = {
  payment_remind: { label: 'แจ้งค้างชำระเงิน', color: '#EF4444', bgcolor: 'rgba(239, 68, 68, 0.08)' },
  feedback_reply: { label: 'ชี้แจงความพึงพอใจ', color: '#6366F1', bgcolor: 'rgba(99, 102, 241, 0.08)' },
  promotion: { label: 'เสนอโปรโมชั่นพิเศษ', color: '#8B5CF6', bgcolor: 'rgba(139, 92, 246, 0.08)' },
};

const STATUS_CONFIG = {
  pending: { label: 'รอดำเนินการ', color: '#F59E0B', bgcolor: 'rgba(245, 158, 11, 0.08)', icon: <AccessTimeIcon sx={{ fontSize: '12px !important' }} /> },
  done: { label: 'เสร็จสิ้นแล้ว', color: '#10B981', bgcolor: 'rgba(16, 185, 129, 0.08)', icon: <CheckCircleIcon sx={{ fontSize: '12px !important' }} /> },
};

export default function FollowUpTable({
  followUps = [],
  total = 0,
  page = 1,
  limit = 10,
  onPageChange,
  onLimitChange,
  onStatusToggle,
  onViewCustomer,
  isLoading = false,
}) {
  const muiPage = page - 1;
  const hasMore = followUps.length === limit;
  const virtualCount = hasMore ? Math.max(total, page * limit + 1) : total;

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('th-TH', {
        day: '2-digit',
        month: 'short',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }) + ' น.';
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <Paper
      sx={{
        borderRadius: '24px',
        overflow: 'hidden',
        background: '#ffffff',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        boxShadow: '0 10px 30px -10px rgba(9, 18, 44, 0.04), 0 1px 3px rgba(0, 0, 0, 0.01)',
      }}
    >
      <TableLoader isLoading={isLoading} />
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {HEAD_CELLS.map(cell => (
                <TableCell
                  key={cell.id}
                  align={cell.align ?? 'left'}
                  sx={{ py: 2 }}
                >
                  <Typography sx={{ 
                    fontSize: '0.6875rem', fontWeight: 800, color: 'text.secondary',
                    textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' 
                  }}>
                    {cell.label}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {followUps.length === 0 ? (
              isLoading ? (
                [1, 2, 3, 4, 5].map(i => (
                  <TableRow key={i}>
                    <TableCell><Skeleton variant="rounded" width={90} height={20} /></TableCell>
                    <TableCell><Skeleton variant="text" width="80%" height={20} /></TableCell>
                    <TableCell><Skeleton variant="text" width="60%" height={20} /></TableCell>
                    <TableCell><Skeleton variant="text" width="90%" height={20} /></TableCell>
                    <TableCell><Skeleton variant="text" width="70%" height={20} /></TableCell>
                    <TableCell><Skeleton variant="rounded" width={80} height={20} /></TableCell>
                    <TableCell align="right"><Skeleton variant="rounded" width={110} height={26} /></TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 10 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                      <InfoIcon sx={{ fontSize: 32, color: 'text.disabled', opacity: 0.6 }} />
                      <Typography sx={{ fontSize: '0.75rem', color: 'text.disabled', fontWeight: 700 }}>
                        ไม่พบประวัติข้อมูลกิจกรรมการโทรติดตามลูกค้าตามเงื่อนไขการค้นหา
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )
            ) : (
              followUps.map(item => {
                const typeCfg = TYPE_CONFIG[item.type] || { label: item.type, color: '#64748B', bgcolor: '#F1F5F9' };
                const statusCfg = STATUS_CONFIG[item.status] || { label: item.status, color: '#64748B', bgcolor: '#F1F5F9' };
                
                return (
                  <TableRow
                    key={item.id}
                    hover
                    sx={{
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        bgcolor: 'rgba(0, 81, 186, 0.02) !important',
                      },
                    }}
                  >
                    {/* Activity Type */}
                    <TableCell sx={{ py: 1.75 }}>
                      <Chip
                        label={typeCfg.label}
                        size="small"
                        sx={{ 
                          fontSize: '0.625rem', 
                          fontWeight: 800, 
                          height: 22, 
                          borderRadius: '6px',
                          color: typeCfg.color,
                          bgcolor: typeCfg.bgcolor,
                          border: `1.5px solid ${typeCfg.color}`
                        }}
                      />
                    </TableCell>

                    {/* Customer details */}
                    <TableCell>
                      {item.customer ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: 'text.primary' }}>
                            {item.customer.name}
                          </Typography>
                          <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary', fontFamily: 'monospace', mt: 0.25 }}>
                            โทร {item.customer.phone}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography sx={{ fontSize: '0.75rem', color: 'text.disabled', fontWeight: 600 }}>
                          (ไม่มีข้อมูลลูกค้า)
                        </Typography>
                      )}
                    </TableCell>

                    {/* Branch */}
                    <TableCell>
                      <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 700 }}>
                        {item.customer?.branch || '-'}
                      </Typography>
                    </TableCell>

                    {/* Note details */}
                    <TableCell sx={{ maxWidth: 300 }}>
                      <Typography 
                        noWrap
                        sx={{ 
                          fontSize: '0.75rem', 
                          color: 'text.primary', 
                          fontWeight: 500,
                          textOverflow: 'ellipsis',
                          overflow: 'hidden'
                        }}
                        title={item.note}
                      >
                        {item.note}
                      </Typography>
                    </TableCell>

                    {/* Date */}
                    <TableCell>
                      <Typography sx={{ fontSize: '0.725rem', color: 'text.secondary', fontWeight: 600 }}>
                        {formatDate(item.created_at)}
                      </Typography>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Chip
                        label={statusCfg.label}
                        size="small"
                        icon={statusCfg.icon}
                        sx={{ 
                          fontSize: '0.625rem', 
                          fontWeight: 800, 
                          height: 22, 
                          borderRadius: '6px',
                          color: statusCfg.color,
                          bgcolor: statusCfg.bgcolor,
                          border: `1.5px solid ${statusCfg.color}`,
                          '& .MuiChip-icon': { color: `${statusCfg.color} !important`, ml: 0.5 }
                        }}
                      />
                    </TableCell>

                    {/* Actions */}
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                        {onStatusToggle && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => onStatusToggle(item.id, item.status === 'pending' ? 'done' : 'pending')}
                            sx={{
                              fontSize: '0.625rem',
                              fontWeight: 800,
                              py: 0.5,
                              px: 1.25,
                              borderRadius: '8px',
                              color: item.status === 'pending' ? 'success.main' : 'warning.main',
                              borderColor: item.status === 'pending' ? 'success.light' : 'warning.light',
                              '&:hover': {
                                bgcolor: item.status === 'pending' ? 'rgba(16, 185, 129, 0.06)' : 'rgba(245, 158, 11, 0.06)',
                                borderColor: item.status === 'pending' ? 'success.main' : 'warning.main',
                              }
                            }}
                          >
                            {item.status === 'pending' ? 'ทำเสร็จแล้ว' : 'เปิดงานใหม่'}
                          </Button>
                        )}
                        {onViewCustomer && (
                          <Button
                            size="small"
                            variant="text"
                            onClick={() => onViewCustomer(item.customer_id)}
                            endIcon={<ChevronRightIcon sx={{ fontSize: '12px !important' }} />}
                            sx={{ 
                              fontSize: '0.625rem', 
                              fontWeight: 800, 
                              color: 'primary.main',
                              py: 0.5,
                              px: 1,
                              borderRadius: '8px',
                              '&:hover': { 
                                bgcolor: 'rgba(0, 81, 186, 0.06)',
                                transform: 'translateX(1px)'
                              } 
                            }}
                          >
                            ข้อมูลสัญญา
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={virtualCount}
        page={muiPage}
        onPageChange={(_, newPage) => onPageChange && onPageChange(newPage + 1)}
        rowsPerPage={limit}
        onRowsPerPageChange={e => {
          onLimitChange && onLimitChange(parseInt(e.target.value, 10));
        }}
        rowsPerPageOptions={[5, 10, 20, 50]}
        labelRowsPerPage="แสดงรายการต่อหน้า:"
        labelDisplayedRows={({ from, to }) => {
          const displayCount = total >= 10000 ? '10,000+' : total.toLocaleString();
          return `${from}–${to} จากทั้งหมด ${displayCount} รายการ`;
        }}
        sx={{
          borderTop: '1px solid rgba(226, 232, 240, 0.8)',
          bgcolor: 'rgba(248, 250, 252, 0.4)',
          '& .MuiTablePagination-select': { fontSize: '0.75rem', fontWeight: 700 },
        }}
      />
    </Paper>
  );
}
