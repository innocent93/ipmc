# IPMC Team Images \u2014 Extraction Report

## What was done

I visited `https://ipmc-ng.com/about` and located the **"Meet Our Specialized Team"**
section in the page DOM. From there I extracted the `src` for every team-member
photo in that section only \u2014 no logos, banners, icons, or unrelated page images
were collected.

All URLs below are the **original WordPress/Jetpack CDN URLs exactly as they
appear in the live page's HTML** (`i0.wp.com` is Jetpack's image proxy for
WordPress.com/Jetpack sites; the paths after it are the site's real
`wp-content/uploads/...` paths). None of these were guessed, and none came
from a Google/reverse image search \u2014 they were read directly from the
rendered page.

## Total found: 11 / 11

| # | Name | Role | Local filename |
|---|------|------|-----------------|
| 1 | Robert Ade-Odiachi (FCA) | Chief Executive Officer | `robert-ade-odiachi.jpg` |
| 2 | Adebayo Ajao (MSC. Economics) | Head of Research | `adebayo-ajao.jpg` |
| 3 | Chika Onyekwere (B. Eng.) | Environmental Consultant | `chika-onyekwere.jpg` |
| 4 | Agatha Afemike (BSC, ACA, GRI) | ESG Consultant | `agatha-afemike.jpg` |
| 5 | Ayodeji Adeniran (MDSS, ACIS) | Governance Specialist | `ayodeji-adeniran.jpg` |
| 6 | Samuel Amoo (M.sc IT) | Data Analyst | `samuel-amoo.jpg` |
| 7 | Omolara Afeni | Natural and Environmental Science | `omolara-afeni.jpg` |
| 8 | Adelokun Timilehin | Marketing & Corporate Comms | `adelokun-timilehin.jpg` |
| 9 | Yusuf Suleiman (B.sc Statistics) | Statistician | `yusuf-suleiman.jpg` |
| 10 | Michael Farominiyi | Lead Statistician | `michael-farominiyi.jpg` |
| 11 | Ehikioya Joseph | Data Extraction Specialist | `ehikioya-joseph.jpg` |

## Why the files aren't already in this folder

**Successfully downloaded: 0 / 11 \u2014 by environment limitation, not scraping failure.**

The sandbox that generated this project has **no outbound internet access**
for running code (no `curl`, no `fetch` to arbitrary hosts). It can only
read pages that a restricted search/fetch tool has already returned as text
\u2014 it cannot pull raw binary files from external URLs. So the URL
*extraction* above is real and complete, but the binary *download* step
could not run here.

## How to actually download them

Run the included script anywhere with normal internet access (your laptop,
a CI runner, etc.):

```bash
cd scripts/ipmc-team-images
node download-team-images.js
```

Requirements: Node.js 18+ (uses the built-in `fetch`). For older Node
versions, `npm install node-fetch` and uncomment the import at the top of
the script.

The script will:
1. Read `team.json`
2. Download each `original_image_url`
3. Verify the response is a real image via magic-byte signature check (JPEG/PNG/WebP), not an HTML error page
4. Read actual pixel dimensions from the file
5. Save each file as `<local_filename>` in this folder
6. Rewrite `team.json` in place with `width`, `height`, `file_type`, `file_size_bytes`, and `status` ("downloaded" or "failed" + error reason) for every entry
7. Print a summary: total found / downloaded / failed

## Verification notes

- These are Jetpack Photon (`i0.wp.com`) proxied URLs without any resize
  query parameters (no `?w=` or `?fit=`), which means Photon serves the
  **original uploaded resolution**, not a thumbnail \u2014 this is the
  highest-quality version available directly from the page.
- If any URL 404s when you run the script (WordPress media occasionally
  gets renamed/removed), the script will mark that entry `"status": "failed"`
  with the HTTP error, rather than silently skipping it.
