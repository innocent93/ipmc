# IPMC Website - Deployment Guide & Cost Estimate

## Can You Keep the Same Domain? YES!

Your domain `ipmc-ng.com` is registered independently of WordPress. You can:
1. Keep the domain with your current registrar (or transfer it)
2. Simply update the DNS records to point to your new hosting
3. No downtime if done correctly (using DNS propagation)

---

## Recommended Deployment Stack (Low Budget)

### Option A: FREE TIER (₦0/month)
Perfect for getting started with zero cost.

| Service | Provider | Cost | Why |
|---------|----------|------|-----|
| **Frontend** | Vercel | FREE | Unlimited bandwidth, auto-deploy from Git |
| **Admin Panel** | Vercel (separate project) | FREE | Same as above |
| **Backend API** | Render | FREE | 512MB RAM, sleeps after 15 min idle |
| **Database** | MongoDB Atlas | FREE | 512MB storage, shared cluster |
| **Images** | Cloudinary | FREE | 25GB storage, 25GB bandwidth/month |
| **Email** | Gmail SMTP | FREE | 500 emails/day |
| **Domain** | Already owned | FREE | Just update DNS |
| **SSL** | Let's Encrypt | FREE | Auto-renewing certificates |

**Total: ₦0 / $0 per month**

> ⚠️ **Render Free Tier Limitation:** Your backend will "sleep" after 15 minutes of inactivity. The first request after sleep takes ~30 seconds to wake up. For production, upgrade to Render's Starter plan ($7/month) to keep it always on.

---

### Option B: PRODUCTION-READY (₦12,000-25,000/month ~ $8-16/month)
Best for a professional, always-on website with no cold starts.

| Service | Provider | Cost/Month | Why |
|---------|----------|------------|-----|
| **Frontend** | Vercel Pro | $20 | Faster builds, analytics, no limits |
| **Admin Panel** | Vercel Pro | $0 (same account) | Included in Pro plan |
| **Backend API** | Render Starter | $7 | Always on, 512MB RAM, custom domain |
| **Database** | MongoDB Atlas M10 | $9 | 2GB RAM, 10GB storage, backups |
| **Images** | Cloudinary Plus | $25 | 225GB storage, advanced transformations |
| **Email** | SendGrid | $0 (free tier) | 100 emails/day, better deliverability |
| **Domain** | Already owned | $10-15/year | Just DNS management |
| **Monitoring** | Vercel Analytics | Included | Real-time performance data |

**Total: ~$16-25/month (₦25,000-40,000/month)**

---

## Step-by-Step Deployment

### Step 1: Prepare Your Code

```bash
# 1. Push everything to GitHub
git init
git add .
git commit -m "Initial commit - IPMC MERN stack"
git remote add origin https://github.com/YOUR_USERNAME/ipmc-website.git
git push -u origin main
```

### Step 2: Deploy Frontend (Vercel)

