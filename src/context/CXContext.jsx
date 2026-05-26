import { createContext, useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import * as api from '../services/api';
import { showToast } from '../components/Toast';
import { PATHS } from '../routes/paths';

export const CXContext = createContext(undefined);

/** Map current URL pathname to the legacy currentPage string */
function pathToPage(pathname) {
  switch (pathname) {
    case PATHS.DASHBOARD:    return 'dashboard';
    case PATHS.CUSTOMERS:    return 'customers';
    case PATHS.ADD_FEEDBACK: return 'add-feedback';
    case PATHS.FOLLOW_UP:    return 'add-followup';
    default:                 return 'dashboard';
  }
}

export function CXProvider({ children }) {
  const location = useLocation();
  const currentPage = pathToPage(location.pathname);

  // ─── Modal State ───────────────────────────────────────────────────────────
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // ─── Data State ────────────────────────────────────────────────────────────
  const [customers, setCustomers] = useState([]);
  const [allCustomers, setAllCustomers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [followUps] = useState([]);
  const [branchStats, setBranchStats] = useState([]);
  const [apiSummary, setApiSummary] = useState(null);

  // ─── Loading & Error State ─────────────────────────────────────────────────
  const [isLoading, setIsLoading] = useState(true);
  const hasLoadedCustomersRef = useRef(false);
  const [apiError, setApiError] = useState(null);
  const [isApiConnected, setIsApiConnected] = useState(false);

  // ─── Filter State ──────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // ─── Sorting State ─────────────────────────────────────────────────────────
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedBranch('');
    setSelectedStatus('');
    setSortBy('created_at');
    setSortOrder('desc');
  };

  // ─── Dashboard Data Loader ─────────────────────────────────────────────────
  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const [summaryData, feedbacksData] = await Promise.all([
        api.fetchSummary(),
        api.fetchFeedbacks(),
      ]);
      setApiSummary(summaryData);
      setFeedbacks(feedbacksData);
      setIsApiConnected(true);
    } catch (err) {
      console.error('Dashboard API unavailable:', err);
      setIsApiConnected(false);
      setApiError('ไม่สามารถเชื่อมต่อ API สถิติได้');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ─── Branch Stats Loader ───────────────────────────────────────────────────
  const fetchBranchStatsData = useCallback(async (branch) => {
    try {
      const data = await api.fetchBranchStats(branch);
      setBranchStats(data);
    } catch (err) {
      console.warn('Failed to fetch branch stats', err);
      setBranchStats([]);
    }
  }, []);

  useEffect(() => {
    fetchBranchStatsData(selectedBranch);
  }, [selectedBranch, fetchBranchStatsData]);

  // ─── Customer List Loader ──────────────────────────────────────────────────
  const loadCustomerListData = useCallback(async () => {
    if (!hasLoadedCustomersRef.current) setIsLoading(true);
    setApiError(null);
    try {
      const isFormPage = currentPage === 'add-feedback' || currentPage === 'add-followup';
      const searchVal  = isFormPage ? '' : searchQuery;
      const branchVal  = isFormPage ? '' : selectedBranch;
      const statusVal  = isFormPage ? '' : selectedStatus;

      const customersData = await api.fetchCustomers({
        search:    searchVal,
        branch:    branchVal,
        status:    statusVal,
        sortBy:    isFormPage ? 'name' : sortBy,
        sortOrder: isFormPage ? 'asc'  : sortOrder,
      });

      setCustomers(customersData || []);
      if (!searchVal && !branchVal && !statusVal) {
        setAllCustomers(customersData || []);
      }
      setIsApiConnected(true);
      hasLoadedCustomersRef.current = true;
    } catch (err) {
      console.warn('Customer API unavailable:', err);
      setCustomers([]);
      setIsApiConnected(false);
      setApiError('ไม่สามารถเชื่อมต่อ API รายชื่อลูกค้าได้');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedBranch, selectedStatus, sortBy, sortOrder, currentPage]);

  // Page-level data loading triggers
  useEffect(() => {
    if (currentPage === 'dashboard') loadDashboardData();
  }, [currentPage, loadDashboardData]);

  useEffect(() => {
    hasLoadedCustomersRef.current = false;
  }, [currentPage]);

  useEffect(() => {
    if (['dashboard', 'customers', 'add-feedback', 'add-followup'].includes(currentPage)) {
      loadCustomerListData();
    }
  }, [currentPage, loadCustomerListData]);

  // Auto-select first customer on customer page
  useEffect(() => {
    if (currentPage === 'customers' && !isDetailModalOpen && customers.length > 0) {
      if (!selectedCustomerId || !customers.some(c => c.id === selectedCustomerId)) {
        setSelectedCustomerId(customers[0].id);
      }
    }
  }, [customers, selectedCustomerId, currentPage, isDetailModalOpen]);

  // ─── Computed / Filtered Data ──────────────────────────────────────────────
  const filteredCustomers = customers;

  const filteredFeedbacks = useMemo(() => {
    if (!selectedBranch) return feedbacks;
    const branchMap = new Map(allCustomers.map(c => [c.id, c.branch]));
    return feedbacks.filter(fb => branchMap.get(fb.customer_id) === selectedBranch);
  }, [feedbacks, allCustomers, selectedBranch]);

  const summaryStats = useMemo(() => {
    if (selectedBranch && branchStats.length > 0) {
      const bStat = branchStats.find(s => s.branch === selectedBranch);
      if (bStat) {
        return {
          totalCustomers:   bStat.customer_count,
          avgRating:        bStat.avg_rating.toFixed(1),
          overdueCount:     bStat.overdue_count,
          satisfactionRate: ((bStat.avg_rating / 5) * 100).toFixed(0),
        };
      }
    }
    if (apiSummary) {
      const satisfactionRate = feedbacks.length > 0
        ? ((feedbacks.filter(fb => fb.sentiment === 'positive').length / feedbacks.length) * 100).toFixed(0)
        : '0';
      return {
        totalCustomers:   apiSummary.total_customers,
        avgRating:        apiSummary.avg_rating.toFixed(1),
        overdueCount:     apiSummary.overdue_count,
        satisfactionRate,
      };
    }
    const totalCustomers = allCustomers.length > 0 ? allCustomers.length : customers.length;
    const avgRating = feedbacks.length > 0
      ? (feedbacks.reduce((acc, fb) => acc + fb.rating, 0) / feedbacks.length).toFixed(1)
      : '0.0';
    const base = allCustomers.length > 0 ? allCustomers : customers;
    const overdueCount = base.filter(c => c.status === 'overdue').length;
    const positiveFeedbacks = feedbacks.filter(fb => fb.sentiment === 'positive').length;
    const satisfactionRate = feedbacks.length > 0
      ? ((positiveFeedbacks / feedbacks.length) * 100).toFixed(0)
      : '0';
    return { totalCustomers, avgRating, overdueCount, satisfactionRate };
  }, [apiSummary, customers, feedbacks, selectedBranch, branchStats, allCustomers]);

  // ─── Mutations ─────────────────────────────────────────────────────────────
  const addFeedback = async (newFb) => {
    setSelectedCustomerId(newFb.customer_id);
    try {
      await api.createFeedback({
        customer_id: newFb.customer_id,
        rating:      newFb.rating,
        comment:     newFb.comment,
        category:    newFb.category,
      });
      showToast('success', 'บันทึกคำติชมเรียบร้อยแล้ว');
      setIsDetailModalOpen(true);
      return true;
    } catch (err) {
      showToast('error', `บันทึกไม่สำเร็จ: ${err?.message ?? 'Unknown error'}`);
      return false;
    }
  };

  const addFollowUp = async (newFu) => {
    setSelectedCustomerId(newFu.customer_id);
    try {
      await api.createFollowUp({
        customer_id: newFu.customer_id,
        type:        newFu.type,
        note:        newFu.note,
      });
      showToast('success', 'บันทึกการติดตามเรียบร้อยแล้ว');
      setIsDetailModalOpen(true);
      return true;
    } catch (err) {
      showToast('error', `บันทึกไม่สำเร็จ: ${err?.message ?? 'Unknown error'}`);
      return false;
    }
  };

  const navigateToCustomerDetail = (id) => {
    setSelectedCustomerId(id);
    setIsDetailModalOpen(true);
  };

  // ─── Context Value ─────────────────────────────────────────────────────────
  const contextValue = useMemo(() => ({
    currentPage,
    selectedCustomerId, setSelectedCustomerId,
    isDetailModalOpen, setIsDetailModalOpen, navigateToCustomerDetail,
    customers, feedbacks, followUps, branchStats,
    addFeedback, addFollowUp,
    searchQuery, setSearchQuery,
    selectedBranch, setSelectedBranch,
    selectedStatus, setSelectedStatus,
    resetFilters,
    filteredCustomers, filteredFeedbacks, summaryStats,
    isLoading, apiError, isApiConnected,
    sortBy, setSortBy, sortOrder, setSortOrder,
  }), [
    currentPage, selectedCustomerId, isDetailModalOpen,
    customers, feedbacks, followUps, branchStats,
    searchQuery, selectedBranch, selectedStatus,
    filteredCustomers, filteredFeedbacks, summaryStats,
    isLoading, apiError, isApiConnected,
    sortBy, sortOrder,
  ]);

  return (
    <CXContext.Provider value={contextValue}>
      {children}
    </CXContext.Provider>
  );
}
