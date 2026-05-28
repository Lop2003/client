import { request } from './apiClient';

/**
 * READ — ดึงรายการ follow-up tasks พร้อม pagination & filters
 * รองรับ params: search, type, status, branch, page, limit
 */
export async function fetchFollowUps(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.append("search", params.search);
  if (params.type) query.append("type", params.type);
  if (params.status) query.append("status", params.status);
  if (params.branch) query.append("branch", params.branch);
  if (params.page) query.append("page", params.page);
  if (params.limit) query.append("limit", params.limit);
  const qs = query.toString();
  return request(`/api/follow-ups${qs ? `?${qs}` : ""}`);
}
