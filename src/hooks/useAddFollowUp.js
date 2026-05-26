import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createFollowUp } from '../services/followUpMutations';
import { showToast } from '../components/Toast';
import { PATHS } from '../routes/paths';

export function useAddFollowUp(options = {}) {
  const { customers = [] } = options;
  const navigate = useNavigate();
  const location = useLocation();

  const routerCustomerId = location.state?.customerId;

  const [customerId, setCustomerId] = useState(routerCustomerId || '');
  const [type, setType] = useState('payment_remind');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (routerCustomerId) {
      setCustomerId(routerCustomerId);
    }
  }, [routerCustomerId]);

  const selectedCust = customers.find(c => c.id === customerId);

  // Auto-switch to payment_remind when overdue customer selected
  useEffect(() => {
    if (selectedCust?.status === 'overdue') {
      setType('payment_remind');
    }
  }, [customerId, selectedCust]);

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!customerId) { setError('กรุณาเลือกรายชื่อลูกค้าเพื่อบันทึกการติดตาม'); return; }
    if (!note.trim()) { setError('กรุณากรอกบันทึกรายละเอียดการโทรติดตามลูกค้า'); return; }

    setIsSubmitting(true);
    try {
      await createFollowUp({
        customer_id: customerId,
        type,
        note: note.trim()
      });
      showToast('success', 'บันทึกการติดตามเรียบร้อยแล้ว');
      setError('');

      // Navigate to customers list with query param to trigger detail modal
      navigate(`${PATHS.CUSTOMERS}?id=${customerId}`);
    } catch (err) {
      showToast('error', `บันทึกไม่สำเร็จ: ${err?.message ?? 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    customerId,
    setCustomerId,
    type,
    setType,
    note,
    setNote,
    error,
    setError,
    isSubmitting,
    handleSubmit,
    selectedCust,
  };
}

export default useAddFollowUp;
