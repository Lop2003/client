import { useState, useEffect, useCallback } from "react";
import { fetchCustomers } from "../services/customerService";

/**
 * useCustomers — fetch รายการลูกค้าจาก API พร้อม server-side pagination
 * ส่ง params ทุกตัวไปให้ backend: search, branch, status, sort_by, sort_order, page, limit
 * ไม่ทำ client-side filtering/sorting/pagination เพื่อให้ข้อมูลตรงกับ backend เสมอ
 */
export function useCustomers(options = {}) {
  const {
    search = "",
    branch = "",
    status = "",
    sortBy = "created_at",
    sortOrder = "desc",
    page = 1,
    limit = 10,
  } = options;

  const [customers, setCustomers] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(page);
  const [currentLimit, setCurrentLimit] = useState(limit);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCustomers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchCustomers({
        search,
        branch,
        status,
        sortBy,
        sortOrder,
        page: currentPage,
        limit: currentLimit,
      });
      // data คือ PaginatedCustomerResponse: { items, total, page, limit, total_pages }
      setCustomers(data?.items || []);
      setTotal(data?.total ?? 0);
      setTotalPages(data?.total_pages ?? 1);
    } catch (err) {
      console.error("Failed to fetch customers:", err);
      setError("ไม่สามารถโหลดข้อมูลรายชื่อลูกค้าได้");
      setCustomers([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [search, branch, status, sortBy, sortOrder, currentPage, currentLimit]);

  // Reset กลับหน้าแรกเมื่อ filter/sort เปลี่ยน
  useEffect(() => {
    setCurrentPage(1);
  }, [search, branch, status, sortBy, sortOrder]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  return {
    customers,
    total,
    totalPages,
    page: currentPage,
    limit: currentLimit,
    setPage: setCurrentPage,
    setLimit: setCurrentLimit,
    isLoading,
    error,
    refetch: loadCustomers,
  };
}

export default useCustomers;
