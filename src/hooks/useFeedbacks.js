import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchFeedbacks } from '../services/feedbackService';

/**
 * useFeedbacks — fetch feedbacks ทั้งหมด และ filter ตาม branch
 * ถ้า branch ว่างหรือไม่ระบุ → return feedbacks ทั้งหมด
 * @param {Object} options
 * @param {string} [options.branch] - กรอง feedback ตามสาขา
 * @param {Map} [options.customerBranchMap] - Map<customerId, branch> สำหรับ filter
 */
export function useFeedbacks(options = {}) {
  const { branch = '', customerBranchMap = new Map() } = options;

  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadFeedbacks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchFeedbacks();
      setFeedbacks(data || []);
    } catch (err) {
      console.error('Failed to fetch feedbacks:', err);
      setError('ไม่สามารถโหลดข้อมูลคำติชมได้');
      setFeedbacks([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeedbacks();
  }, [loadFeedbacks]);

  // Filter feedbacks by branch ถ้ามี customerBranchMap และ branch ระบุ
  const filteredFeedbacks = useMemo(() => {
    if (!branch || customerBranchMap.size === 0) return feedbacks;
    return feedbacks.filter(fb => customerBranchMap.get(fb.customer_id) === branch);
  }, [feedbacks, branch, customerBranchMap]);

  return {
    feedbacks,
    filteredFeedbacks,
    isLoading,
    error,
    refetch: loadFeedbacks,
  };
}

export default useFeedbacks;
