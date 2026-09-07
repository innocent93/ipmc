const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://ipmc.onrender.com/api';

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

// The API and admin app are deployed on different domains. A browser page on
// Vercel cannot read a non-httpOnly cookie owned by the Render API domain, so
// the CSRF token is returned by the API and kept in sessionStorage instead.
const CSRF_STORAGE_KEY = 'ipmc_csrf_token';
let csrfToken = typeof window !== 'undefined'
  ? sessionStorage.getItem(CSRF_STORAGE_KEY)
  : null;

const setCsrfToken = (token) => {
  if (!token || typeof window === 'undefined') return;
  csrfToken = token;
  sessionStorage.setItem(CSRF_STORAGE_KEY, token);
};

const clearCsrfToken = () => {
  csrfToken = null;
  if (typeof window !== 'undefined') sessionStorage.removeItem(CSRF_STORAGE_KEY);
};

const isAuthEndpoint = (url) =>
  url.includes('/auth/login') ||
  url.includes('/auth/refresh') ||
  url.includes('/auth/register') ||
  url.includes('/auth/forgot-password') ||
  url.includes('/auth/reset-password/');

const initializeCsrf = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/csrf`, {
    method: 'GET',
    credentials: 'include',
  });

  let data = {};
  try {
    data = await response.json();
  } catch {
    throw new ApiError(`Unexpected response from server (status ${response.status})`, response.status);
  }

  if (!response.ok || !data.csrfToken) {
    throw new ApiError(data.message || 'Unable to initialize security token.', response.status);
  }

  setCsrfToken(data.csrfToken);
  return data.csrfToken;
};

const handleResponse = async (response) => {
  let data;

  try {
    data = await response.json();
  } catch {
    throw new ApiError(`Unexpected response from server (status ${response.status}).`, response.status);
  }

  // Login/refresh/bootstrap responses rotate the CSRF token.
  if (data?.csrfToken) setCsrfToken(data.csrfToken);

  if (!response.ok) {
    throw new ApiError(data?.message || 'Something went wrong.', response.status);
  }

  return data;
};

let refreshPromise = null;

const attemptRefresh = () => {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })
      .then(async (response) => {
        if (!response.ok) {
          clearCsrfToken();
          return false;
        }

        const data = await response.json().catch(() => ({}));
        if (data.csrfToken) setCsrfToken(data.csrfToken);
        return true;
      })
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

const doFetch = async (url, options, timeoutMs) => {
  const method = (options.method || 'GET').toUpperCase();
  const isMutation = !['GET', 'HEAD', 'OPTIONS'].includes(method);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // Login, forgot/reset-password and refresh are intentionally CSRF-exempt
    // on the server because they do not depend on an existing admin session.
    if (isMutation && !isAuthEndpoint(url) && !csrfToken) {
      await initializeCsrf();
    }

    const headers = new Headers(options.headers || {});
    if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    if (isMutation && !isAuthEndpoint(url) && csrfToken) {
      headers.set('X-CSRF-Token', csrfToken);
    }

    return await fetch(url, {
      ...options,
      signal: controller.signal,
      credentials: 'include',
      headers,
    });
  } finally {
    clearTimeout(timer);
  }
};

const apiFetch = async (url, options = {}, timeoutMs = 10000, retry = 0) => {
  let response;

  try {
    response = await doFetch(url, options, timeoutMs);
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new ApiError('Request timed out. Please try again.', undefined);
    }
    if (err instanceof ApiError) throw err;
    throw new ApiError('Could not reach the server. Please check your connection.', undefined);
  }

  if (response.status === 401 && retry === 0 && !isAuthEndpoint(url)) {
    const refreshed = await attemptRefresh();
    if (refreshed) return apiFetch(url, options, timeoutMs, 1);

    clearCsrfToken();
    if (typeof window !== 'undefined' && !window.location.pathname.includes('/admin/login')) {
      window.location.href = '/admin/login';
    }
  }

  // Recover once from a stale/missing CSRF token (for example after a token
  // rotation in another tab). This keeps the individual pages simple.
  if (response.status === 403 && retry === 0 && !isAuthEndpoint(url)) {
    let body = {};
    try { body = await response.clone().json(); } catch { /* ignore */ }
    if (String(body.message || '').toLowerCase().includes('csrf')) {
      try {
        await initializeCsrf();
        return apiFetch(url, options, timeoutMs, 1);
      } catch {
        // Fall through to the original server error.
      }
    }
  }

  return handleResponse(response);
};

export const authAPI = {
  getCsrf: initializeCsrf,
  login: (email, password) => apiFetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  logout: () => apiFetch(`${API_BASE_URL}/auth/logout`, { method: 'POST' }),
  getMe: () => apiFetch(`${API_BASE_URL}/auth/me`),
  updateProfile: (data) => apiFetch(`${API_BASE_URL}/auth/profile`, {
    method: 'PUT', body: JSON.stringify(data),
  }),
  changePassword: (currentPassword, newPassword) => apiFetch(`${API_BASE_URL}/auth/change-password`, {
    method: 'PUT', body: JSON.stringify({ currentPassword, newPassword }),
  }),
  forgotPassword: (email) => apiFetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: 'POST', body: JSON.stringify({ email }),
  }),
  resetPassword: (token, password) => apiFetch(`${API_BASE_URL}/auth/reset-password/${encodeURIComponent(token)}`, {
    method: 'PUT', body: JSON.stringify({ password }),
  }),
  listSessions: () => apiFetch(`${API_BASE_URL}/auth/sessions`),
  revokeSession: (sessionId) => apiFetch(`${API_BASE_URL}/auth/sessions/${sessionId}`, { method: 'DELETE' }),
};

export const blogAPI = {
  getAll: (params = '') => apiFetch(`${API_BASE_URL}/blog${params}`),
  getAdminAll: (params = '') => apiFetch(`${API_BASE_URL}/blog/admin/all${params}`),
  getBySlug: (slug) => apiFetch(`${API_BASE_URL}/blog/${slug}`),
  create: (data) => apiFetch(`${API_BASE_URL}/blog`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`${API_BASE_URL}/blog/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`${API_BASE_URL}/blog/${id}`, { method: 'DELETE' }),
};

