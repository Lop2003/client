import { request } from "./apiClient";

/**
 * READ — ดึงรายการ feedbacks พร้อม filter (branch, category, rating)
 */
export async function fetchFeedbacks(params = {}) {
  const query = new URLSearchParams();
  if (params.branch) query.append("branch", params.branch);
  if (params.category) query.append("category", params.category);
  if (params.rating) query.append("rating", params.rating);
  const qs = query.toString();
  return request(`/api/feedbacks/${qs ? `?${qs}` : ""}`);
}
