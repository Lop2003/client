import { request } from './apiClient';

export async function fetchSummary() {
  return request('/api/stats/summary');
}

export async function fetchBranchStats(branch) {
  const url = branch
    ? `/api/stats/by-branch?branch=${encodeURIComponent(branch)}`
    : '/api/stats/by-branch';
  return request(url);
}