1. Go to [vercel.com](https://vercel.com) and sign up (free)
2. Click **Add New Project**
3. Import your GitHub repository
4. Set **Root Directory** to `client/`
5. Framework preset: **Vite**
6. Add Environment Variables:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```
7. Click **Deploy**
8. Your site will be live at `https://ipmc-website.vercel.app`

### Step 3: Deploy Admin Dashboard (Vercel)

1. In the same Vercel project, add another deployment
2. Or create a new project pointing to the same repo
3. Set **Root Directory** to `admin/`
4. Framework preset: **Vite**
5. Deploy to `https://ipmc-admin.vercel.app`

### Step 4: Deploy Backend (Render)

1. Go to [render.com](https://render.com) and sign up (free)
2. Click **New +** → **Web Service**
3. Connect your GitHub repo
4. Set **Root Directory** to `server/`
5. Build Command: `npm install`
6. Start Command: `node server.js`
7. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_super_secret_key
   CLIENT_URL=https://ipmc-website.vercel.app
   ADMIN_URL=https://ipmc-admin.vercel.app
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ADMIN_EMAIL=info@ipmc-ng.com
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
8. Click **Create Web Service**

### Step 5: Set Up MongoDB Atlas (FREE)

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a free cluster (M0)
3. Create a database user
4. Add your IP to the whitelist (or allow all: `0.0.0.0/0`)
5. Get your connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/ipmc_db?retryWrites=true&w=majority
   ```
6. Add this to your Render environment variables

### Step 6: Set Up Cloudinary (FREE)

1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Get your **Cloud Name**, **API Key**, and **API Secret** from the dashboard
4. Add these to your Render environment variables

### Step 7: Configure Custom Domain

1. In Vercel, go to your project settings → **Domains**
2. Add `www.ipmc-ng.com`
3. Vercel will give you DNS records to add
4. Go to your domain registrar (where you bought ipmc-ng.com)
5. Add these DNS records:
   ```
   Type: A     Name: @     Value: 76.76.21.21
   Type: CNAME Name: www   Value: cname.vercel-dns.com
   ```
6. Wait 5-48 hours for DNS propagation
7. Vercel will auto-provision SSL certificates

### Step 8: Update WordPress DNS (Migration)

**Before switching:**
1. Lower TTL (Time To Live) on your DNS records to 300 seconds (5 minutes) 24 hours before migration
2. This ensures faster propagation

**During switch:**
1. Update your A record to point to Vercel's IP: `76.76.21.21`
2. Update your CNAME for www to: `cname.vercel-dns.com`
3. Your site will be live on the new stack within minutes

**After switch:**
1. Verify everything works
2. You can cancel WordPress hosting after confirming
3. Keep domain registration active (don't cancel that!)

---

## SEO Migration Checklist

When moving from WordPress to MERN, preserve your SEO:

- [ ] **301 Redirects** - Map old WordPress URLs to new React routes
  ```javascript
  // In server.js or Vercel redirects config
  // Old: /2022/01/15/nigeria-top-100 → New: /blog/nigeria-top-100
  ```
- [ ] **Sitemap.xml** - Auto-generated at `/sitemap.xml`
- [ ] **Robots.txt** - Already included in public folder
- [ ] **Meta Tags** - React Helmet handles all page-specific SEO
- [ ] **Google Search Console** - Re-verify domain, submit new sitemap
- [ ] **Google Analytics** - Update tracking code (add GA4 ID to .env)

---

## Performance Optimization

### Before Going Live
1. **Compress Images** - Use TinyPNG or Cloudinary auto-optimization
2. **Enable Gzip** - Already configured in server.js with `compression` middleware
3. **Lazy Loading** - Images load as user scrolls (already implemented)
4. **Code Splitting** - Vite automatically splits chunks
5. **CDN** - Vercel and Cloudinary both use global CDNs

### Expected Performance
- **Page Load:** < 1.5 seconds (vs 4-6s on WordPress)
- **Lighthouse Score:** 95+ (vs 60-70 on WordPress)
- **Core Web Vitals:** All green
- **Mobile Score:** 95+ (fully responsive)

---

## Backup Strategy

### Database (MongoDB Atlas)
- **Free tier:** Manual backups weekly
- **Paid tier ($9/month):** Automated daily backups with 7-day retention
- **Export:** Use `mongodump` for local backups

### Code
- GitHub is your backup (always push changes)
- Vercel keeps deployment history

### Images
- Cloudinary keeps versions
- Download originals before uploading

---

## Monitoring & Maintenance

### Free Monitoring Tools
- **Vercel Analytics** - Built into dashboard
- **Render Metrics** - CPU, memory, response times
- **MongoDB Atlas** - Database performance metrics
- **UptimeRobot** (free) - Ping your site every 5 minutes, alerts via email

### Monthly Maintenance Tasks
1. Update npm packages: `npm update`
2. Check for security vulnerabilities: `npm audit`
3. Review contact form submissions
4. Update blog content (2-4 posts/month for SEO)
5. Check Google Search Console for errors
6. Backup database

---

## Cost Comparison: WordPress vs MERN

| Expense | WordPress (Current) | MERN (Free Tier) | MERN (Production) |
|---------|---------------------|------------------|-------------------|
| Hosting | ₦50,000-150,000/yr | ₦0 | ₦180,000/yr |
| Domain | ₦10,000/yr | ₦10,000/yr | ₦10,000/yr |
| SSL Certificate | ₦15,000/yr | FREE | FREE |
| Security Plugin | ₦30,000/yr | FREE (built-in) | FREE |
| Backup Plugin | ₦20,000/yr | FREE (MongoDB) | FREE |
| Page Builder | ₦40,000/yr | FREE (custom code) | FREE |
| CDN | ₦25,000/yr | FREE (Vercel) | FREE |
| **TOTAL/YEAR** | **₦190,000-290,000** | **₦10,000** | **₦190,000** |

**Savings with Free Tier: ₦180,000-280,000 per year**

---

## Emergency Contacts

If something breaks during deployment:

| Issue | Contact |
|-------|---------|
| Domain/DNS | Your domain registrar support |
| Vercel Deployment | Vercel Support (chat) |
| Render Issues | Render Community Forum |
| MongoDB | MongoDB Atlas Support |
| General Help | tech@ipmc-ng.com |

---

## Next Steps After Deployment

1. **Week 1:** Test all pages, forms, and mobile responsiveness
2. **Week 2:** Set up Google Analytics 4 and Search Console
3. **Week 3:** Add real project photos to the gallery
4. **Week 4:** Write 2-3 new blog posts via admin panel
5. **Month 2:** Collect testimonials and add to website
6. **Month 3:** Consider upgrading Render to paid tier if traffic grows

---

**Document Version:** 1.0  
**Last Updated:** August 2024  
**Prepared for:** IPMC Limited
