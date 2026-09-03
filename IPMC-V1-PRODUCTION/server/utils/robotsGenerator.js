const fs = require('fs');
const path = require('path');
const logger = require('./logger');

const content = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${process.env.APP_URL || 'https://ipmc-ng.com'}/sitemap.xml
`;

const outputPath = path.join(__dirname, '../../client/public/robots.txt');
fs.writeFileSync(outputPath, content);
logger.info('robots_txt_generated', { outputPath });
