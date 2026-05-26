import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchCustomers } from '../services/customerService';
import { fetchSummary, fetchBranchStats } from '../services/statsService';

/**
 * useDashboardStats — fetch summary + branch stats และ compute stats cards
 * ใช้ร่วมกับ useFeedbacks สำหรับ feedbacks list
 */
export function useDashboardStats(options = {}) {
  const { branch = '' } = options;

  const [apiSummary, setApiSummary] = useState(null);
  const [branchStats, setBranchStats] = useState([]);
  const [allCustomers, setAllCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [summaryData, branchStatsData, customersData] = await Promise.all([
        fetchSummary(),
        fetchBranchStats(),
        fetchCustomers(),
      ]);
      setApiSummary(summaryData);
      setBranchStats(branchStatsData || []);
      setAllCustomers(customersData || []);
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
      setError('ไม่สามารถโหลดข้อมูลสถิติแดชบอร์ดได้');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Build customer→branch map สำหรับส่งต่อให้ useFeedbacks
  const customerBranchMap = useMemo(() => {
    return new Map(allCustomers.map(c => [c.id, c.branch]));
  }, [allCustomers]);

  // Compute summary stats dynamically สำหรับ branch ที่เลือก หรือ overall
  const summaryStats = useMemo(() => {
    if (branch && branchStats.length > 0) {
      const bStat = branchStats.find(s => s.branch === branch);
      if (bStat) {
        return {
          totalCustomers: bStat.customer_count,
          avgRating: bStat.avg_rating.toFixed(1),
          overdueCount: bStat.overdue_count,
          satisfactionRate: ((bStat.avg_rating / 5) * 100).toFixed(0),
        };
      }
    }
    if (apiSummary) {
      return {
        totalCustomers: apiSummary.total_customers,
        avgRating: apiSummary.avg_rating.toFixed(1),
        overdueCount: apiSummary.overdue_count,
        satisfactionRate: '0', // คำนวณจาก useFeedbacks แทน
      };
    }
    return { totalCustomers: 0, avgRating: '0.0', overdueCount: 0, satisfactionRate: '0' };
  }, [apiSummary, branch, branchStats]);

  return {
    summaryStats,
    branchStats,
    customerBranchMap,
    isLoading,
    error,
    refetch: loadData,
  };
}

export default useDashboardStats;

