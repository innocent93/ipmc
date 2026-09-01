require('dotenv').config();
const fs = require('fs');
const path = require('path');
const connectDB = require('../config/db');
const BlogPost = require('../models/BlogPost');
const Service = require('../models/Service');
const ESGReport = require('../models/ESGReport');
const Job = require('../models/Job');
const logger = require('./logger');

const BASE_URL = process.env.APP_URL || 'https://ipmc-ng.com';

const staticRoutes = [
  { url: '/', priority: 1.0 },
  { url: '/about', priority: 0.8 },
  { url: '/services', priority: 0.9 },
  { url: '/blog', priority: 0.8 },
  { url: '/team', priority: 0.7 },
  { url: '/esg', priority: 0.8 },
  { url: '/contact', priority: 0.8 },
  { url: '/careers', priority: 0.7 },
  { url: '/events', priority: 0.6 },
  { url: '/proposal', priority: 0.7 },
];

async function generateSitemap() {
  await connectDB();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  // Static routes
  for (const route of staticRoutes) {
    xml += `  <url>
    <loc>${BASE_URL}${route.url}</loc>
    <priority>${route.priority}</priority>
    <changefreq>weekly</changefreq>
  </url>
`;
  }

  // Dynamic routes
  const [blogs, services, esg, jobs] = await Promise.all([
    BlogPost.find({ isPublished: true }).select('slug updatedAt'),
    Service.find({ isActive: true }).select('slug updatedAt'),
    ESGReport.find({ isPublished: true }).select('_id updatedAt'),
    Job.find({ isActive: true }).select('slug updatedAt'),
  ]);

  for (const blog of blogs) {
    xml += `  <url>
    <loc>${BASE_URL}/blog/${blog.slug}</loc>
    <lastmod>${blog.updatedAt?.toISOString() || new Date().toISOString()}</lastmod>
    <priority>0.7</priority>
  </url>
`;
  }

  for (const svc of services) {
    xml += `  <url>
    <loc>${BASE_URL}/services/${svc.slug}</loc>
    <lastmod>${svc.updatedAt?.toISOString() || new Date().toISOString()}</lastmod>
    <priority>0.8</priority>
  </url>
`;
  }

  for (const report of esg) {
    xml += `  <url>
    <loc>${BASE_URL}/esg/${report._id}</loc>
    <lastmod>${report.updatedAt?.toISOString() || new Date().toISOString()}</lastmod>
    <priority>0.6</priority>
  </url>
`;
  }

  for (const job of jobs) {
    xml += `  <url>
    <loc>${BASE_URL}/careers/${job.slug}</loc>
    <lastmod>${job.updatedAt?.toISOString() || new Date().toISOString()}</lastmod>
    <priority>0.6</priority>
  </url>
`;
  }

  xml += '</urlset>';

  const outputPath = path.join(__dirname, '../../client/public/sitemap.xml');
  fs.writeFileSync(outputPath, xml);
  logger.info('sitemap_generated', { outputPath, urlCount: staticRoutes.length + blogs.length + services.length + esg.length + jobs.length });
  process.exit(0);
}

generateSitemap().catch(err => { logger.error('sitemap_generation_failed', { message: err.message }); process.exit(1); });
