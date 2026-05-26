import { useState, useEffect, useCallback } from "react";
import { fetchCustomers } from "../services/customerService";

/**
 * useCustomers — fetch รายการลูกค้าจาก API
 * ส่ง params ทุกตัวไปให้ backend: search, branch, status, sort_by, sort_order
 * ไม่ทำ client-side filtering/sorting เพื่อให้ข้อมูลตรงกับ backend เสมอ
 */
export function useCustomers(options = {}) {
  const {
    search = "",
    branch = "",
    status = "",
    sortBy = "created_at",
    sortOrder = "desc",
  } = options;

  const [customers, setCustomers] = useState([]);
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
      });
      setCustomers(data || []);
    } catch (err) {
      console.error("Failed to fetch customers:", err);
      setError("ไม่สามารถโหลดข้อมูลรายชื่อลูกค้าได้");
      setCustomers([]);
    } finally {
      setIsLoading(false);
    }
  }, [search, branch, status, sortBy, sortOrder]); // re-fetch ทุกครั้งที่ param เปลี่ยน

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  return {
    customers,
    isLoading,
    error,
    refetch: loadCustomers,
  };
}

export default useCustomers;
