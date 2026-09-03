require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');
const Setting = require('../models/Setting');
const logger = require('./logger');

const seed = async () => {
  try {
    await connectDB();

    // Create admin
    const adminExists = await User.findOne({ email: 'admin@ipmc-ng.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: 'admin@ipmc-ng.com',
        password: 'admin123',
        role: 'admin'
      });
      logger.info('seed_admin_created', { email: 'admin@ipmc-ng.com' });
    } else {
      logger.info('seed_admin_exists');
    }

    // Create editor
    const editorExists = await User.findOne({ email: 'editor@ipmc-ng.com' });
    if (!editorExists) {
      await User.create({
        name: 'Editor User',
        email: 'editor@ipmc-ng.com',
        password: 'editor123',
        role: 'editor'
      });
      logger.info('seed_editor_created', { email: 'editor@ipmc-ng.com' });
    }

    // Seed default settings
    const defaults = [
      { key: 'site.name', value: 'IPMC Nigeria', group: 'general' },
      { key: 'site.tagline', value: 'Integrated Project Management Consultancy', group: 'general' },
      { key: 'seo.title', value: 'IPMC Nigeria - Project Management & ESG Consulting', group: 'seo' },
      { key: 'seo.description', value: 'Leading project management and ESG consultancy in Nigeria.', group: 'seo' },
      { key: 'contact.email', value: 'enquiries@ipmc-ng.com', group: 'contact' },
      { key: 'appearance.primaryColor', value: '#2563eb', group: 'appearance' },
    ];

    for (const def of defaults) {
      await Setting.findOneAndUpdate(
        { key: def.key },
        { ...def, isPublic: true },
        { upsert: true }
      );
    }
    logger.info('seed_settings_complete');

    process.exit(0);
  } catch (error) {
    logger.error('seed_failed', { message: error.message });
    process.exit(1);
  }
};

seed();
