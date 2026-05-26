import { request } from './apiClient';

/**
 * READ — ดึงรายการ feedbacks ทั้งหมด
 */
export async function fetchFeedbacks() {
  return request('/api/feedbacks');
}
