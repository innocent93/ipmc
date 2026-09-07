const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://ipmc.onrender.com/api';

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
    throw new ApiError(`Unexpected response from server (status ${response.status}).`, response.status);
  }

  if (!response.ok) {
    throw new ApiError(data?.message || 'Something went wrong.', response.status);
  }

  return data;
};

const apiFetch = async (url, options = {}, timeoutMs = 10000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    return await handleResponse(response);
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new ApiError('Request timed out. Please try again.', undefined);
    }
    if (err instanceof ApiError) throw err;
    throw new ApiError('Could not reach the server. Please check your connection.', undefined);
  } finally {
    clearTimeout(timer);
  }
};

// Public list endpoints return { data: [...], pagination... } from Express.
// Keep the page components simple by exposing the array they already expect.
const listData = (response) => response?.data ?? [];
const objectData = (response) => response?.data ?? null;

export const api = {
  // Services
  getServices: (params = '') => apiFetch(`${API_BASE_URL}/services${params}`).then(listData),
  getService: (slug) => apiFetch(`${API_BASE_URL}/services/${encodeURIComponent(slug)}`).then(objectData),

  // Blog
  getPosts: (params = '') => apiFetch(`${API_BASE_URL}/blog${params}`).then(listData),
  getPost: (slug) => apiFetch(`${API_BASE_URL}/blog/${encodeURIComponent(slug)}`).then(objectData),
  getRelatedPosts: (slug) => apiFetch(`${API_BASE_URL}/blog/${encodeURIComponent(slug)}/related`).then(listData),

  // Team
  getTeam: (params = '') => apiFetch(`${API_BASE_URL}/team${params}`).then(listData),

  // Partners
  getPartners: () => apiFetch(`${API_BASE_URL}/partners`).then(listData),

  // Contact
  submitContact: (data) => apiFetch(`${API_BASE_URL}/contact`, {
    method: 'POST', body: JSON.stringify(data),
  }),

  // Newsletter
  subscribe: (email, source = 'newsletter-page') => apiFetch(`${API_BASE_URL}/newsletter/subscribe`, {
    method: 'POST', body: JSON.stringify({ email, source }),
  }),
  unsubscribeByToken: (token) => apiFetch(`${API_BASE_URL}/newsletter/unsubscribe/${encodeURIComponent(token)}`),

  // ESG
  getESGReports: (params = '') => apiFetch(`${API_BASE_URL}/esg${params}`).then(listData),
  getESGReport: (id) => apiFetch(`${API_BASE_URL}/esg/${encodeURIComponent(id)}`).then(objectData),

  // Jobs
  getJobs: (params = '') => apiFetch(`${API_BASE_URL}/jobs${params}`).then(listData),
  getJob: (slug) => apiFetch(`${API_BASE_URL}/jobs/${encodeURIComponent(slug)}`).then(objectData),

  // Search returns a grouped object rather than a simple array.
  search: (q, limit = 10) => apiFetch(
    `${API_BASE_URL}/search?q=${encodeURIComponent(q)}&limit=${limit}`
  ).then((response) => response?.data || {
    services: [], blogs: [], esg: [], jobs: [], team: [], total: 0,
  }),

  // Settings (public)
  getPublicSettings: () => apiFetch(`${API_BASE_URL}/settings/public`).then(objectData),

  // Events + RSVP
  getEvents: (params = '') => apiFetch(`${API_BASE_URL}/events${params}`).then(listData),
  getEvent: (slug) => apiFetch(`${API_BASE_URL}/events/${encodeURIComponent(slug)}`).then(objectData),
  rsvpToEvent: (slug, data) => apiFetch(`${API_BASE_URL}/events/${encodeURIComponent(slug)}/rsvp`, {
    method: 'POST', body: JSON.stringify(data),
  }),

  // Job applications
  applyToJob: (jobId, data) => apiFetch(`${API_BASE_URL}/jobs/${encodeURIComponent(jobId)}/apply`, {
    method: 'POST', body: JSON.stringify(data),
  }),

  // Newsletter archive
  getNewsletterArchive: (params = '') => apiFetch(`${API_BASE_URL}/newsletter/archive${params}`).then(listData),
  getNewsletterIssue: (slug) => apiFetch(`${API_BASE_URL}/newsletter/archive/${encodeURIComponent(slug)}`).then(objectData),
};

export default api;
