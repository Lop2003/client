import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { useSearchParams, useNavigate } from 'react-router-dom';

import FollowUpStatCards from './FollowUpStatCards';
import FollowUpFilterBar from './FollowUpFilterBar';
import FollowUpTable from './FollowUpTable';
import { useFollowUps } from '../../../hooks/useFollowUps';
import { useBranches } from '../../../hooks/useBranches';
import { updateFollowUpStatus } from '../../../services/followUpMutations';
import { showToast } from '../../../components/Toast';
import { PATHS } from '../../../routes/paths';

export default function FollowUpTaskManager() {
  const navigate = useNavigate();
  const [, setSearchParams] = useSearchParams();

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedType, setSelectedType] = useState('');

  // Refetch triggers for stat cards
  const [triggerRefetch, setTriggerRefetch] = useState(0);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Load Main Data List
  const {
    followUps,
    total,
    page,
    limit,
    setPage,
    setLimit,
    isLoading,
    refetch,
  } = useFollowUps({
    search: debouncedSearch,
    branch: selectedBranch,
    status: selectedStatus,
    type: selectedType,
  });

  const { branches } = useBranches();

  // Status mutation action
  const handleStatusToggle = async (id, newStatus) => {
    try {
      await updateFollowUpStatus(id, newStatus);
      showToast('success', 'อัปเดตสถานะรายการติดตามสำเร็จ');
      refetch();
      setTriggerRefetch(prev => prev + 1);
    } catch (err) {
      showToast('error', `อัปเดตไม่สำเร็จ: ${err?.message ?? 'Unknown error'}`);
    }
  };

  // View customer details (redirects to customer profile and triggers details modal)
  const handleViewCustomer = (customerId) => {
    navigate(`${PATHS.CUSTOMERS}?id=${customerId}`);
  };

  // Switch to add follow-up form mode
  const handleAddFollowUp = () => {
    setSearchParams({ customerId: '' });
  };

  const isSearching = searchQuery !== debouncedSearch;
  const showLoading = isLoading || isSearching;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
      {/* Upper header action area */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 46, height: 46, borderRadius: 3,
              bgcolor: 'rgba(0, 81, 186, 0.06)', color: 'primary.main',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              boxShadow: '0 4px 12px rgba(0, 81, 186, 0.08)'
            }}
          >
            <NotificationsActiveIcon sx={{ fontSize: 22 }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: '1rem', fontWeight: 800, color: 'text.primary', letterSpacing: '-0.010em' }}>
              ระบบบริหารจัดการงานโทรติดตามลูกค้า (Follow-Up Task Board)
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 500, mt: 0.25 }}>
              ติดตามทวงถามค่างวด ประสานชี้แจงข้อร้องเรียนความพึงพอใจ และเจรจามอบสิทธิเสนอดีลพิเศษลูกค้า
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={handleAddFollowUp}
          startIcon={<AddIcon />}
          sx={{
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: 800,
            px: 3,
            py: 1.25,
            boxShadow: '0 4px 12px rgba(0, 81, 186, 0.15)',
          }}
        >
          บันทึกการโทรติดตามใหม่
        </Button>
      </Box>

      {/* Metrics Card Row */}
      <FollowUpStatCards
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        triggerRefetch={triggerRefetch}
      />

      {/* Filter and Search Bar */}
      <FollowUpFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedBranch={selectedBranch}
        setSelectedBranch={setSelectedBranch}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        branches={branches}
        isLoading={showLoading}
      />

      {/* Main Datatable */}
      <FollowUpTable
        followUps={followUps}
        total={total}
        page={page}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={setLimit}
        onStatusToggle={handleStatusToggle}
        onViewCustomer={handleViewCustomer}
        isLoading={showLoading}
      />
    </Box>
  );
}
