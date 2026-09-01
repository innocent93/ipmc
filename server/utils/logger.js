const winston = require('winston');

const isProd = process.env.NODE_ENV === 'production';

// Structured logging: every entry is a JSON object with a timestamp, level,
// message, and any extra metadata passed in (request id, route, error
// details, etc). This makes logs greppable/parseable in any log
// aggregator (Vercel, Railway, Render, CloudWatch, Datadog...) instead of
// free-text console.log strings.
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (isProd ? 'info' : 'debug'),
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'ipmc-api' },
  transports: [
    new winston.transports.Console({
      format: isProd
        ? winston.format.json()
        // Human-readable in local dev, still structured underneath
        : winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(({ timestamp, level, message, ...meta }) => {
              const extra = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
              return `${timestamp} [${level}] ${message}${extra}`;
            })
          ),
    }),
  ],
});

// morgan HTTP access logs are piped through winston so request logs share
// the same structured format and destination as application logs.
logger.httpStream = {
  write: (message) => logger.info(message.trim(), { type: 'http_access' }),
};

module.exports = logger;
