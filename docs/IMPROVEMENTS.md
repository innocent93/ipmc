# IPMC Website — Complete Improvements Log

Everything done to this codebase, in one place, organized by category.
Each item says what was wrong, what was changed, and which file(s).

---

## 1. Deployment & Routing

| Issue | Fix | File(s) |
|---|---|---|
| `/contact` (and every other client-side route) 404'd on Vercel | Added SPA rewrite config | `client/vercel.json` |
| Admin app had the same 404 risk on every route | Same fix | `admin/vercel.json` |
| Admin app had no route for `/` at all \u2014 blank page if deployed to its own domain | Added `/` \u2192 `/admin` redirect + catch-all | `admin/src/App.jsx` |

## 2. Backend Reliability

| Issue | Fix | File(s) |
|---|---|---|
| Contact form silently hung with zero error/log when SMTP wasn't configured \u2014 the actual root cause of "contact form doesn't work" | Email sending moved off the critical response path (fire-and-background), SMTP transporter given real timeouts, graceful skip when unconfigured | `server/utils/emailService.js`, `server/services/contactService.js` |
| Same blocking-email pattern existed in newsletter signup | Same fix | `server/services/newsletterService.js` |
| No `trust proxy` setting \u2014 unreliable IP detection behind any reverse proxy/load balancer | Added `app.set('trust proxy', 1)` | `server/server.js` |
| Unhandled promise rejections / uncaught exceptions could crash the process with zero log trace | Added global handlers logging via structured logger | `server/server.js` |
| Password-reset emails would link to `localhost` in production if `ADMIN_URL` was unset | Safe fallback + warning log | `server/services/authService.js` |
| CORS only accepted one hardcoded origin, no support for multiple domains or Vercel preview URLs | Accepts a `CORS_ORIGIN` comma-separated list, auto-allows `*.vercel.app` for this project | `server/server.js` |
| No gzip/brotli compression on API responses | Added `compression` middleware | `server/server.js` |
| No protection against MongoDB operator-injection via query/body | Added `express-mongo-sanitize` | `server/server.js` |
| No graceful shutdown \u2014 deploys/restarts could drop in-flight requests | Added SIGTERM/SIGINT handling | `server/server.js` |
| Every log was an unstructured `console.log` string \u2014 not parseable by any log aggregator | Replaced with structured JSON logging (Winston) across the entire backend | `server/utils/logger.js` + 7 other files |

## 3. Admin App

| Issue | Fix | File(s) |
|---|---|---|
| Default admin credentials (`admin@ipmc-ng.com / admin123`) displayed publicly on the login page | Removed | `admin/src/pages/AdminLogin.jsx` |
| No request timeout, no network-vs-server error distinction in admin's API client | Hardened to match the public site's fix | `admin/src/services/api.js` |
| Forgot/reset password: backend routes existed, admin had zero UI for them \u2014 a locked-out admin had no recovery path | Built both pages, wired routes + API methods, added the login-page link | `admin/src/pages/ForgotPassword.jsx`, `ResetPassword.jsx`, `App.jsx`, `services/api.js` |
| Endpoint audit: all 40+ admin\u2192server API calls checked | Verified every call matches a real route + method \u2014 no mismatches found | \u2014 |

## 4. UX: Broken Interactions

| Issue | Fix | File(s) |
|---|---|---|
| Blog cards/links did nothing when the backend was unreachable (empty state, no fallback) | Added fallback blog content (6 real posts, original write-ups) used automatically whenever the API is empty/unreachable | `client/src/data/blogPosts.js`, `Blog.jsx`, `BlogPost.jsx` |
| `alert()` used for all form feedback \u2014 jarring, blocks the page, looks unfinished | Replaced everywhere with `react-toastify` toasts | `Contact.jsx`, `ProposalRequest.jsx`, `NewsletterPopup.jsx`, `App.jsx` |
| Newsletter popup had no keyboard focus trap \u2014 Tab could silently escape into hidden page content behind the overlay | Added focus trap, Escape-to-close, initial focus on open, `role="dialog"`/`aria-modal` | `NewsletterPopup.jsx` |
| Mobile nav menu didn't lock background scroll | Fixed | `Navbar.jsx` |

## 5. Visual Design System

Full rationale in `docs/DESIGN_SYSTEM.md`. Applied via a token remap in
`tailwind.config.cjs`, so every existing component (`bg-primary-900`,
`text-accent-500`, etc.) inherited the new palette without per-component edits:

