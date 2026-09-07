// CSRF protection for cookie-authenticated browser requests.
// Public form submissions and password-reset links are intentionally exempt:
// they are not authenticated by the browser's admin session cookie. Protected
// admin mutations still require the double-submit CSRF token.
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

const isPublicMutation = (req) => {
  const path = req.path;

  return (
    path === '/api/auth/login' ||
    path === '/api/auth/register' ||
    path === '/api/auth/refresh' ||
    path === '/api/auth/forgot-password' ||
    path.startsWith('/api/auth/reset-password/') ||
    path === '/api/contact' ||
    path === '/api/newsletter/subscribe' ||
    path === '/api/newsletter/unsubscribe' ||
    /^\/api\/events\/[^/]+\/rsvp$/.test(path) ||
    /^\/api\/jobs\/[^/]+\/apply$/.test(path)
  );
};

exports.csrfProtection = (req, res, next) => {
  if (SAFE_METHODS.has(req.method)) return next();
  if (isPublicMutation(req)) return next();

  const usingCookieAuth = Boolean(req.cookies?.token) && !req.header('Authorization');
  if (!usingCookieAuth) return next();

  const headerToken = req.header('X-CSRF-Token');
  const cookieToken = req.cookies?.csrfToken;

  if (!headerToken || !cookieToken || headerToken !== cookieToken) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or missing CSRF token.'
    });
  }

  next();
};
