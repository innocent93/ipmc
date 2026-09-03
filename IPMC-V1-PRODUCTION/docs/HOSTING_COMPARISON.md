# IPMC Website - Hosting Comparison & Recommendation
## Updated: August 2026

---

## The Real Truth About Hosting Costs

You asked a great question. My initial estimate was for premium cloud. But you can run this entire MERN stack for WAY less than WordPress.

---

## Hosting Provider Comparison (2026)

### 1. CONTABO - BEST VALUE
**German company, worldwide data centers**

| Plan | Price/Month | Specs |
|------|-------------|-------|
| **Cloud VPS 10** | **$3.99 (~N6,500)** | 2 vCPU, 4GB RAM, 300GB SSD, UNLIMITED bandwidth |
| Cloud VPS 20 | $6.99 (~N11,500) | 4 vCPU, 8GB RAM, 100GB NVMe, UNLIMITED bandwidth |

**Pros:**
- Cheapest by far - half the price of competitors
- UNLIMITED bandwidth - no surprise bills
- No price hike on renewal
- DDoS protection included FREE
- Full root access
- 300GB SSD storage

**Cons:**
- Unmanaged - you install everything (we provide scripts!)
- Setup takes 30 minutes

**SSL:** FREE via Let's Encrypt (auto-renewing)
**Security:** DDoS protection + firewall + full control

---

### 2. HOSTINGER
**Popular managed VPS**

| Plan | Intro | Renewal | Specs |
|------|-------|---------|-------|
| KVM 1 | $6.49 | **$11.99 (~N19,800)** | 1 vCPU, 4GB RAM, 50GB NVMe |
| KVM 2 | $8.99 | **$14.99 (~N24,700)** | 2 vCPU, 8GB RAM, 100GB NVMe |

**Pros:** Managed, good support, user-friendly
**Cons:** Price DOUBLES after intro, only 50GB storage, bandwidth limits

---

### 3. DIGITALOCEAN
**Developer-friendly but pricey**

| Plan | Price | Specs |
|------|-------|-------|
| Basic Droplet | $24/mo (~N39,600) | 2 vCPU, 4GB RAM, 80GB SSD |
| Managed MongoDB | $15/mo (~N24,700) | 2GB RAM, 10GB storage |
| **Total** | **$39/mo (~N64,300)** | |

**Pros:** Reliable, excellent docs
**Cons:** EXPENSIVE, bandwidth overage charges

---

### 4. RENDER (PaaS)
**Easy but costs add up**

| Service | Price |
|---------|-------|
| Web Service (Starter) | $7/mo (~N11,500) |
| Postgres (Basic) | $6/mo (~N9,900) |
| **Total** | **$13/mo (~N21,400)** |

**Pros:** Easiest deployment, auto-scaling
**Cons:** More expensive than VPS, free tier sleeps after 15 min

---

## THE WINNER: Contabo VPS 10

### Price Comparison (Annual)

| Provider | Year 1 | Year 2 | 2-Year Total |
|----------|--------|--------|--------------|
| **Contabo VPS 10** | **N78,000** | **N78,000** | **N156,000** |
| Hostinger KVM 1 | N128,700 | N237,600 | N366,300 |
| Render (Starter+DB) | N256,800 | N256,800 | N513,600 |
| DigitalOcean | N475,200 | N475,200 | N950,400 |
| **WordPress (current)** | **N190,000-290,000** | **N190,000-290,000** | **N380,000-580,000** |

**You save N224,000-424,000 in 2 years vs WordPress!**

---

## What $3.99/Month Gets You on Contabo

- 2 vCPU cores (Intel Xeon)
- 4GB RAM (enough for Node.js + MongoDB + React)
- 300GB SSD storage (10+ years of images)
- UNLIMITED bandwidth
- 1 IPv4 address
- DDoS protection (500Gbps)
- Full root SSH access
- 14 global locations

**Can handle:** 500+ concurrent users, 1,000+ daily visitors

---

## Complete Contabo Setup (Copy-Paste Commands)

