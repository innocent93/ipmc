#!/usr/bin/env node
/**
 * download-team-images.js
 *
 * Downloads the team-member profile images listed in team.json.
 *
 * Why this script exists instead of the images being pre-downloaded:
 * the environment that produced this repo has no outbound internet
 * access, so the images could not be fetched there. The URLs in
 * team.json were extracted directly from the live DOM of
 * https://ipmc-ng.com/about (the "Meet Our Specialized Team" section) —
 * they are not guessed. Run this script anywhere with normal internet
 * access to actually pull the files down.
 *
 * Usage:
 *   node download-team-images.js
 *
 * Requires Node 18+ (built-in fetch). For older Node, run:
 *   npm install node-fetch
 * and uncomment the node-fetch import below.
 */

const fs = require('fs');
const path = require('path');
// const fetch = require('node-fetch'); // uncomment on Node < 18

const TEAM_JSON = path.join(__dirname, 'team.json');
const OUTPUT_DIR = __dirname;

// Minimal magic-byte check so we don't silently save an HTML error page
// as a ".jpg" file.
function isValidImage(buffer) {
  if (buffer.length < 12) return false;
  const isJpg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  const isPng = buffer.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  const isWebp = buffer.slice(0, 4).toString('ascii') === 'RIFF' && buffer.slice(8, 12).toString('ascii') === 'WEBP';
  return isJpg || isPng || isWebp;
}

// Very small JPEG/PNG dimension reader so we don't need an image library.
function readDimensions(buffer) {
  try {
    if (buffer[0] === 0xff && buffer[1] === 0xd8) {
      let offset = 2;
      while (offset < buffer.length) {
        if (buffer[offset] !== 0xff) { offset++; continue; }
        const marker = buffer[offset + 1];
        if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
          const height = buffer.readUInt16BE(offset + 5);
          const width = buffer.readUInt16BE(offset + 7);
          return { width, height };
        }
        const segLength = buffer.readUInt16BE(offset + 2);
        offset += 2 + segLength;
      }
    }
    if (buffer.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
      const width = buffer.readUInt32BE(16);
      const height = buffer.readUInt32BE(20);
      return { width, height };
    }
  } catch {
    // fall through
  }
  return { width: null, height: null };
}

async function main() {
  const members = JSON.parse(fs.readFileSync(TEAM_JSON, 'utf-8'));
  const results = [];
  let downloaded = 0;
  let failed = 0;

  console.log(`Found ${members.length} team members in team.json\n`);

  for (const member of members) {
    process.stdout.write(`Downloading ${member.name} -> ${member.local_filename} ... `);
    try {
      const res = await fetch(member.original_image_url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; IPMC-Refactor-ImageFetcher/1.0)' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (!isValidImage(buffer)) throw new Error('Downloaded content is not a valid image (bad magic bytes)');

      const outPath = path.join(OUTPUT_DIR, member.local_filename);
      fs.writeFileSync(outPath, buffer);

      const { width, height } = readDimensions(buffer);
      const contentType = res.headers.get('content-type') || 'image/jpeg';

      results.push({
        ...member,
        width,
        height,
        file_type: contentType.split('/')[1] || 'jpg',
        file_size_bytes: buffer.length,
        status: 'downloaded',
      });
      downloaded++;
      console.log(`OK (${(buffer.length / 1024).toFixed(1)} KB, ${width || '?'}x${height || '?'})`);
    } catch (err) {
      results.push({ ...member, status: 'failed', error: err.message });
      failed++;
      console.log(`FAILED (${err.message})`);
    }
  }

  fs.writeFileSync(TEAM_JSON, JSON.stringify(results, null, 2));

  console.log(`\n--- Summary ---`);
  console.log(`Total found:     ${members.length}`);
  console.log(`Downloaded:      ${downloaded}`);
  console.log(`Failed:          ${failed}`);
  if (failed > 0) {
    console.log(`\nFailed items:`);
    results.filter(r => r.status === 'failed').forEach(r => console.log(`  - ${r.name}: ${r.error}`));
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
