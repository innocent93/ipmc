const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  // The test suite manages its own mongoose connection against an
  // in-memory MongoDB instance (see tests/setup.js) so each test run is
  // isolated from real data \u2014 skip the app's normal auto-connect there.
  if (process.env.NODE_ENV === 'test') return;
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    logger.info('mongodb_connected', { host: conn.connection.host });
  } catch (error) {
    logger.error('mongodb_connection_failed', { message: error.message });
    process.exit(1);
  }
};

module.exports = connectDB;
