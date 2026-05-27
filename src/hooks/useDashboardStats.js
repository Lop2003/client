import { useState, useEffect, useCallback, useMemo } from "react";
import { fetchSummary, fetchBranchStats } from "../services/statsService";

/**
 * useDashboardStats — fetch summary + branch stats สำหรับ dashboard
 * ไม่ดึง customers ทั้งหมดแล้ว — ย้ายไป filter ที่ backend แทน
 */
export function useDashboardStats(options = {}) {
  const { branch = "" } = options;

  const [apiSummary, setApiSummary] = useState(null);
  const [branchStats, setBranchStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [summaryResult, branchResult] =
        await Promise.allSettled([
          fetchSummary(),
          fetchBranchStats(),
        ]);

      if (summaryResult.status === "fulfilled") {
        setApiSummary(summaryResult.value);
      } else {
        console.error("fetchSummary failed:", summaryResult.reason);
      }

      if (branchResult.status === "fulfilled") {
        setBranchStats(branchResult.value || []);
      } else {
        console.error("fetchBranchStats failed:", branchResult.reason);
      }

      // แสดง error เฉพาะเมื่อ summary หลักโหลดไม่ได้
      if (
        summaryResult.status === "rejected" &&
        branchResult.status === "rejected"
      ) {
        setError("ไม่สามารถโหลดข้อมูลสถิติแดชบอร์ดได้");
      }
    } catch (err) {
      console.error("Unexpected error in loadData:", err);
      setError("ไม่สามารถโหลดข้อมูลสถิติแดชบอร์ดได้");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Compute summary stats dynamically สำหรับ branch ที่เลือก หรือ overall
  const summaryStats = useMemo(() => {
    if (branch && branchStats.length > 0) {
      const bStat = branchStats.find((s) => s.branch === branch);
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
        satisfactionRate: "0", // คำนวณจาก useFeedbacks แทน
      };
    }
    return {
      totalCustomers: 0,
      avgRating: "0.0",
      overdueCount: 0,
      satisfactionRate: "0",
    };
  }, [apiSummary, branch, branchStats]);

  // Compute branch list จาก branchStats เพื่อใช้แทน useBranches
  const branches = useMemo(() => {
    if (!branchStats || branchStats.length === 0) return [];
    const list = [...new Set(branchStats.map(s => s.branch).filter(Boolean))];
    return list.sort();
  }, [branchStats]);

  return {
    summaryStats,
    branchStats,
    branches,
    isLoading,
    error,
    refetch: loadData,
  };
}

export default useDashboardStats;
