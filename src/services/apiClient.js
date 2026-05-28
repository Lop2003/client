const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function request(url, options = {}) {
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

export default request;
