require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');
const connectDB = require('./config/db');
const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');
const { csrfProtection } = require('./middleware/csrf');
const logger = require('./utils/logger');

const app = express();

// Required on every platform that puts the app behind a reverse proxy or
// load balancer (Render, Railway, Fly, Vercel, Heroku, nginx...) so
// req.ip / X-Forwarded-For are read correctly. Without this,
// express-rate-limit's IP detection and req.ip-based logging can behave
// inconsistently depending on the host's proxy depth.
app.set('trust proxy', 1);

// Catch anything that would otherwise crash the process silently (no log
// line, connection just dies) \u2014 e.g. an unawaited promise rejecting
// deep in a library. These log the failure via the structured logger
// instead of vanishing.
process.on('unhandledRejection', (reason) => {
  logger.error('unhandled_rejection', { message: reason?.message || String(reason), stack: reason?.stack });
});
process.on('uncaughtException', (err) => {
  logger.error('uncaught_exception', { message: err.message, stack: err.stack });
  // Uncaught exceptions can leave the process in an inconsistent state;
  // exit so a process manager (PM2, Render, Railway, etc.) restarts it
  // cleanly, rather than continuing to serve requests from a bad state.
  process.exit(1);
});

connectDB();

// Security
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https:"],
    },
  },
}));

// CORS: supports a comma-separated CORS_ORIGIN list (recommended) alongside
// the older single-value CLIENT_URL/ADMIN_URL vars, and always allows
// Vercel preview URLs for this project so preview deploys aren't silently
// blocked. Falls back to '*' (no credentials) only if nothing is configured,
// so a fresh deploy doesn't hard-fail with zero working origins.
const configuredOrigins = [
  ...(process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map(s => s.trim()) : []),
  process.env.CLIENT_URL,
  process.env.ADMIN_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (curl, server-to-server, health checks)
    if (!origin) return callback(null, true);
    if (configuredOrigins.length === 0) return callback(null, true);
    if (configuredOrigins.includes(origin)) return callback(null, true);
    if (/^https:\/\/ipmc(-[a-z0-9-]+)?\.vercel\.app$/.test(origin)) return callback(null, true);
    logger.warn('cors_rejected', { origin });
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(morgan('combined', { stream: logger.httpStream }));
// Gzip/Brotli-negotiated compression for all responses — meaningfully
// shrinks JSON payloads (blog lists, ESG reports) over the wire.
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// Required to read the httpOnly auth cookie and the readable CSRF cookie
// set on login (see utils/authCookies.js).
app.use(cookieParser());
// Strips any request keys starting with '$' or containing '.', which
// blocks MongoDB operator-injection attempts via query/body/params.
app.use(mongoSanitize());
// Double-submit CSRF check for cookie-authenticated (browser) requests —
// see middleware/csrf.js for why Authorization-header requests are exempt.
app.use(csrfProtection);

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'IPMC API is running', timestamp: new Date().toISOString() });
});

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Only bind to a port / connect the graceful-shutdown handlers when this
// file is run directly (`node server.js`) \u2014 not when it's `require()`d by
// the test suite, which needs the bare `app` to run against its own
// in-memory MongoDB instance without a real network listener.
if (require.main === module) {
  const server = app.listen(PORT, () => {
    logger.info('server_started', { port: PORT, env: process.env.NODE_ENV || 'development' });
  });

  // Graceful shutdown: let in-flight requests finish before the process
  // exits, so container/PM2 restarts and deploys don't drop live traffic.
  const shutdown = (signal) => {
    logger.info('shutdown_initiated', { signal });
    server.close(() => {
      logger.info('server_closed');
      process.exit(0);
    });
    // Force-exit if something hangs longer than 10s
    setTimeout(() => process.exit(1), 10000).unref();
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

module.exports = app;
