// Real image optimization pipeline, built on Cloudinary (already a
// project dependency for uploads — see server/config/cloudinary.js).
// Rather than pre-generating WebP/AVIF files ourselves, Cloudinary's
// f_auto/q_auto transformation parameters do this automatically per
// request: f_auto serves AVIF to browsers that support it, WebP to
// those that don't, and falls back to the original format for very old
// browsers — all from a single stored master image. q_auto picks the
// lowest quality that's visually indistinguishable, typically cutting
// file size 30-50% versus a fixed quality setting.
//
// This only applies to images actually uploaded through this app (team
// photos, blog covers, service images added via the admin). External
// URLs (Unsplash placeholders, IPMC's own hotlinked CDN) pass through
// unchanged, since we don't control their delivery pipeline.

const CLOUDINARY_HOST = 'res.cloudinary.com';

/**
 * Rewrites a Cloudinary delivery URL to request automatic format +
 * quality optimization, and optionally a specific width for responsive
 * sizing. No-ops (returns the URL unchanged) for any non-Cloudinary URL.
 *
 * @param {string} url - the original image URL
 * @param {{ width?: number }} [options]
 */
export function optimizeImage(url, { width } = {}) {
  if (!url || typeof url !== 'string' || !url.includes(CLOUDINARY_HOST)) return url;

  const uploadMarker = '/upload/';
  const idx = url.indexOf(uploadMarker);
  if (idx === -1) return url;

  const transforms = ['f_auto', 'q_auto'];
  if (width) transforms.push(`w_${width}`);

  const insertAt = idx + uploadMarker.length;
  return url.slice(0, insertAt) + transforms.join(',') + '/' + url.slice(insertAt);
}

/**
 * Builds a `srcSet` string requesting the same Cloudinary image at
 * several widths, so the browser downloads only the resolution it
 * actually needs instead of always fetching the full-size master.
 */
export function buildSrcSet(url, widths = [400, 800, 1200, 1600]) {
  if (!url || !url.includes(CLOUDINARY_HOST)) return undefined;
  return widths.map((w) => `${optimizeImage(url, { width: w })} ${w}w`).join(', ');
}
