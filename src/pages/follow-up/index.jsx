import { useNavigate } from 'react-router-dom';
import { useCustomers } from '../../hooks/useCustomers';
import { useAddFollowUp } from '../../hooks/useAddFollowUp';
import { PATHS } from '../../routes/paths';
import FollowUpForm from './FollowUpForm';

export default function FollowUpPage() {
  const navigate = useNavigate();
  const { customers } = useCustomers({ sortBy: 'name', sortOrder: 'asc' });

  const {
    customerId, setCustomerId,
    type, setType,
    note, setNote,
    error, setError,
    isSubmitting,
    handleSubmit,
    selectedCust,
  } = useAddFollowUp({ customers });

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
      onCancel={() => navigate(PATHS.CUSTOMERS)}
    />
  );
}