export const serviceAPI = {
  getAll: (params = '') => apiFetch(`${API_BASE_URL}/services${params}`),
  getAdminAll: (params = '') => apiFetch(`${API_BASE_URL}/services/admin/all${params}`),
  getBySlug: (slug) => apiFetch(`${API_BASE_URL}/services/${slug}`),
  create: (data) => apiFetch(`${API_BASE_URL}/services`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`${API_BASE_URL}/services/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`${API_BASE_URL}/services/${id}`, { method: 'DELETE' }),
};

export const teamAPI = {
  getAll: (params = '') => apiFetch(`${API_BASE_URL}/team${params}`),
  getAdminAll: (params = '') => apiFetch(`${API_BASE_URL}/team/admin/all${params}`),
  getById: (id) => apiFetch(`${API_BASE_URL}/team/${id}`),
  create: (data) => apiFetch(`${API_BASE_URL}/team`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`${API_BASE_URL}/team/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`${API_BASE_URL}/team/${id}`, { method: 'DELETE' }),
};

export const contactAPI = {
  getAll: (params = '') => apiFetch(`${API_BASE_URL}/contact${params}`),
  getById: (id) => apiFetch(`${API_BASE_URL}/contact/${id}`),
  markAsRead: (id) => apiFetch(`${API_BASE_URL}/contact/${id}/read`, { method: 'PUT' }),
  reply: (id, replyMessage) => apiFetch(`${API_BASE_URL}/contact/${id}/reply`, {
    method: 'PUT', body: JSON.stringify({ replyMessage }),
  }),
  delete: (id) => apiFetch(`${API_BASE_URL}/contact/${id}`, { method: 'DELETE' }),
};

export const newsletterAPI = {
  getSubscribers: () => apiFetch(`${API_BASE_URL}/newsletter/subscribers`),
};

