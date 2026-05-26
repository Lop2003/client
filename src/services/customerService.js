import { request } from './apiClient';

export async function fetchCustomers(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.branch) query.append('branch', params.branch);
  if (params.status) query.append('status', params.status);
  if (params.sortBy) query.append('sort_by', params.sortBy);
  if (params.sortOrder) query.append('sort_order', params.sortOrder);
  const qs = query.toString();
  return request(`/api/customers${qs ? `?${qs}` : ''}`);
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
