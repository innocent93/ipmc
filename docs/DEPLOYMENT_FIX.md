# Deployment Fix Notes \u2014 ipmc.vercel.app

This document covers the three issues reported against the deployed site and
what was actually wrong.

---

## 1. `/contact` returns "Not Found"

**Root cause:** React Router uses client-side routing (`BrowserRouter`), which
means only `/` is a real file on the server \u2014 every other route
(`/contact`, `/about`, `/blog/some-post`, etc.) only exists once JavaScript
loads and takes over. When you type `ipmc.vercel.app/contact` directly (or
refresh the page there), Vercel looks for a literal `/contact` file, doesn't
find one, and returns a real 404 \u2014 there was no rewrite rule telling it to
serve `index.html` for unknown routes instead.

**Fix applied:** added `client/vercel.json`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This tells Vercel: for any path that doesn't match a real static file, serve
`index.html` and let React Router take over client-side. This fixes **every**
route, not just `/contact`.

**Action needed from you:** none beyond redeploying \u2014 Vercel auto-detects
`vercel.json` in the project root you're deploying (here, that's the `client/`
folder if that's your Vercel project root).

---

## 2. Contact form submission fails

**Root cause \u2014 this is the important one:** `ipmc.vercel.app` is a
**static deploy of the `client/` folder only**. The `server/` Express/MongoDB
backend in this repo is a separate Node application \u2014 Vercel isn't running
it anywhere. So when the contact form calls the API, it's calling
`http://localhost:5000/api/contact` (the default fallback in `api.js` when
`VITE_API_URL` isn't set), which doesn't exist from a visitor's browser at
all. No amount of frontend code fixes this alone \u2014 **you need a backend
running somewhere**, and the frontend needs to know its URL.

**Fixes applied to the code:**
- `client/src/utils/api.js` now has request timeouts and distinguishes
  "server responded with an error" from "couldn't reach the server at all",
  so the toast message is actually useful instead of a generic failure.
- `server/server.js` CORS now accepts a `CORS_ORIGIN` env var (comma-separated
  list) and automatically allows any `https://ipmc*.vercel.app` origin, so
  once the backend exists, your Vercel frontend won't get silently CORS-blocked.
- Replaced `alert()` with `react-toastify` toasts everywhere (contact form,
  proposal form, newsletter signup) \u2014 see section 4.

**Action needed from you (this part can't be done from inside this repo):**
1. Deploy `server/` somewhere that runs long-lived Node processes \u2014 Vercel
   serverless functions don't fit an always-on Express+MongoDB app well.
   Reasonable options: **Render**, **Railway**, **Fly.io**, or a small VPS.
   (`server/docs/DEPLOYMENT.md` in this repo already has a walkthrough.)
2. Once deployed, you'll have a backend URL, e.g. `https://ipmc-api.onrender.com`.
3. In **Vercel \u2192 Project Settings \u2192 Environment Variables**, add:
   ```
   VITE_API_URL=https://ipmc-api.onrender.com/api
   ```
   Redeploy the client after adding this \u2014 Vite bakes env vars in at build time.
4. On the backend host, set:
   ```
   CORS_ORIGIN=https://ipmc.vercel.app
   CLIENT_URL=https://ipmc.vercel.app
   MONGO_URI=<your MongoDB connection string>
   ```

Until step 1\u20134 are done, the contact form, proposal form, and any live
blog/services data will not work on the deployed site \u2014 this is a hosting
gap, not a bug in the given code.

---

## 3. Blog section didn't work when clicked

**Root cause:** same as #2 \u2014 `Blog.jsx` and `BlogPost.jsx` fetched posts
purely from the (unreachable) API and showed "No posts found" / "Post Not
Found" with no fallback.

**Fix applied:** added `client/src/data/blogPosts.js` with the real post
titles/dates/categories from `ipmc-ng.com`, written up fresh for this site.
`BlogSection` (homepage teaser), `Blog.jsx` (listing page), and
`BlogPost.jsx` (detail page) all now fall back to this local data whenever
the API is unreachable or returns nothing, so blog navigation and reading
works correctly **even before the backend is deployed**. Once the backend
is live and has real posts in MongoDB, the API data takes priority
automatically \u2014 fallback content is only used when there's nothing else.

---

## 4. `alert()` replaced with toast notifications

Added `react-toastify`. `<ToastContainer />` is mounted once in `App.jsx`.
Replaced in:
- `pages/Contact.jsx`
- `pages/ProposalRequest.jsx`
- `components/UI/NewsletterPopup.jsx`

Run `npm install` in `client/` to pull in the new dependency before building.

---

## 5. Structured logging on the backend

Replaced all `console.log`/`console.error` calls with a Winston-based
structured logger (`server/utils/logger.js`). Every log line is a JSON
object with a timestamp, level, message, and relevant metadata (e.g.
`{ "level": "error", "message": "unhandled_error", "path": "/api/contact", ... }`),
so logs are grep/aggregator-friendly on whatever host you deploy to. HTTP
access logs (via `morgan`) are piped through the same logger so everything
lands in one place. Console output stays human-readable in development and
switches to pure JSON when `NODE_ENV=production`.

Run `npm install` in `server/` to pull in the new `winston` dependency.

---

## 6. Contact form: "not working," no error, nothing in backend logs

**This was the real bug behind what you just hit.** It wasn't CORS (your
GET requests for blog/services already proved CORS works) \u2014 it was the
email-sending code.

`contactService.submitContact()` (and the same pattern in
`newsletterService.subscribe()` and `authService.forgotPassword()`) called
`sendEmail()` **and waited for it before responding to the client.** The
SMTP transporter had **no timeout configured**. So if `SMTP_HOST` /
`SMTP_USER` / `SMTP_PASS` weren't set on your deployed backend (a manual
step that's easy to skip), nodemailer tried to connect to `undefined` and
just hung \u2014 no error thrown, no timeout, nothing. The request sat open
until your hosting platform silently killed it, which meant:
- Express never called `res.json()`, so `morgan`/winston never logged the
  request (their log line only fires when the response *finishes*) \u2014
  matching "no error, nothing in the logs."
- Your browser's own request just hung until the client-side 10s timeout
  (added in the fix above) aborted it.

**Fixes applied:**
1. `emailService.js` now checks whether SMTP is actually configured before
   attempting anything. If it isn't, it logs a warning and returns
   immediately instead of trying to connect.
2. The transporter now has `connectionTimeout` / `greetingTimeout` /
   `socketTimeout` (8s each), so even a genuinely broken SMTP host fails
   fast and loud instead of hanging.
3. **Email sending is no longer on the critical path.** Saving the contact
   message (or newsletter subscription) to MongoDB is what the client
   waits on \u2014 that's the part that must not fail silently. The
   notification emails now fire in the background via
   `sendEmailInBackground()` and log their own success/failure without
   blocking or breaking the response. Practically: **your contact form now
   works and saves messages to the database even with zero email
   configuration** \u2014 email is a bonus, not a dependency.
4. Added `app.set('trust proxy', 1)` \u2014 needed on basically every hosting
   platform behind a proxy/load balancer for accurate IP detection.
5. Added global `unhandledRejection` / `uncaughtException` handlers that
   log via the structured logger, so if something like this happens again
   you'll see it in your logs instead of silence.

**Action needed from you:** none for the form to work \u2014 messages now save
regardless of email config. If you *do* want the notification emails to
actually send, set real values for `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` on
your backend host (Gmail App Password works \u2014
https://myaccount.google.com/apppasswords, not your normal password). If
your host blocks outbound SMTP ports (common on some free tiers), switch to
a transactional email API (Resend, SendGrid) instead \u2014 those use HTTPS
and aren't affected by SMTP port blocking. See the updated
`server/.env.example` for details.

---

## 7. Admin app: sync audit (client \u2194 admin \u2194 server)

You asked me to verify everything is wired together end-to-end. Here's
what I checked and what I found.

**Endpoint audit result: all 40+ admin API calls match a real server route**
with the correct HTTP method (blog/services/team/contact/newsletter/
partners/esg/jobs/analytics/settings/upload CRUD). No mismatches found there.

**Real bugs found and fixed in the admin app itself:**

1. **No route for `/`** \u2014 `App.jsx` only defined `/admin/login` and
   `/admin/*`. If the admin app is deployed to its own domain root (its
   own Vercel project, not a subpath of the main site), visiting the bare
   domain showed a blank page with no matching route. Added a redirect
   from `/` \u2192 `/admin`, and a catch-all for unknown paths.
2. **No `admin/vercel.json`** \u2014 same SPA-routing 404 bug as the client
   had on `/contact`, but for every admin route. Fixed the same way.
3. **Default admin credentials shown publicly on the login page** \u2014
   `admin@ipmc-ng.com / admin123` was printed directly under the login form
   for anyone who visits the URL. Removed it. (You'll still want to change
   that seeded password before going live \u2014 see `server/utils/seed.js`.)
4. **`admin/src/services/api.js` had no request timeout** and didn't
   distinguish "server returned an error" from "couldn't reach the server
   at all" \u2014 same class of bug as the client had before the earlier fix.
   Hardened it identically (8s timeout, clearer error messages).
5. **Forgot/reset password was a dead end** \u2014 the backend has working
   `/auth/forgot-password` and `/auth/reset-password/:token` routes, but
   the admin frontend had no UI calling them at all, and no
   `forgotPassword`/`resetPassword` methods in its API client. Built both
   (`ForgotPassword.jsx`, `ResetPassword.jsx`), wired the routes, added the
   missing API methods, and added a "Forgot your password?" link to the
   login page.
6. **Password-reset emails would have linked to `localhost` in
   production** \u2014 `authService.forgotPassword` builds the reset link from
   `ADMIN_URL`, which had no fallback and no warning if left unset. Now
   falls back safely and logs a warning if it's misconfigured, instead of
   silently mailing a broken link.

**Action needed from you:** when you deploy the admin app, set the same
kind of env vars as the client:
```
VITE_API_URL=https://your-backend.onrender.com/api   (on the admin's Vercel project)
ADMIN_URL=https://your-admin-domain.vercel.app        (on the backend)
```
And add the admin's domain to `CORS_ORIGIN` on the backend alongside the
client's domain (comma-separated), e.g.:
```
CORS_ORIGIN=https://ipmc.vercel.app,https://your-admin-domain.vercel.app
```

**What I did not change** (flagging honestly rather than silently skipping):
- Admin auth tokens are stored in `localStorage`, which is readable by any
  JS on the page (XSS risk). Moving to httpOnly cookies would close that
  gap but is a bigger architectural change (needs server-side session
  handling, CSRF protection, and cookie-domain config across client/admin/
  server on different subdomains) \u2014 tell me if you want that done next.
- `JWT_REFRESH_SECRET`/`JWT_REFRESH_EXPIRE` are defined in `.env.example`
  but there's no refresh-token endpoint implemented anywhere \u2014 currently
  dead config. Access tokens just live for `JWT_EXPIRE` (30 days default).
  Fine functionally, just worth knowing it's not actually doing anything.

---

## Summary checklist (updated again)

- [x] `client/vercel.json` added \u2014 fixes 404 on all client-side routes
- [x] Blog pages have working fallback content \u2014 fixes broken blog clicks
- [x] `alert()` \u2192 toast notifications everywhere
- [x] Backend has structured JSON logging
- [x] CORS accepts your Vercel domain automatically
- [x] Contact/newsletter emails no longer block or hang the response \u2014
      messages save even with zero email configuration
- [x] SMTP transporter has real timeouts instead of hanging forever
- [x] `trust proxy` set; unhandled errors are now logged instead of silent
- [x] Admin app: fixed blank-screen-at-root bug, added vercel.json, removed
      publicly-exposed default credentials, hardened API error handling,
      built the missing forgot/reset-password flow
- [ ] **You still need to**: deploy `server/` to a Node host and set
      `VITE_API_URL` on Vercel + `CORS_ORIGIN`/`MONGO_URI` on the backend \u2014
      this is required for the contact form, proposal form, and live CMS
      data to actually work end-to-end.