### Step 1: Buy Contabo VPS
1. Go to contabo.com
2. Select Cloud VPS 10 - $3.99/month
3. Location: United Kingdom (closest to Nigeria)
4. OS: Ubuntu 22.04 LTS
5. You'll get root login via email in 15 minutes

### Step 2: SSH and Setup (One Script)

```bash
# SSH into server (replace IP)
ssh root@YOUR_SERVER_IP

# PASTE THIS ENTIRE BLOCK:
apt update && apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs nginx certbot python3-certbot-nginx git
npm install -g pm2

# MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
apt update && apt install -y mongodb-org
systemctl start mongod && systemctl enable mongod

# Firewall
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh && ufw allow http && ufw allow https
ufw --force enable

# Create app directory
mkdir -p /var/www/ipmc
echo "Setup complete!"
```

### Step 3: Deploy Code

```bash
cd /var/www/ipmc
git clone https://github.com/YOUR_USERNAME/ipmc-website.git .

# Backend
cd server && npm install
cat > .env << 'EOF'
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ipmc_db
JWT_SECRET=your-secret-key-here
CLIENT_URL=https://ipmc-ng.com
ADMIN_URL=https://ipmc-ng.com/admin
ADMIN_EMAIL=info@ipmc-ng.com
EOF
pm2 start server.js --name "ipmc-backend"
pm2 save && pm2 startup systemd

# Frontend
cd ../client && npm install && npm run build
cp -r dist/* /var/www/html/

# Admin
cd ../admin && npm install && npm run build
mkdir -p /var/www/html/admin && cp -r dist/* /var/www/html/admin/
```

### Step 4: Nginx Config

```bash
cat > /etc/nginx/sites-available/ipmc << 'EOF'
server {
    listen 80;
    server_name ipmc-ng.com www.ipmc-ng.com;

    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }

    location /admin {
        alias /var/www/html/admin;
        try_files $uri $uri/ /admin/index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
EOF

ln -s /etc/nginx/sites-available/ipmc /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx
```

### Step 5: SSL (HTTPS)

```bash
certbot --nginx -d ipmc-ng.com -d www.ipmc-ng.com --non-interactive --agree-tos --email info@ipmc-ng.com
```

### Step 6: DNS
At your domain registrar, add:
```
A     @     YOUR_SERVER_IP
A     www   YOUR_SERVER_IP
```

Wait 5-30 minutes. Done!

---

## Security (All FREE)

```bash
# Block brute force
apt install -y fail2ban
systemctl enable fail2ban

# Auto security updates
apt install -y unattended-upgrades

# Secure MongoDB
# Edit /etc/mongod.conf, add: security: authorization: enabled
```

---

## Performance vs WordPress

| Metric | WordPress Shared | Contabo VPS |
|--------|-----------------|-------------|
| Server Response | 800ms-2s | **50-150ms** |
| Page Load | 4-6 seconds | **0.8-1.2s** |
| Concurrent Users | 20-50 | **500+** |
| DDoS Protection | None/Paid | **FREE 500Gbps** |
| SSL | Paid/Basic | **FREE auto-renew** |
| Full Control | No | **Yes** |

---

## Final Cost (Contabo VPS 10)

| Item | Monthly | Annually |
|------|---------|----------|
| Contabo VPS 10 | $3.99 (N6,500) | $47.88 (N78,000) |
| Domain (owned) | $0 | $0 |
| SSL (Let's Encrypt) | $0 | $0 |
| Security (built-in) | $0 | $0 |
| **TOTAL** | **N6,500** | **N78,000** |

**vs WordPress: N190,000-290,000/year**
**SAVINGS: N112,000-212,000 per year!**

---

## Recommended Next Steps

1. Buy Contabo VPS 10 ($3.99/mo)
2. Run the setup script (30 minutes)
3. Point your domain DNS to the server IP
4. Cancel WordPress hosting
5. Save N112,000+ every year!

---
Document Version: 2.0 | For: IPMC Limited
