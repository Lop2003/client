import { useState, useEffect } from 'react';
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
import { getCustomerStatus } from '../../utils/statusHelpers';
import { formatContractId } from '../../utils/formatters';

const HEAD_CELLS = [
  { id: 'created_at', label: 'รหัสสัญญา', sortable: true },
  { id: 'name',       label: 'ชื่อลูกค้าตามสัญญา', sortable: true },
  { id: 'phone',      label: 'เบอร์โทรศัพท์', sortable: false },
  { id: 'product',    label: 'สินค้าผ่อน', sortable: true },
  { id: 'branch',     label: 'สาขา', sortable: false },
  { id: 'plan_months', label: 'ระยะเวลา', sortable: true },
  { id: 'status',     label: 'สถานะ', sortable: true },
  { id: 'actions',    label: 'การจัดการ', sortable: false, align: 'right' },
];

export default function CustomerTable({
  customers = [],
  sortBy = 'created_at',
  setSortBy,
  sortOrder = 'desc',
  setSortOrder,
  onRowClick,
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Reset page when customers list changes
  useEffect(() => {
    setPage(0);
  }, [customers]);

  const handleSort = (field) => {
    if (!field || !setSortBy || !setSortOrder) return;
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const paginated = customers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper
      sx={{
        borderRadius: 4, overflow: 'hidden',
        boxShadow: '6px 6px 15px rgba(163,177,198,0.3),-6px -6px 15px rgba(255,255,255,0.8)',
        border: '1px solid rgba(255,255,255,0.6)',
      }}
    >
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {HEAD_CELLS.map(cell => (
                <TableCell
                  key={cell.id}
                  align={cell.align ?? 'left'}
                  sortDirection={sortBy === cell.id ? sortOrder : false}
                >
                  {cell.sortable ? (
                    <TableSortLabel
                      active={sortBy === cell.id}
                      direction={sortBy === cell.id ? sortOrder : 'asc'}
                      onClick={() => handleSort(cell.id)}
                      sx={{
                        fontSize: '0.6875rem', fontWeight: 800, color: '#9ca3af',
                        textTransform: 'uppercase', letterSpacing: '0.08em',
                        whiteSpace: 'nowrap',
                        '&.Mui-active': { color: 'primary.main' },
                        '& .MuiTableSortLabel-icon': { color: 'primary.main !important' },
                      }}
                    >
                      {cell.label}
                    </TableSortLabel>
                  ) : (
                    <Typography sx={{ fontSize: '0.6875rem', fontWeight: 800, color: '#9ca3af',
                                      textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
                      {cell.label}
                    </Typography>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                  <Typography sx={{ fontSize: '0.75rem', color: 'text.disabled' }}>
                    ไม่พบรายชื่อบัญชีลูกค้าตามคำค้นหาและเงื่อนไขตัวกรอง
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginated.map(c => {
                const s = getCustomerStatus(c.status);
                const isOverdue = c.status === 'overdue';
                return (
                  <TableRow
                    key={c.id}
                    hover
                    onClick={() => onRowClick && onRowClick(c.id)}
                    sx={{
                      cursor: 'pointer',
                      bgcolor: isOverdue ? '#FFF0F2' : 'inherit',
                      borderLeft: '3px solid',
                      borderLeftColor: isOverdue ? '#C81E1E' : 'transparent',
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: isOverdue ? '#FFE3E7 !important' : '#f8fafc !important',
                      },
                    }}
                  >
                    <TableCell>
                      <Typography sx={{ fontSize: '0.75rem', color: '#9ca3af', fontFamily: 'monospace' }}>
                        {formatContractId(c.id)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: '#111827', whiteSpace: 'nowrap' }}>
                        {c.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '0.75rem', color: '#6b7280', fontFamily: 'monospace' }}>
                        {c.phone}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#374151' }}>
                        {c.product}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>{c.branch}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                        {c.plan_months} เดือน
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={s.label}
                        size="small"
                        variant="outlined"
                        sx={{ ...s.chipSx, fontSize: '0.625rem', fontWeight: 700, height: 20, borderRadius: 1 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small" variant="text" endIcon={<ChevronRightIcon sx={{ fontSize: '14px !important' }} />}
                        sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'primary.main',
                              '&:hover': { bgcolor: '#EEF2FF' } }}
                      >
                        ดูประวัติ
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
        count={customers.length}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={e => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
        rowsPerPageOptions={[5, 10, 20, 50]}
        labelRowsPerPage="แสดงหน้าละ:"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} จาก ${count} รายการ`}
        sx={{
          borderTop: '1px solid #f3f4f6',
          bgcolor: 'rgba(248,250,252,0.75)',
          '& .MuiTablePagination-select': { fontSize: '0.75rem' },
        }}
      />
    </Paper>
  );
}
