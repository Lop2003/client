import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createFeedback } from '../services/feedbackMutations';
import { showToast } from '../components/Toast';
import { PATHS } from '../routes/paths';

export function useAddFeedback() {
  const navigate = useNavigate();
  const location = useLocation();

  const routerCustomerId = location.state?.customerId;

  const [customerId, setCustomerId] = useState(routerCustomerId || '');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(-1);
  const [comment, setComment] = useState('');
  const [category, setCategory] = useState('service');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (routerCustomerId) {
      setCustomerId(routerCustomerId);
    }
  }, [routerCustomerId]);

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!customerId) { setError('กรุณาเลือกบัญชีลูกค้าเพื่อบันทึกคำติชม'); return; }
    if (!comment.trim()) { setError('กรุณากรอกความคิดเห็นหรือรายละเอียดคำติชม'); return; }

    setIsSubmitting(true);
    try {
      await createFeedback({
        customer_id: customerId,
        rating,
        comment: comment.trim(),
        category,
      });
      showToast('success', 'บันทึกคำติชมเรียบร้อยแล้ว');
      setError('');

      // Navigate to customers page with preselected customer to show detail modal
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
  };
}

export default useAddFeedback;