export const partnerAPI = {
  getAll: (params = '') => apiFetch(`${API_BASE_URL}/partners${params}`),
  getAdminAll: (params = '') => apiFetch(`${API_BASE_URL}/partners/admin/all${params}`),
  create: (data) => apiFetch(`${API_BASE_URL}/partners`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`${API_BASE_URL}/partners/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`${API_BASE_URL}/partners/${id}`, { method: 'DELETE' }),
};

export const esgAPI = {
  getAll: (params = '') => apiFetch(`${API_BASE_URL}/esg${params}`),
  getAdminAll: (params = '') => apiFetch(`${API_BASE_URL}/esg/admin/all${params}`),
  create: (data) => apiFetch(`${API_BASE_URL}/esg`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`${API_BASE_URL}/esg/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`${API_BASE_URL}/esg/${id}`, { method: 'DELETE' }),
};

export const jobAPI = {
  getAll: (params = '') => apiFetch(`${API_BASE_URL}/jobs${params}`),
  getAdminAll: (params = '') => apiFetch(`${API_BASE_URL}/jobs/admin/all${params}`),
  create: (data) => apiFetch(`${API_BASE_URL}/jobs`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`${API_BASE_URL}/jobs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`${API_BASE_URL}/jobs/${id}`, { method: 'DELETE' }),
};

export const jobApplicationAPI = {
  getAll: (params = '') => apiFetch(`${API_BASE_URL}/jobs/applications${params}`),
  getForJob: (jobId) => apiFetch(`${API_BASE_URL}/jobs/${jobId}/applications`),
  updateStatus: (id, status, notes) => apiFetch(`${API_BASE_URL}/jobs/applications/${id}`, {
    method: 'PUT', body: JSON.stringify({ status, notes }),
  }),
  delete: (id) => apiFetch(`${API_BASE_URL}/jobs/applications/${id}`, { method: 'DELETE' }),
};

export const eventAPI = {
  getAll: (params = '') => apiFetch(`${API_BASE_URL}/events${params}`),
  getAdminAll: (params = '') => apiFetch(`${API_BASE_URL}/events/admin/all${params}`),
  create: (data) => apiFetch(`${API_BASE_URL}/events`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`${API_BASE_URL}/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`${API_BASE_URL}/events/${id}`, { method: 'DELETE' }),
  getRsvps: (id) => apiFetch(`${API_BASE_URL}/events/${id}/rsvps`),
  removeRsvp: (eventId, rsvpId) => apiFetch(`${API_BASE_URL}/events/${eventId}/rsvps/${rsvpId}`, { method: 'DELETE' }),
};

export const newsletterIssueAPI = {
  getAll: () => apiFetch(`${API_BASE_URL}/newsletter/issues`),
  create: (data) => apiFetch(`${API_BASE_URL}/newsletter/issues`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`${API_BASE_URL}/newsletter/issues/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`${API_BASE_URL}/newsletter/issues/${id}`, { method: 'DELETE' }),
  send: (id) => apiFetch(`${API_BASE_URL}/newsletter/issues/${id}/send`, { method: 'POST' }),
};

export const analyticsAPI = {
  getDashboard: () => apiFetch(`${API_BASE_URL}/analytics/dashboard`),
  getActivity: (limit = 10) => apiFetch(`${API_BASE_URL}/analytics/activity?limit=${limit}`),
  getMessages: () => apiFetch(`${API_BASE_URL}/analytics/messages`),
  getGrowth: () => apiFetch(`${API_BASE_URL}/analytics/growth`),
};

export const settingsAPI = {
  getAll: () => apiFetch(`${API_BASE_URL}/settings`),
  getPublic: () => apiFetch(`${API_BASE_URL}/settings/public`),
  update: (key, value, group) => apiFetch(`${API_BASE_URL}/settings`, {
    method: 'POST', body: JSON.stringify({ key, value, group }),
  }),
  bulkUpdate: (settings) => apiFetch(`${API_BASE_URL}/settings/bulk`, {
    method: 'PUT', body: JSON.stringify({ settings }),
  }),
};

export const uploadAPI = {
  uploadImage: async (file) => {
    if (!csrfToken) await initializeCsrf();
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      credentials: 'include',
      headers: csrfToken ? { 'X-CSRF-Token': csrfToken } : {},
      body: formData,
    });

    return handleResponse(response);
  },
  deleteImage: (publicId) => apiFetch(`${API_BASE_URL}/upload`, {
    method: 'DELETE', body: JSON.stringify({ publicId }),
  }),
};