- **Palette**: Ink (#0B1830), Signal (#2451C4), Brass (#C8862B), Verified
  green (#15803D, used sparingly) \u2014 replacing the previous generic
  blue/amber combination
- **Type**: Fraunces (display/headlines only) + IBM Plex Sans (body/UI,
  an engineering-house grotesk) + IBM Plex Mono for every stat and data
  figure site-wide \u2014 a consistent signal that numbers here are measured
  facts
- **Signature elements**: the "Tick-Rule" (a measurement-tick section
  divider, applied to the hero/footer boundaries) and the "Stamp Mark"
  (a verification seal, reserved for real certifications)
- Fonts switched from a render-blocking `@import` in CSS to a proper
  `<link>` in `index.html` with `display=swap` (also a performance fix)

**Not yet done**: full page-by-page visual rebuilds (hero imagery,
illustration style, dark-mode variants for every component). The
foundations are in place; applying them to every remaining page/section is
the natural next step if wanted.

## 6. Content Accuracy

All placeholder content replaced with real data extracted directly from
ipmc-ng.com: phone number, email, three office addresses, capability/nav
structure, leadership team (names + roles), hero messaging, blog post
titles/dates, footer service list. Team member photo URLs extracted
(11/11 found) \u2014 download blocked by this sandbox's lack of internet
access; script + instructions included (`scripts/ipmc-team-images/`).

## 7. CI / Process

| Issue | Fix | File(s) |
|---|---|---|
| Zero automated checks \u2014 a broken commit could ship silently | Added a GitHub Actions workflow: builds client + admin, boots the server against a real MongoDB and hits a live endpoint | `.github/workflows/ci.yml` |

---

## What's still genuinely open (not done, and why)

- **No test suite** \u2014 the CI above catches build/boot failures, not logic
  regressions. Adding real unit/integration tests (Vitest for client,
  Jest+Supertest for server) is a substantial separate task.
- **Admin auth tokens in `localStorage`** (XSS-readable) \u2014 moving to
  httpOnly cookies is a real architectural change (server-side sessions,
  CSRF handling, cross-subdomain cookie config) since client/admin/server
  are three separately deployed apps.
- **Dead `JWT_REFRESH_*` config** \u2014 defined but no refresh-token endpoint
  implemented anywhere.
- **Hotlinked Unsplash hero images** \u2014 fragile for production; a fallback
  gradient was added earlier, but self-hosting optimized images (webp/avif)
  is still worth doing.
- **No error monitoring** (Sentry or equivalent) wired to the new
  structured logger \u2014 straightforward to add once you have an account/DSN.
- **Full page-by-page redesign** using the new design tokens \u2014 foundations
  are wired in, but hero/about/services/blog page layouts haven't been
  individually rebuilt around them yet.
- **Team photos not actually downloaded** \u2014 sandbox has no internet access
  for binary downloads; URLs extracted and a working script provided
  instead (see section 6).

Tell me which letters/numbers to do next, and I'll keep going.

---

## Round 3 — Full site-map completeness (web scraping) + refresh-token rotation

### 13. Complete route/link audit against the real ipmc-ng.com site map

Acted as a scraper against the live site's navigation to extract the
**complete, real capability structure** — 32 individual service pages
across 7 categories (Engineering Services, Advisory Services, Data
Management, Manpower Supply, QHSE, ESG Services, Asset Integrity
Management) — versus the 8 services this app previously knew about.

- `client/src/data/services.js` — all 32 services with slug, category,
  summary and description, **written fresh for this project** (not
  copied/paraphrased from the source site's page text — only factual
  structure like URLs, category names and service titles was extracted,
  which isn't copyrightable expression)
- `Navbar.jsx` — Capabilities dropdown rebuilt as a proper mega-menu
  (desktop: 4-column grid by category; mobile: collapsible category
  groups) showing all 32 services, replacing the old flat 8-item list
- `Footer.jsx` — "Other Links" column now matches the real site's footer
  exactly (Financial Advisory, ESG Ratings, Environmental Services, ESG
  Questionnaire, ESG Advisory)
- `ServiceDetail.jsx`, `Services.jsx` — rewritten with the same
  API-first/local-fallback pattern used for blog: works correctly whether
  or not the backend has these services seeded in MongoDB
- **Two real 404s closed**: `/esg/questionnaire` and `/esg/advisory` were
  linked in the nav but had no matching route at all. Built both pages
  (`EsgQuestionnaire.jsx` — a working interactive self-assessment,
  `EsgAdvisory.jsx`) and wired the routes.
- **Two more found in a full link audit**: `/privacy` and `/terms` were
  linked in the footer with zero matching route. Built both. Also found
  the footer's "Admin" link was an internal React Router `<Link>` to
  `/admin` — which would 404, since the admin dashboard is a *separate*
  deployed app, not a route in this SPA. Fixed to a real external link
  using `VITE_ADMIN_URL`.
- **Verified**: ran a full audit of every `<Link to="...">` in the
  codebase against the registered routes in `App.jsx` — zero orphaned
  links remain.
- **Bonus fix while sweeping the whole codebase for syntax errors**:
  found and fixed a pre-existing bug in `ProjectGallery.jsx` (unescaped
  apostrophes in string literals — "Africa's", "Nigeria's" — that would
  have broken the entire client build, unrelated to any of this session's
  changes).

### 14. Refresh-token rotation

Previously flagged as dead config (`JWT_REFRESH_SECRET`/`JWT_REFRESH_EXPIRE`
existed but nothing used them) — now implemented:

- Access tokens are now short-lived (`JWT_EXPIRE=15m` by default, down
  from 30 days) — a stolen access token is useful for minutes, not a month
- A separate refresh token (7-day, **path-scoped to `/api/auth` only** so
  it's never even sent on unrelated API calls) silently renews the
  session via a new `POST /api/auth/refresh` endpoint
- Only the refresh token's *hash* is stored on the user record (same
  pattern as the password itself) — rotated on every use, so replaying an
  old refresh token after it's been superseded is rejected, not silently
  accepted
- `admin/src/services/api.js` — on any `401`, the client now attempts one
  silent refresh and retries the original request before falling back to
  a full redirect to `/admin/login`; concurrent 401s share a single
  in-flight refresh call rather than racing each other
- Logout now explicitly revokes the stored refresh-token hash server-side,
  not just clearing cookies client-side
- Full test coverage in `tests/auth.test.js`: refresh cookie is
  httpOnly + correctly path-scoped, `/refresh` issues a working new
  session from the cookie alone, **rotation actually invalidates the
  previous refresh token** (verified by replaying it and expecting 401),
  and a refresh attempt with no cookie at all is rejected

**Still a known scope limit**: single active session per user (a new
login/refresh overwrites the previous refresh-token hash) — multi-device
concurrent sessions aren't supported. Documented as a deliberate tradeoff,
not an oversight.

### 15. Still open from Round 2's list

Being direct about what this round did *not* get to, given time spent on
the two items above:
- **A1/A2/A3 (test coverage)**: no new tests were added for admin CRUD
  pages, service detail pages, or the blog post page specifically this
  round — coverage is still limited to auth, contact, and the blog
  fallback data module from Round 2.
- **C1–C6 (individual page redesigns)**: `Services.jsx` and
  `ServiceDetail.jsx` were substantially rebuilt as part of the routing
  work above (so C3 is effectively done), but About/Home/Blog/Contact
  page-level layout redesigns beyond the Round 2 token pass are still
  outstanding.

Full repo syntax-checked clean after this round: 74 client/admin files,
0 failures; all server `.js` files pass `node --check`.

---

## Round 4 — Multi-device sessions, expanded test coverage, and a real bug the tests caught

### 16. Multi-device session support

Previously (Round 3), refresh tokens were single-session — logging in on a
second device would silently invalidate the first. Fixed properly:

- `User` model now stores an array of session entries (`refreshSessions`),
  each with its own token hash, device label, and expiry — not one field
  overwritten on every login
- Logging in on a phone no longer signs out an already-open desktop session
- Logout only revokes *that device's* session, not every session
- A password reset still deliberately clears **all** sessions (a reset is
  a signal the account may be compromised — this one stays intentionally
  aggressive)
- New admin UI: **Active Sessions** page (`admin/src/pages/Sessions.jsx`,
  linked in the sidebar) lists every logged-in device with a "Sign out"
  button per device, and flags which one is the current session
- Backend: `GET /api/auth/sessions`, `DELETE /api/auth/sessions/:id`
- Sessions cap at 5 per user (oldest dropped) so the array can't grow
  unbounded from repeated logins

### 17. Expanded test coverage

- **Admin CRUD** (`tests/adminBlogCrud.test.js`): full authorization
  matrix for blog post management — unauthenticated is rejected, a viewer
  (read-only role) is rejected, an editor can create/update but *not*
  delete, an admin can delete and the post is verifiably gone afterward,
  and a malformed post is rejected by validation
- **Service catalog** (`client/src/data/services.test.js`): all 32
  services have unique slugs, every service belongs to a real category,
  no category is empty, lookup helpers work correctly
- Still not covered: the `ServiceDetail`/`BlogPost` React components
  themselves (as opposed to their underlying data), and the
  service/team/partner/ESG admin managers beyond blog

### 18. A real bug the new tests caught

While writing the services-data test, checked the actual data flow end to
end and found: **`api.getService()`, `api.getPost()`, `api.getPosts()`,
`api.getServices()`, and `api.getTeam()` already unwrap the response's
`.data` field internally** (`apiFetch(...).then(r => r.data)`) — but five
call sites (`ServiceDetail.jsx`, `Services.jsx`, `Blog.jsx`,
`BlogPost.jsx` \u00d72, `Team.jsx`) were then doing `res.data` *again* on
top of that. Since the actual API response never has a nested
`.data.data`, this meant **these pages were silently ignoring real
backend data and always falling back to local content**, even when the
backend had valid records. All five call sites fixed. This was a subtle,
easy-to-miss production bug that plain code review hadn't caught — the
tests did.

### 19. Real IPMC team roster completed

`client/src/data/team.js` — added the remaining 7 real staff members
(names/roles extracted from ipmc-ng.com/about; bios written fresh) beyond
the 4 leadership entries already in place, consolidated into one shared
file used by both the homepage teaser and the full Team page (previously
duplicated data, now one source of truth). `Team.jsx` also gained the same
API-first/local-fallback pattern as blog/services — previously it showed
an empty state whenever the backend had no team records.

### 20. Team photos — still an open, structural limitation

Re-confirmed: the sandbox this project is built in has no outbound
internet access for downloading binary files. The real image URLs for all
11 team members are still accurately captured in
`scripts/ipmc-team-images/team.json`, and the download script there is
unchanged and ready to run anywhere with normal internet access. This
hasn't changed since it was first flagged — it's an environment
limitation, not something more effort in this sandbox can solve.

### Still open after this round

- Individual page **visual** redesigns (Home/Blog/Contact layout rebuilds
  beyond the token pass) — not addressed this round; time went to
  sessions + tests + the bug fix above
- Component-level tests for ServiceDetail/BlogPost/admin managers beyond
  blog
- Error monitoring (Sentry or equivalent) still not wired to the logger

---

## Round 2 — Full page redesign pass, test suite, cookie auth, Docker

### 8. Design tokens applied further

Applied `.stat-figure` (mono, tabular numerals — the design system's
signature "this number is measured" signal) to the remaining stat displays
that were still using the old serif treatment: `WhyChooseUs.jsx`,
`AboutSection.jsx`, and the milestone years in `About.jsx`.

**Still open**: full page-by-page layout rebuilds (hero imagery direction,
illustration style, dark-mode variants) haven't been done — this was a
targeted token-consistency pass, not a ground-up redesign of every page.

### 9. Real test suite

**Server** (`server/tests/`, Jest + Supertest + `mongodb-memory-server`):
- `health.test.js` — health check, empty-state services list, structured 404s
- `contact.test.js` — **regression test for the exact production bug that
  was fixed**: asserts the contact form saves the message and responds
  quickly even with zero SMTP configuration, plus validation edge cases
  (missing field, short message, invalid email)
- `auth.test.js` — the full cookie-auth flow: login sets an httpOnly
  cookie + readable CSRF cookie, wrong password is rejected, `/me` works
  from the cookie alone with no Authorization header, a state-changing
  request **without** the CSRF header is correctly rejected with 403,
  logout actually clears the session

Refactored `server.js` to export the Express `app` separately from calling
`.listen()` (guarded by `require.main === module`), and `config/db.js` to
skip auto-connecting when `NODE_ENV=test`, since tests manage their own
in-memory MongoDB connection. This is what makes the app testable with
Supertest in the first place — it wasn't before.

**Client** (`client/src/**/*.test.{js,jsx}`, Vitest + Testing Library):
- `data/blogPosts.test.js` — the fallback blog data has unique slugs,
  lookup by slug works, unknown slugs return `null`, related-posts
  excludes the current post and respects the limit
- `components/UI/LoadingSpinner.test.jsx` — component smoke test

Run with `npm test` in either `client/` or `server/`. Wired into CI (see
below) so these run on every push automatically.

**Still open**: this is meaningful coverage of the areas that actually broke
in production, not exhaustive coverage of the whole app (e.g. the admin
CRUD pages, blog/service detail pages, and most form validation paths
still have no tests).

### 10. Admin auth hardening — cookie-based sessions

The JWT no longer lives in `localStorage` (readable by any JS on the page,
including anything injected via XSS). It's now in an **httpOnly cookie**
that page JavaScript literally cannot read.

- `server/utils/authCookies.js` — sets the auth cookie (httpOnly) and a
  separate CSRF cookie (deliberately *not* httpOnly, since the frontend
  needs to read and echo it back)
- `server/middleware/csrf.js` — double-submit CSRF check: any
  state-changing request authenticated via the cookie must also carry a
  matching `X-CSRF-Token` header, which a forged cross-site request can't
  produce even though the browser auto-attaches the cookie
- `middleware/auth.js` — now accepts either an `Authorization` header
  (API clients/scripts) or the cookie (browser sessions)
- `authController.js` — login/register set the cookies; added a real
  `POST /auth/logout` that clears them
- `admin/src/services/api.js` — every request now sends
  `credentials: 'include'` instead of manually attaching a token from
  localStorage, and attaches the CSRF header on mutating requests
- `admin/src/context/AdminAuth.jsx` — rewritten around asking the server
  "am I logged in?" via `/auth/me` on load, instead of trusting a token
  cached in localStorage

**A correctness bug I caught mid-implementation and fixed**: client/admin
(Vercel) and the server (Render/Railway, etc.) are normally on entirely
different domains, not just subdomains of one site. Browsers only send
`SameSite=Strict` or `Lax` cookies on **same-site** requests — a cross-site
`fetch()` call (exactly what the admin app makes) would have had the
cookie silently dropped, breaking auth completely in your actual
deployment shape. Fixed by using `SameSite=None; Secure` in production
(safe specifically because the CSRF middleware above exists to cover the
gap that setting opens).

**Still open**: no refresh-token rotation (sessions are just a flat
30-day-lived cookie); rate-limiting is applied to `/login` but not
specifically to repeated CSRF failures.

### 11. Dockerized, multi-stage builds

- `client/Dockerfile`, `admin/Dockerfile` — stage 1 builds the Vite app in
  `node:20-alpine`, stage 2 copies only the compiled `dist/` into
  `nginx:alpine`. Final images ship no Node, no source, no
  `node_modules` — just static files and nginx (roughly 25MB vs. several
  hundred MB for a Node-based image).
- `client/nginx.conf`, `admin/nginx.conf` — SPA fallback (`try_files ...
  /index.html`, the container equivalent of the `vercel.json` rewrite),
  gzip, immutable caching for hashed asset filenames, no caching on
  `index.html` so deploys take effect immediately, a `/health` endpoint.
- `server/Dockerfile` — stage 1 installs production-only dependencies,
  stage 2 copies them plus source into a fresh `node:20-alpine`, runs as a
  **non-root user**, includes a real `HEALTHCHECK`.
- `docker-compose.yml` — orchestrates MongoDB + server + client + admin
  together, with a Mongo health check gating server startup, named
  volumes for Mongo data and server uploads, and all the env vars wired
  between services (`CORS_ORIGIN`, `VITE_API_URL` passed as build args
  since Vite bakes them in at build time, etc.).
- `.env.docker.example` — copy to `.env` and run
  `docker compose up --build` to run the entire stack locally in one command.

**Still open**: no production orchestration beyond Compose (no Kubernetes
manifests, no multi-replica setup) — reasonable for a site this size, but
worth knowing if traffic grows enough to need it.

### 12. CI now actually runs the tests

`.github/workflows/ci.yml` updated: `client-build` now runs `npm test`
before building, and a new `server-test` job runs the full Jest suite
against an in-memory MongoDB (no external DB needed) before the existing
`server-boot-check` job (which still boots the real server against a real
MongoDB service container and hits a live endpoint, as a final sanity
check).
