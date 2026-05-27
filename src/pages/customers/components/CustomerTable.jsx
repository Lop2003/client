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
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import InfoIcon from '@mui/icons-material/Info';
import Skeleton from '@mui/material/Skeleton';
import { getCustomerStatus } from '../../../utils/statusHelpers';
import { formatContractId } from '../../../utils/formatters';
import TableLoader from './TableLoader';

const HEAD_CELLS = [
  { id: 'created_at', label: 'รหัสสัญญา', sortable: true },
  { id: 'name',       label: 'ชื่อลูกค้าตามสัญญา', sortable: true },
  { id: 'phone',      label: 'เบอร์โทรศัพท์', sortable: false },
  { id: 'product',    label: 'สินค้าผ่อนชำระ', sortable: true },
  { id: 'branch',     label: 'พื้นที่สาขา', sortable: false },
  { id: 'plan_months', label: 'ระยะเวลาสัญญา', sortable: true },
  { id: 'status',     label: 'สถานะค่างวด', sortable: true },
  { id: 'actions',    label: 'การจัดการ', sortable: false, align: 'right' },
];

export default function CustomerTable({
  customers = [],
  total = 0,
  page = 1,
  limit = 10,
  onPageChange,
  onLimitChange,
  sortBy = 'created_at',
  setSortBy,
  sortOrder = 'desc',
  setSortOrder,
  onRowClick,
  isLoading = false,
}) {
  const handleSort = (field) => {
    if (!field || !setSortBy || !setSortOrder) return;
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // MUI TablePagination ใช้ page 0-indexed แต่ server ใช้ 1-indexed
  const muiPage = page - 1;

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
                  sortDirection={sortBy === cell.id ? sortOrder : false}
                  sx={{ py: 2 }}
                >
                  {cell.sortable ? (
                    <TableSortLabel
                      active={sortBy === cell.id}
                      direction={sortBy === cell.id ? sortOrder : 'asc'}
                      onClick={() => handleSort(cell.id)}
                      sx={{
                        fontSize: '0.6875rem', fontWeight: 800, color: 'text.secondary',
                        textTransform: 'uppercase', letterSpacing: '0.08em',
                        whiteSpace: 'nowrap',
                        '&.Mui-active': { color: 'primary.main' },
                        '& .MuiTableSortLabel-icon': { color: 'primary.main !important' },
                      }}
                    >
                      {cell.label}
                    </TableSortLabel>
                  ) : (
                    <Typography sx={{ 
                      fontSize: '0.6875rem', fontWeight: 800, color: 'text.secondary',
                      textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' 
                    }}>
                      {cell.label}
                    </Typography>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {customers.length === 0 ? (
              isLoading ? (
                // แสดงสเกเลตันแถวตารางในตอนโหลดครั้งแรกสุด (Initial Load)
                [1, 2, 3, 4, 5].map(i => (
                  <TableRow key={i}>
                    <TableCell><Skeleton variant="text" width="80%" height={20} /></TableCell>
                    <TableCell><Skeleton variant="text" width="60%" height={20} /></TableCell>
                    <TableCell><Skeleton variant="text" width="70%" height={20} /></TableCell>
                    <TableCell><Skeleton variant="text" width="75%" height={20} /></TableCell>
                    <TableCell><Skeleton variant="text" width="50%" height={20} /></TableCell>
                    <TableCell><Skeleton variant="text" width="40%" height={20} /></TableCell>
                    <TableCell><Skeleton variant="rounded" width={68} height={20} sx={{ borderRadius: '6px' }} /></TableCell>
                    <TableCell align="right"><Skeleton variant="rounded" width={90} height={26} sx={{ borderRadius: '8px' }} /></TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 10 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                      <InfoIcon sx={{ fontSize: 32, color: 'text.disabled', opacity: 0.6 }} />
                      <Typography sx={{ fontSize: '0.75rem', color: 'text.disabled', fontWeight: 700 }}>
                        ไม่พบบัญชีสัญญาของลูกค้าตามเงื่อนไขการค้นหา
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )
            ) : (
              customers.map(c => {
                const s = getCustomerStatus(c.status);
                const isOverdue = c.status === 'overdue';
                return (
                  <TableRow
                    key={c.id}
                    hover
                    onClick={() => onRowClick && onRowClick(c.id)}
                    sx={{
                      cursor: 'pointer',
                      bgcolor: isOverdue ? 'rgba(254, 226, 226, 0.25)' : 'inherit',
                      borderLeft: '4px solid',
                      borderLeftColor: isOverdue ? '#EF4444' : 'transparent',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        bgcolor: isOverdue ? 'rgba(254, 226, 226, 0.45) !important' : 'rgba(0, 81, 186, 0.02) !important',
                      },
                    }}
                  >
                    <TableCell>
                      <Typography sx={{ 
                        fontSize: '0.75rem', 
                        color: 'text.secondary', 
                        fontFamily: 'monospace',
                        fontWeight: 600,
                        letterSpacing: '0.02em'
                      }}>
                        {formatContractId(c.id)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '0.8125rem', fontWeight: 800, color: 'text.primary', whiteSpace: 'nowrap' }}>
                        {c.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ 
                        fontSize: '0.75rem', 
                        color: 'text.secondary', 
                        fontFamily: 'monospace',
                        fontWeight: 600
                      }}>
                        {c.phone}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'text.primary' }}>
                        {c.product}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 600 }}>{c.branch}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '0.75rem', color: 'text.disabled', fontWeight: 700, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                        {c.plan_months} <Box component="span" sx={{ fontSize: '0.6875rem', fontWeight: 600 }}>เดือน</Box>
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={s.label}
                        size="small"
                        sx={{ 
                          fontSize: '0.625rem', 
                          fontWeight: 800, 
                          height: 20, 
                          borderRadius: '6px',
                          ...s.chipSx,
                          border: '1.5px solid currentColor'
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small" 
                        variant="text" 
                        endIcon={<ChevronRightIcon sx={{ fontSize: '14px !important' }} />}
                        sx={{ 
                          fontSize: '0.6875rem', 
                          fontWeight: 800, 
                          color: 'primary.main',
                          py: 0.5,
                          borderRadius: '8px',
                          '&:hover': { 
                            bgcolor: 'rgba(0, 81, 186, 0.06)',
                            transform: 'translateX(2px)'
                          } 
                        }}
                      >
                        เปิดดูประวัติ
                      </Button>
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
        count={total}
        page={muiPage}
        onPageChange={(_, newPage) => onPageChange && onPageChange(newPage + 1)}
        rowsPerPage={limit}
        onRowsPerPageChange={e => {
          onLimitChange && onLimitChange(parseInt(e.target.value, 10));
        }}
        rowsPerPageOptions={[5, 10, 20, 50]}
        labelRowsPerPage="แสดงรายการต่อหน้า:"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} จากทั้งหมด ${count} รายการ`}
        sx={{
          borderTop: '1px solid rgba(226, 232, 240, 0.8)',
          bgcolor: 'rgba(248, 250, 252, 0.4)',
          '& .MuiTablePagination-select': { fontSize: '0.75rem', fontWeight: 700 },
        }}
      />
    </Paper>
  );
}
