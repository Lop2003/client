import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCustomers } from '../../hooks/useCustomers';
import { useAddFollowUp } from '../../hooks/useAddFollowUp';
import FollowUpForm from './components/FollowUpForm';
import FollowUpTaskManager from './components/FollowUpTaskManager';

export default function FollowUpPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const hasCustomerIdParam = searchParams.has('customerId');

  const [searchVal, setSearchVal] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce การค้นหาฝั่งเซิร์ฟเวอร์
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchVal);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchVal]);

  const { customers, isLoading: searchLoading } = useCustomers({
    search: debouncedSearch,
    sortBy: 'name',
    sortOrder: 'asc',
    limit: 100, // โหลดสูงสุด 100 รายการต่อการค้นหา
  });

  const {
    customerId, setCustomerId,
    type, setType,
    note, setNote,
    error, setError,
    isSubmitting,
    handleSubmit,
    selectedCust,
  } = useAddFollowUp({ customers });

  // Render list manager if customerId param is not present in URL
  if (!hasCustomerIdParam) {
    return <FollowUpTaskManager />;
  }

  return (
    <FollowUpForm
      customers={customers}
      customerId={customerId}
      setCustomerId={setCustomerId}
      type={type}
      setType={setType}
      note={note}
      setNote={setNote}
      error={error}
      setError={setError}
      isSubmitting={isSubmitting}
      handleSubmit={handleSubmit}
      selectedCust={selectedCust}
      onSearchChange={setSearchVal}
      searchLoading={searchLoading}
      onCancel={() => setSearchParams({})}
    />
  );
}
