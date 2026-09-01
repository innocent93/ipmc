const Setting = require('../models/Setting');

const DEFAULTS = {
  'site.name': { value: 'IPMC Nigeria', group: 'general' },
  'site.tagline': { value: 'Integrated Project Management Consultancy', group: 'general' },
  'site.logo': { value: '', group: 'general' },
  'site.favicon': { value: '', group: 'general' },
  'seo.title': { value: 'IPMC Nigeria - Project Management & ESG Consulting', group: 'seo' },
  'seo.description': { value: 'Leading project management and ESG consultancy in Nigeria.', group: 'seo' },
  'seo.keywords': { value: 'project management, ESG, Nigeria, consultancy', group: 'seo' },
  'social.facebook': { value: '', group: 'social' },
  'social.twitter': { value: '', group: 'social' },
  'social.linkedin': { value: '', group: 'social' },
  'social.instagram': { value: '', group: 'social' },
  'social.youtube': { value: '', group: 'social' },
  'contact.email': { value: 'info@ipmc-ng.com', group: 'contact' },
  'contact.phone': { value: '', group: 'contact' },
  'contact.address': { value: '', group: 'contact' },
  'contact.mapUrl': { value: '', group: 'contact' },
  'appearance.primaryColor': { value: '#2563eb', group: 'appearance' },
  'appearance.accentColor': { value: '#f59e0b', group: 'appearance' },
};

exports.getAllSettings = async (group) => {
  const filter = group ? { group } : {};
  const settings = await Setting.find(filter);
  const map = {};
  settings.forEach(s => map[s.key] = s.value);
  // Fill defaults
  for (const [key, def] of Object.entries(DEFAULTS)) {
    if (!(key in map)) map[key] = def.value;
  }
  return map;
};

exports.getPublicSettings = async () => {
  const settings = await Setting.find({ isPublic: true });
  const map = {};
  settings.forEach(s => map[s.key] = s.value);
  for (const [key, def] of Object.entries(DEFAULTS)) {
    if (!(key in map) && def.group !== 'contact') map[key] = def.value;
  }
  return map;
};

exports.getSetting = async (key) => {
  const setting = await Setting.findOne({ key });
  return setting ? setting.value : (DEFAULTS[key]?.value || null);
};

exports.setSetting = async (key, value, group = 'general') => {
  return await Setting.findOneAndUpdate(
    { key },
    { key, value, group },
    { upsert: true, new: true, runValidators: true }
  );
};

exports.bulkUpdate = async (settingsArray) => {
  const results = [];
  for (const { key, value, group } of settingsArray) {
    results.push(await exports.setSetting(key, value, group || 'general'));
  }
  return results;
};

exports.deleteSetting = async (key) => await Setting.findOneAndDelete({ key });
