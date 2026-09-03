const API_BASE_URL = 'https://ipmc.onrender.com/api'
// Catches the single most common deploy mistake early, with a clear
// message instead of a cryptic "Unexpected response (status 405)":
// VITE_API_URL is a Vite build-time variable — if it's left unset, or
// accidentally pointed at this admin app's own domain instead of the
// separately-deployed backend, every API call resolves back to this
// static site. Vercel's static hosting only serves GET/HEAD, so a POST
// (e.g. login) gets a 405 with an HTML error body, which is exactly the
// confusing symptom this guards against.
if (typeof window !== 'undefined') {
  const sameOriginAsThisApp = API_BASE_URL.startsWith(window.location.origin);
  const stillDefaultLocalhost = !import.meta.env.VITE_API_URL;
  if (import.meta.env.PROD && (sameOriginAsThisApp || stillDefaultLocalhost)) {
    // eslint-disable-next-line no-console
    console.error(
      '[IPMC Admin] VITE_API_URL is missing or points at this admin app itself ' +
      `(resolved to "${API_BASE_URL}"). Set VITE_API_URL in this Vercel project's ` +
      'environment variables to your deployed backend URL (e.g. https://your-api.onrender.com/api) ' +
      'and redeploy — Vite bakes this in at build time, so changing it alone without a ' +
      'rebuild has no effect.'
    );
  }
}

// Reads the (deliberately non-httpOnly) CSRF cookie the server sets on
// login, so it can be echoed back as a header on mutating requests —
// the double-submit pattern in server/middleware/csrf.js.
const getCsrfToken = () => {
  const match = document.cookie.match(/(?:^|;\s*)csrfToken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

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
    // A non-JSON body on a 404/405 almost always means the request never
    // reached the real backend at all — see the VITE_API_URL check above.
    const hint = (response.status === 404 || response.status === 405)
      ? ' This usually means VITE_API_URL is misconfigured (check it points to your deployed backend, not this admin app, and that the admin was rebuilt after setting it).'
      : '';
    throw new ApiError(`Unexpected response from server (status ${response.status}).${hint}`, response.status);
  }
  if (!response.ok) {
    throw new ApiError(data.message || 'Something went wrong', response.status);
  }
  return data;
};

const isAuthEndpoint = (url) => url.includes('/auth/login') || url.includes('/auth/refresh') || url.includes('/auth/register');

// If a session's short-lived access token has expired, this silently
// exchanges the refresh cookie for a new one instead of forcing a full
// re-login. Only one refresh attempt runs at a time — concurrent 401s
// (e.g. several widgets fetching on page load) share the same in-flight
// refresh rather than each racing to rotate the refresh token, which
// would invalidate each other's attempts.
let refreshPromise = null;
const attemptRefresh = () => {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE_URL}/auth/refresh`, { method: 'POST', credentials: 'include' })
      .then((res) => res.ok)
      .catch(() => false)
      .finally(() => { refreshPromise = null; });
  }
  return refreshPromise;
};

const doFetch = (url, options, timeoutMs) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const method = (options.method || 'GET').toUpperCase();

  return fetch(url, {
    ...options,
    signal: controller.signal,
    // Sends the httpOnly auth cookie with every request — this replaces
    // the old manual `Authorization: Bearer <token>` header read from
    // localStorage.
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(method !== 'GET' && method !== 'HEAD' ? { 'X-CSRF-Token': getCsrfToken() } : {}),
      ...options.headers,
    },
  }).finally(() => clearTimeout(timer));
};

const apiFetch = async (url, options = {}, timeoutMs = 10000, _isRetry = false) => {
  let response;
  try {
    response = await doFetch(url, options, timeoutMs);
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new ApiError('Request timed out — the server took too long to respond.', undefined);
    }
    // Network-level failure: VITE_API_URL not set for this deploy,
    // backend unreachable, CORS rejection, DNS failure, etc.
    throw new ApiError('Could not reach the server. Please check your connection.', undefined);
  }

  if (response.status === 401 && !_isRetry && !isAuthEndpoint(url)) {
    const refreshed = await attemptRefresh();
    if (refreshed) return apiFetch(url, options, timeoutMs, true); // retry exactly once
    if (!window.location.pathname.includes('/admin/login')) {
      window.location.href = '/admin/login';
    }
  }

  return handleResponse(response);
};

// Auth
export const authAPI = {
  login: (email, password) => apiFetch(`${API_BASE_URL}/auth/login`, { method: 'POST', body: JSON.stringify({ email, password }) }),
  logout: () => apiFetch(`${API_BASE_URL}/auth/logout`, { method: 'POST' }),
  getMe: () => apiFetch(`${API_BASE_URL}/auth/me`),
  updateProfile: (data) => apiFetch(`${API_BASE_URL}/auth/profile`, { method: 'PUT', body: JSON.stringify(data) }),
  changePassword: (currentPassword, newPassword) => apiFetch(`${API_BASE_URL}/auth/change-password`, { method: 'PUT', body: JSON.stringify({ currentPassword, newPassword }) }),
  forgotPassword: (email) => apiFetch(`${API_BASE_URL}/auth/forgot-password`, { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword: (token, password) => apiFetch(`${API_BASE_URL}/auth/reset-password/${token}`, { method: 'PUT', body: JSON.stringify({ password }) }),
  // Multi-device session management — lets a user see every device
  // that's currently logged in and revoke any one of them individually
  // (e.g. a lost phone) without signing themselves out everywhere.
  listSessions: () => apiFetch(`${API_BASE_URL}/auth/sessions`),
  revokeSession: (sessionId) => apiFetch(`${API_BASE_URL}/auth/sessions/${sessionId}`, { method: 'DELETE' }),
};

// Blog
export const blogAPI = {
  getAll: (params = '') => apiFetch(`${API_BASE_URL}/blog${params}`),
  getBySlug: (slug) => apiFetch(`${API_BASE_URL}/blog/${slug}`),
  create: (data) => apiFetch(`${API_BASE_URL}/blog`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`${API_BASE_URL}/blog/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`${API_BASE_URL}/blog/${id}`, { method: 'DELETE' }),
};

