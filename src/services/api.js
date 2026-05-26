/**
 * API Service Layer — UFriend CX Dashboard
 *
 * Centralized HTTP client for the Go Fiber backend.
 * Vite dev server proxies `/api` → `http://localhost:3000`.
 * Unwraps the standard envelope: { success, message, data }
 */

const BASE_URL = 'http://localhost:3000';

async function request(url, options = {}) {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || json.error || `Request failed: ${res.status}`);
  }
  return json.data;
}

// ─── Customers ────────────────────────────────────────────────────────────────

export async function fetchCustomers(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.branch) query.append('branch', params.branch);
  if (params.status) query.append('status', params.status);
  if (params.sortBy) query.append('sort_by', params.sortBy);
  if (params.sortOrder) query.append('sort_order', params.sortOrder);
  const qs = query.toString();
  return request(`/api/customers/${qs ? `?${qs}` : ''}`);
}

// Request deduplication for detail fetches
const pendingDetailRequests = new Map();

export async function fetchCustomerDetail(id) {
  const existing = pendingDetailRequests.get(id);
  if (existing) return existing;

  const promise = request(`/api/customers/${id}`).finally(() =>
    pendingDetailRequests.delete(id)
  );
  pendingDetailRequests.set(id, promise);
  return promise;
}

// ─── Stats ─────────────────────────────────────────────────────────────────

export async function fetchSummary() {
  return request('/api/stats/summary');
}

export async function fetchBranchStats(branch) {
  const url = branch
    ? `/api/stats/by-branch?branch=${encodeURIComponent(branch)}`
    : '/api/stats/by-branch';
  return request(url);
}

// ─── Feedback ──────────────────────────────────────────────────────────────

export async function fetchFeedbacks() {
  return request('/api/feedbacks/');
}

export async function createFeedback(payload) {
  return request('/api/feedbacks/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ─── Follow-Up ─────────────────────────────────────────────────────────────

export async function createFollowUp(payload) {
  return request('/api/follow-ups/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateFollowUpStatus(id, status) {
  return request(`/api/follow-ups/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}
