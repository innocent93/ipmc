// Only relevant once a request is authenticated via the httpOnly cookie
// (browser-based admin sessions). Requests authenticated the old way, via
// an explicit `Authorization: Bearer <token>` header (e.g. scripts, other
// services), aren't vulnerable to CSRF in the same way \u2014 a malicious page
// can't make a browser attach a header it doesn't control \u2014 so those are
// left alone here.
/* const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

exports.csrfProtection = (req, res, next) => {
  if (SAFE_METHODS.has(req.method)) return next();

  const usingCookieAuth = Boolean(req.cookies?.token) && !req.header('Authorization');
  if (!usingCookieAuth) return next();

  const headerToken = req.header('X-CSRF-Token');
  const cookieToken = req.cookies?.csrfToken;

  if (!headerToken || !cookieToken || headerToken !== cookieToken) {
    return res.status(403).json({ success: false, message: 'Invalid or missing CSRF token.' });
  }
  next();
};
**/
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

const CSRF_EXEMPT_PATHS = new Set([
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/refresh',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
]);

exports.csrfProtection = (req, res, next) => {
  // GET/HEAD/OPTIONS never change state
  if (SAFE_METHODS.has(req.method)) {
    return next();
  }

  // These endpoints do not require an existing authenticated session.
  // They must be reachable even if the browser has a stale token cookie.
  if (CSRF_EXEMPT_PATHS.has(req.path)) {
    return next();
  }

  // Only protect requests authenticated through the browser cookie.
  const usingCookieAuth =
    Boolean(req.cookies?.token) &&
    !req.header('Authorization');

  // Authorization: Bearer requests are not vulnerable to
  // browser cookie-based CSRF in the same way.
  if (!usingCookieAuth) {
    return next();
  }

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
