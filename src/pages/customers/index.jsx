import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Paper from '@mui/material/Paper';
import SearchIcon from '@mui/icons-material/Search';
import { useSearchParams } from 'react-router-dom';
import CustomerTable from './CustomerTable';
import CustomerDetailModal from './CustomerDetailModal';
import { useCustomers } from '../../hooks/useCustomers';
import { useBranches } from '../../hooks/useBranches';

const StatCard = ({ label, value, color, isActive, onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      bgcolor: '#fff', p: 2, borderRadius: 3, border: '2px solid',
      borderColor: isActive ? color : '#f3f4f6',
      cursor: 'pointer', transition: 'all 0.2s',
      boxShadow: isActive ? `0 0 0 3px ${color}22` : 'none',
      '&:hover': { borderColor: color, boxShadow: `0 0 0 3px ${color}18` },
      '&:active': { transform: 'scale(0.98)' },
    }}
  >
    <Typography sx={{ fontSize: '0.6875rem', fontWeight: 800, color: '#9ca3af',
                      textTransform: 'uppercase', letterSpacing: '0.08em' }}>
      {label}
    </Typography>
    <Typography sx={{ fontSize: '1.375rem', fontWeight: 900, color, mt: 0.5 }}>
      {value} ราย
    </Typography>
  </Box>
);

export default function CustomersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCustomerId = searchParams.get('id');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  const { customers } = useCustomers({
    search: searchQuery,
    branch: selectedBranch,
    status: selectedStatus,
    sortBy,
    sortOrder,
  });

  const { branches: uniqueBranches } = useBranches();

  const total     = customers.length;
  const active    = customers.filter(c => c.status === 'active').length;
  const overdue   = customers.filter(c => c.status === 'overdue').length;
  const completed = customers.filter(c => c.status === 'completed').length;


  const handleCloseModal = () => {
    setSearchParams({});
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

      {/* Quick Stats - Responsive 4 columns on Desktop, 2 columns on Mobile */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}>
        <StatCard label="ลูกค้าทั้งหมด"   value={total}     color="#0051BA" isActive={selectedStatus === ''}         onClick={() => setSelectedStatus('')} />
        <StatCard label="ผ่อนชำระปกติ"   value={active}    color="#057A55" isActive={selectedStatus === 'active'}    onClick={() => setSelectedStatus(selectedStatus === 'active' ? '' : 'active')} />
        <StatCard label="ค้างชำระค่างวด" value={overdue}   color="#C81E1E" isActive={selectedStatus === 'overdue'}   onClick={() => setSelectedStatus(selectedStatus === 'overdue' ? '' : 'overdue')} />
        <StatCard label="จบสัญญาแล้ว"    value={completed} color="#64748b" isActive={selectedStatus === 'completed'} onClick={() => setSelectedStatus(selectedStatus === 'completed' ? '' : 'completed')} />
      </Box>

      {/* Filter Bar */}
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, display: 'flex', flexWrap: 'wrap',
                                       gap: 1.5, alignItems: 'center', borderColor: 'divider' }}>
        <TextField
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="ค้นหาชื่อลูกค้า, เบอร์โทร, สินค้าผ่อน..."
          sx={{ flex: 1, minWidth: 200 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <Select
            value={selectedBranch}
            onChange={e => setSelectedBranch(e.target.value)}
            displayEmpty
            sx={{ borderRadius: 3, fontSize: '0.75rem' }}
          >
            <MenuItem value=""><em>สาขา: ทั้งหมด</em></MenuItem>
            {uniqueBranches.map(br => <MenuItem key={br} value={br}>{br}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <Select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            displayEmpty
            sx={{ borderRadius: 3, fontSize: '0.75rem' }}
          >
            <MenuItem value=""><em>สถานะ: ทั้งหมด</em></MenuItem>
            <MenuItem value="active">ปกติ (Active)</MenuItem>
            <MenuItem value="overdue">ค้างชำระ (Overdue)</MenuItem>
            <MenuItem value="completed">จบสัญญา (Completed)</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      {/* Table */}
      <CustomerTable
        customers={customers}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        onRowClick={id => setSearchParams({ id })}
      />

      {/* Detail Modal */}
      {!!selectedCustomerId && (
        <CustomerDetailModal
          selectedCustomerId={selectedCustomerId}
          isOpen={!!selectedCustomerId}
          onClose={handleCloseModal}
        />
      )}
    </Box>
  );
}
