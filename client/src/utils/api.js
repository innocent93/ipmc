const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

const handleResponse = async (response) => {
  let data;
  try {
    data = await response.json();
  } catch {
    // Non-JSON response (e.g. an HTML error page from a misconfigured
    // host) \u2014 surface a clear message instead of a cryptic parse error.
    throw new ApiError(`Unexpected response from server (status ${response.status})`, response.status);
  }
  if (!response.ok) {
    throw new ApiError(data.message || 'Something went wrong', response.status);
  }
  return data;
};

const apiFetch = (url, options = {}, timeoutMs = 10000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  return fetch(url, {
    ...options,
    signal: controller.signal,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
    .then(handleResponse)
    .catch((err) => {
      if (err.name === 'AbortError') {
        throw new ApiError('Request timed out \u2014 the server took too long to respond.', undefined);
      }
      // Network-level failure: no VITE_API_URL configured, backend not
      // deployed, CORS rejection, DNS failure, etc.
      if (err instanceof ApiError) throw err;
      throw new ApiError('Could not reach the server. Please check your connection.', undefined);
    })
    .finally(() => clearTimeout(timer));
};

export const api = {
  // Services
  getServices: (params = '') => apiFetch(`${API_BASE_URL}/services${params}`).then(r => r.data),
  getService: (slug) => apiFetch(`${API_BASE_URL}/services/${slug}`).then(r => r.data),

  // Blog
  getPosts: (params = '') => apiFetch(`${API_BASE_URL}/blog${params}`).then(r => r.data),
  getPost: (slug) => apiFetch(`${API_BASE_URL}/blog/${slug}`).then(r => r.data),
  getRelatedPosts: (slug) => apiFetch(`${API_BASE_URL}/blog/${slug}/related`).then(r => r.data),

  // Team
  getTeam: (params = '') => apiFetch(`${API_BASE_URL}/team${params}`).then(r => r.data),

  // Partners
  getPartners: () => apiFetch(`${API_BASE_URL}/partners`).then(r => r.data),

  // Contact
  submitContact: (data) => apiFetch(`${API_BASE_URL}/contact`, { method: 'POST', body: JSON.stringify(data) }),

  // Newsletter
  subscribe: (email) => apiFetch(`${API_BASE_URL}/newsletter/subscribe`, { method: 'POST', body: JSON.stringify({ email }) }),

  // ESG
  getESGReports: (params = '') => apiFetch(`${API_BASE_URL}/esg${params}`).then(r => r.data),
  getESGReport: (id) => apiFetch(`${API_BASE_URL}/esg/${id}`).then(r => r.data),

  // Jobs
  getJobs: (params = '') => apiFetch(`${API_BASE_URL}/jobs${params}`).then(r => r.data),
  getJob: (slug) => apiFetch(`${API_BASE_URL}/jobs/${slug}`).then(r => r.data),

  // Search
  search: (q, limit = 10) => apiFetch(`${API_BASE_URL}/search?q=${encodeURIComponent(q)}&limit=${limit}`).then(r => r.data),

  // Settings (public)
  getPublicSettings: () => apiFetch(`${API_BASE_URL}/settings/public`).then(r => r.data),
};

export default api;