// Services
export const serviceAPI = {
  getAll: (params = '') => apiFetch(`${API_BASE_URL}/services${params}`),
  getBySlug: (slug) => apiFetch(`${API_BASE_URL}/services/${slug}`),
  create: (data) => apiFetch(`${API_BASE_URL}/services`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`${API_BASE_URL}/services/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`${API_BASE_URL}/services/${id}`, { method: 'DELETE' }),
};

// Team
export const teamAPI = {
  getAll: (params = '') => apiFetch(`${API_BASE_URL}/team${params}`),
  getById: (id) => apiFetch(`${API_BASE_URL}/team/${id}`),
  create: (data) => apiFetch(`${API_BASE_URL}/team`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`${API_BASE_URL}/team/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`${API_BASE_URL}/team/${id}`, { method: 'DELETE' }),
};

// Contact
export const contactAPI = {
  getAll: (params = '') => apiFetch(`${API_BASE_URL}/contact${params}`),
  getById: (id) => apiFetch(`${API_BASE_URL}/contact/${id}`),
  markAsRead: (id) => apiFetch(`${API_BASE_URL}/contact/${id}/read`, { method: 'PUT' }),
  reply: (id, replyMessage) => apiFetch(`${API_BASE_URL}/contact/${id}/reply`, { method: 'PUT', body: JSON.stringify({ replyMessage }) }),
  delete: (id) => apiFetch(`${API_BASE_URL}/contact/${id}`, { method: 'DELETE' }),
};

// Newsletter
export const newsletterAPI = {
  getSubscribers: () => apiFetch(`${API_BASE_URL}/newsletter/subscribers`),
};

// Partners
export const partnerAPI = {
  getAll: () => apiFetch(`${API_BASE_URL}/partners`),
  create: (data) => apiFetch(`${API_BASE_URL}/partners`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`${API_BASE_URL}/partners/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`${API_BASE_URL}/partners/${id}`, { method: 'DELETE' }),
};

// ESG
export const esgAPI = {
  getAll: (params = '') => apiFetch(`${API_BASE_URL}/esg${params}`),
  create: (data) => apiFetch(`${API_BASE_URL}/esg`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`${API_BASE_URL}/esg/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`${API_BASE_URL}/esg/${id}`, { method: 'DELETE' }),
};

// Jobs
export const jobAPI = {
  getAll: (params = '') => apiFetch(`${API_BASE_URL}/jobs${params}`),
  create: (data) => apiFetch(`${API_BASE_URL}/jobs`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`${API_BASE_URL}/jobs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`${API_BASE_URL}/jobs/${id}`, { method: 'DELETE' }),
};

// Analytics
export const analyticsAPI = {
  getDashboard: () => apiFetch(`${API_BASE_URL}/analytics/dashboard`),
  getActivity: (limit = 10) => apiFetch(`${API_BASE_URL}/analytics/activity?limit=${limit}`),
  getMessages: () => apiFetch(`${API_BASE_URL}/analytics/messages`),
  getGrowth: () => apiFetch(`${API_BASE_URL}/analytics/growth`),
};

// Settings
export const settingsAPI = {
  getAll: () => apiFetch(`${API_BASE_URL}/settings`),
  getPublic: () => apiFetch(`${API_BASE_URL}/settings/public`),
  update: (key, value, group) => apiFetch(`${API_BASE_URL}/settings`, { method: 'POST', body: JSON.stringify({ key, value, group }) }),
  bulkUpdate: (settings) => apiFetch(`${API_BASE_URL}/settings/bulk`, { method: 'PUT', body: JSON.stringify({ settings }) }),
};

// Upload
export const uploadAPI = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    // FormData uploads deliberately bypass apiFetch's JSON Content-Type
    // header (the browser needs to set its own multipart boundary), but
    // still need credentials + CSRF like every other mutating request.
    return fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'X-CSRF-Token': getCsrfToken() },
      body: formData,
    }).then(handleResponse);
  },
  deleteImage: (publicId) => apiFetch(`${API_BASE_URL}/upload`, { method: 'DELETE', body: JSON.stringify({ publicId }) }),
};
