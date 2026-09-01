// Only relevant once a request is authenticated via the httpOnly cookie
// (browser-based admin sessions). Requests authenticated the old way, via
// an explicit `Authorization: Bearer <token>` header (e.g. scripts, other
// services), aren't vulnerable to CSRF in the same way \u2014 a malicious page
// can't make a browser attach a header it doesn't control \u2014 so those are
// left alone here.
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

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
