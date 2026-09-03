const logger = require('./logger');

// Deliberately NOT importing @sentry/node here — adding a real error-
// monitoring SDK is a dependency + account setup decision for you to
// make, not something to silently bolt on. This gives you the *seam*:
// every place in the app that should report an error already calls
// `captureError()` below. Wiring in Sentry (or Bugsnag, Rollbar, etc.)
// later is a one-file change, not an app-wide refactor.
//
// To actually enable Sentry:
//   1. npm install @sentry/node
//   2. Set SENTRY_DSN in your environment
//   3. Uncomment the Sentry.init() and Sentry.captureException() calls
//      below and remove the structured-log-only fallback
const dsnConfigured = Boolean(process.env.SENTRY_DSN);

if (!dsnConfigured) {
  logger.info('error_monitoring_not_configured', {
    message: 'SENTRY_DSN is unset \u2014 errors are logged locally only, not sent to an external monitoring service.',
  });
}

// let Sentry;
// if (dsnConfigured) {
//   Sentry = require('@sentry/node');
//   Sentry.init({ dsn: process.env.SENTRY_DSN, environment: process.env.NODE_ENV, tracesSampleRate: 0.1 });
// }

exports.captureError = (error, context = {}) => {
  logger.error('captured_error', { message: error.message, stack: error.stack, ...context });
  // if (dsnConfigured) Sentry.captureException(error, { extra: context });
};

exports.isConfigured = dsnConfigured;
