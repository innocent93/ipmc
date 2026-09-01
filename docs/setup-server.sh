#!/bin/bash
# IPMC Website - Contabo VPS Setup Script
# Run this as root on a fresh Ubuntu 22.04 server

set -e

echo "=========================================="
echo "  IPMC Website Setup - Contabo VPS"
echo "=========================================="

# Update system
echo "[1/8] Updating system..."
apt update && apt upgrade -y

# Install Node.js
echo "[2/8] Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install Nginx, Certbot, Git
echo "[3/8] Installing Nginx, Certbot, Git..."
apt install -y nginx certbot python3-certbot-nginx git

# Install PM2
echo "[4/8] Installing PM2..."
npm install -g pm2

# Install MongoDB
echo "[5/8] Installing MongoDB..."
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
apt update
apt install -y mongodb-org
systemctl start mongod
systemctl enable mongod

# Configure Firewall
echo "[6/8] Configuring firewall..."
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow http
ufw allow https
ufw --force enable

# Create app directory
echo "[7/8] Creating app directory..."
mkdir -p /var/www/ipmc
mkdir -p /var/www/html

# Install fail2ban
echo "[8/8] Installing fail2ban..."
apt install -y fail2ban
systemctl enable fail2ban

echo ""
echo "=========================================="
echo "  Base setup complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Clone your repo: cd /var/www/ipmc && git clone YOUR_REPO ."
echo "2. Setup backend: cd server && npm install && pm2 start server.js"
echo "3. Build frontend: cd client && npm install && npm run build && cp -r dist/* /var/www/html/"
echo "4. Build admin: cd admin && npm install && npm run build && cp -r dist/* /var/www/html/admin/"
echo "5. Setup Nginx: Copy the nginx config from docs/"
echo "6. Get SSL: certbot --nginx -d ipmc-ng.com"
echo ""
