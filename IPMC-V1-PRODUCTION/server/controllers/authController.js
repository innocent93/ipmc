const authService = require('../services/authService');
const { setAuthCookies, clearAuthCookies, setRefreshCookie, clearRefreshCookie } = require('../utils/authCookies');

exports.register = async (req, res) => {
  try {
    const result = await authService.register(req.body);
    setAuthCookies(res, result.token);
    setRefreshCookie(res, result.refreshToken);
    res.status(201).json({ success: true, user: result.user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const result = await authService.login(req.body.email, req.body.password, req.header('User-Agent'));
    // The access token is short-lived (15m default) and lives in an
    // httpOnly cookie — unreadable by page JS. The refresh token (7d,
    // path-scoped to /api/auth only) is what silently renews it via
    // POST /auth/refresh, so a stolen access token stops working within
    // minutes instead of staying valid for a full 30-day session. Each
    // login creates its own session entry, so signing in on a second
    // device doesn't sign the first one out.
    setAuthCookies(res, result.token);
    setRefreshCookie(res, result.refreshToken);
    res.status(200).json({ success: true, token: result.token, user: result.user });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

exports.refresh = async (req, res) => {
  try {
    const result = await authService.refreshAccessToken(req.cookies?.refreshToken, req.header('User-Agent'));
    setAuthCookies(res, result.token);
    setRefreshCookie(res, result.refreshToken);
    res.status(200).json({ success: true, token: result.token, user: result.user });
  } catch (error) {
    clearAuthCookies(res);
    res.status(401).json({ success: false, message: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    // Only this device's session is revoked — other logged-in devices
    // are left alone, matching how logout works on most real products.
    await authService.revokeRefreshToken(req.user.id, req.cookies?.refreshToken);
  } catch {
    // Even if revocation fails (e.g. user already deleted), still clear
    // cookies so the client-side session ends cleanly either way.
  }
  clearAuthCookies(res);
  clearRefreshCookie(res);
  res.status(200).json({ success: true, message: 'Logged out.' });
};

exports.listSessions = async (req, res) => {
  try {
    const sessions = await authService.listSessions(req.user.id, req.cookies?.refreshToken);
    res.status(200).json({ success: true, data: sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.revokeSession = async (req, res) => {
  try {
    await authService.revokeSessionById(req.user.id, req.params.sessionId);
    res.status(200).json({ success: true, message: 'Session revoked.' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await authService.getMe(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await authService.updateProfile(req.user.id, req.body);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const result = await authService.changePassword(req.user.id, req.body.currentPassword, req.body.newPassword);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const result = await authService.forgotPassword(req.body.email);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const result = await authService.resetPassword(req.params.token, req.body.password);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
