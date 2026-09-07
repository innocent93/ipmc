# IPMC production fixes applied

This build keeps the existing MERN architecture and fixes the broken integration points instead of replacing the application.

## Authentication / CSRF
- Added `GET /api/auth/csrf` bootstrap endpoint.
- Fixed cross-domain CSRF handling for the Vercel admin app and Render API.
- CSRF tokens are returned by login/refresh and stored in admin `sessionStorage`.
- Admin mutating requests automatically send `X-CSRF-Token`.
- Added one automatic recovery for a stale CSRF token.
- Login, refresh, forgot-password and reset-password no longer fail because of stale admin cookies.
- Public contact, newsletter, RSVP and job-application submissions are not blocked by an unrelated admin session cookie.
- JWT access tokens are no longer returned in login/refresh JSON responses; they remain in httpOnly cookies.
- Password reset no longer creates a new authenticated session automatically.
- Public registration cannot select an `admin`/`editor` role; new public registrations are viewers.

## Admin UX / CRUD
- Removed the production-facing connection diagnostic from Admin Login.
- Fixed message view/mark-as-read flow.
- Added admin-only content listing endpoints so drafts/inactive records can still be managed.
- Blog manager can manage published and draft posts.
- Added Jobs Manager CRUD.
- Added Partners Manager CRUD.
- Added ESG Manager CRUD.
- Existing Services, Team and Events managers now use admin listings so inactive records are manageable.

## Client frontend
- Fixed API list-response handling. The backend returns `{ data: [...] }`; public pages now correctly receive arrays.
- Fixed production API fallback to `https://ipmc.onrender.com/api` when `VITE_API_URL` is absent.
- Fixed public search result handling and expanded search to services, insights, team, ESG and careers.
- Search now searches relevant content fields and clamps result limits.
- Fixed Events page to adapt the backend event schema (`category`, `startDate`, `coverImage`, `rsvpCount`) to the existing UI.
- Fixed client list pages to request enough records for their existing pagination/catalog UI.
- Fixed Careers rendering when optional requirements/responsibilities are missing.
- Removed registration of a missing `/sw.js` service worker.
- Fixed a broken LoadingSpinner test import.

## Verification
- All server-side JavaScript files pass `node --check`.
- Relative imports in client/admin source files were checked and no missing relative imports remain.
- CSRF middleware behavior was exercised directly for login/reset/public forms/protected mutations.

A full Vite production build could not be executed in this environment because package installation timed out, so dependencies were not included in the ZIP.

## Newsletter & Careers production pass (2026-09-07)

- Added a permanent newsletter subscription form to the public footer; no popup is required for subscription.
- Added an inline subscription form to the Newsletter Archive page.
- Newsletter subscribers now retain source, subscription/resubscription/unsubscription timestamps, welcome-email timestamp, and last-newsletter timestamp while preserving existing records.
- Added deterministic signed unsubscribe tokens and a public unsubscribe page/link, plus List-Unsubscribe email metadata.
- Welcome and newsletter issue emails now use a responsive, table-based, inline-styled IPMC email template with preheader, branded header, readable content area, website link and unsubscribe link, plus plain-text fallbacks.
- Newsletter subscription remains the critical database path; Resend delivery remains best-effort and cannot make a successful subscription fail.
- Added an admin Newsletter Subscribers page for active/unsubscribed visibility and source/date tracking.
- Job administration supports editing title, slug, department, location, type, description, requirements, responsibilities, benefits, salary, experience, closing date and visibility. New job titles auto-suggest a slug.
- Applications are now rejected when a job is inactive or its closing date has passed.
- Careers no longer displays fake/sample vacancies when the production API is unavailable; it shows a proper empty state instead.
- Job application confirmation emails use the same branded production email system.
- Public social icons remain deliberately dummy placeholders until the real URLs are supplied.

### Verification
- All server JavaScript files pass `node --check`.
- Relative import audit passes.
- Newsletter email template runtime checks pass.
- CSRF regression checks pass, including public newsletter unsubscribe and protected mutations.
- Full Jest/Vite dependency-based suites could not be executed in this build environment because package installation timed out; no test result is being falsely represented as passed.
