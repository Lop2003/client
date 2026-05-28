import { useState, useEffect, useCallback } from "react";
import { fetchFollowUps } from "../services/followUpService";

/**
 * useFollowUps — custom hook สำหรับจัดการ state รายการการติดตามลูกค้า
 * มี active flag ป้องกัน Race Condition และคืนค่า pagination ครบชุด
 */
export function useFollowUps(options = {}) {
  const {
    search = "",
    type = "",
    status = "",
    branch = "",
    page = 1,
    limit = 10,
  } = options;

  const [followUps, setFollowUps] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(page);
  const [currentLimit, setCurrentLimit] = useState(limit);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadFollowUps = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchFollowUps({
        search,
        type,
        status,
        branch,
        page: currentPage,
        limit: currentLimit,
      });
      setFollowUps(data?.items || []);
      setTotal(data?.total ?? 0);
      setTotalPages(data?.total_pages ?? 1);
    } catch (err) {
      console.error("Failed to fetch follow-ups:", err);
      setError("ไม่สามารถโหลดข้อมูลการติดตามลูกค้าได้");
      setFollowUps([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [search, type, status, branch, currentPage, currentLimit]);

  // Reset to first page when any search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, type, status, branch]);

  // Active flag flow
  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchFollowUps({
          search,
          type,
          status,
          branch,
          page: currentPage,
          limit: currentLimit,
        });
        if (active) {
          setFollowUps(data?.items || []);
          setTotal(data?.total ?? 0);
          setTotalPages(data?.total_pages ?? 1);
        }
      } catch (err) {
        if (active) {
          console.error("Failed to fetch follow-ups:", err);
          setError("ไม่สามารถโหลดข้อมูลการติดตามลูกค้าได้");
          setFollowUps([]);
          setTotal(0);
          setTotalPages(1);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, [search, type, status, branch, currentPage, currentLimit]);

  return {
    followUps,
    total,
    totalPages,
    page: currentPage,
    limit: currentLimit,
    setPage: setCurrentPage,
    setLimit: setCurrentLimit,
    isLoading,
    error,
    refetch: loadFollowUps,
  };
}

export default useFollowUps;
