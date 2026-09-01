# IPMC Admin Dashboard - User Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [Managing Blog Posts](#managing-blog-posts)
4. [Managing Services](#managing-services)
5. [Managing Team Members](#managing-team-members)
6. [Handling Contact Messages](#handling-contact-messages)
7. [Settings](#settings)
8. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Login
1. Navigate to `https://admin.ipmc-ng.com` (or `http://localhost:5174` for local)
2. Enter your credentials:
   - **Email:** `admin@ipmc-ng.com`
   - **Password:** `admin123`
3. Click **Sign In**

### Navigation
The left sidebar contains all management sections:
- **Dashboard** - Overview and quick actions
- **Blog Posts** - Manage articles and insights
- **Services** - Update service offerings
- **Team** - Add/edit team members
- **Messages** - View and reply to contact submissions
- **Events** - Manage upcoming events
- **Settings** - Site configuration

---

## Dashboard Overview

The dashboard displays:
- **Stats Cards** - Total posts, services, team members, and unread messages
- **Recent Activity** - Latest actions across the system
- **Quick Actions** - Shortcut buttons to common tasks

---

## Managing Blog Posts

### Creating a New Post
1. Click **Blog Posts** in the sidebar
2. Click the **+ New Post** button (top right)
3. Fill in the form:
   - **Title** - The headline of your article
   - **Category** - Select from: Industry News, ESG, Insights, Financial
   - **Excerpt** - A short summary (max 300 characters)
   - **Content** - The full article body (supports HTML)
   - **Publish immediately** - Toggle to save as draft
4. Click **Create Post**

### Editing a Post
1. Find the post in the list
2. Click the **pencil icon** (Edit)
3. Make your changes
4. Click **Update Post**

### Deleting a Post
1. Find the post in the list
2. Click the **trash icon** (Delete)
3. Confirm the deletion

### Publishing vs Drafts
- **Published** posts appear on the website immediately
- **Draft** posts are saved but not visible to visitors
- Toggle the status in the edit form or the table

### SEO Tips for Blog Posts
- Use descriptive titles with keywords
- Write compelling excerpts (this appears in search results)
- Include relevant tags
- Update posts regularly for better rankings

---

## Managing Services

### Adding a Service
1. Click **Services** in the sidebar
2. Click **+ Add Service**
3. Fill in:
   - **Title** - Service name (e.g., "ESG Consulting")
   - **Slug** - URL-friendly version (e.g., "esg-consulting")
   - **Category** - Select the appropriate category
   - **Short Description** - Brief overview for the services page
4. Click **Create**

### Editing Services
- Click the **pencil icon** to edit
- Update any field as needed
- Click **Update**

### Activating/Deactivating
- Use the **toggle switch** in the Status column
- Green = Active (visible on website)
- Gray = Inactive (hidden from website)

### Reordering Services
- Drag the **grip icon** (⋮⋮) to reorder
- This changes the display order on the website

---

## Managing Team Members

### Adding a Team Member
1. Click **Team** in the sidebar
2. Click **+ Add Member**
3. Fill in:
   - **Name** - Full name
   - **Role** - Job title (e.g., "Senior Consultant")
   - **Department** - Leadership, Engineering, Consulting, etc.
   - **Email** - Contact email
   - **Bio** - Short biography
4. Click **Add**

### Uploading Photos
- Team member photos should be:
  - Square format (1:1 ratio)
  - Minimum 400x400 pixels
  - Professional headshots
  - JPG or PNG format
- Upload via the image field (integrates with Cloudinary)

### Social Links
- Add LinkedIn, Twitter, and email links
- These appear as icons on the team cards

---

## Handling Contact Messages

### Viewing Messages
1. Click **Messages** in the sidebar
2. The left panel shows all messages
3. Unread messages have a **blue dot**
4. Click any message to view details

### Replying to Messages
1. Open the message
2. Type your reply in the **Reply** box
3. Click **Send Reply**
4. The system sends an email to the sender automatically

### Filtering Messages
Use the top buttons to filter:
- **All** - Every message
- **Unread** - Messages not yet viewed
- **Replied** - Messages you've responded to

### Best Practices
- Reply within 24 hours for professionalism
- Mark important messages for follow-up
- Delete spam or irrelevant submissions

---

## Settings

### General Settings
- **Site Name** - Appears in browser tabs and SEO
- **Site Description** - Used for meta descriptions
- **Maintenance Mode** - Shows a "Coming Soon" page to visitors

### Contact Information
- **Contact Email** - Where form submissions go
- **Contact Phone** - Displayed on the website
- **Address** - Physical office locations

### Features
- **Enable Contact Form** - Turn the contact form on/off
- **Enable Newsletter** - Allow newsletter subscriptions

### Security
- Change your admin password regularly
- Use strong passwords (12+ characters, mixed case, numbers, symbols)
- Never share your login credentials

---

## Troubleshooting

### Can't Log In
- Check your email and password
- Clear browser cache and cookies
- Contact technical support if locked out

### Images Not Uploading
- Check file size (max 5MB)
- Ensure format is JPG, PNG, or WebP
- Verify Cloudinary credentials in .env

### Changes Not Appearing on Website
- Clear browser cache (Ctrl+Shift+R)
- Check if the item is set to "Published"
- Verify the backend server is running

### Slow Loading
- Optimize images before uploading
- Use WebP format when possible
- Check internet connection

---

## Quick Reference

| Action | Shortcut |
|--------|----------|
| Save form | Ctrl + Enter |
| Close modal | Escape key |
| Search | Ctrl + K |
| Navigate sidebar | Arrow keys |

## Support

For technical issues or feature requests:
- Email: tech@ipmc-ng.com
- Phone: +234 123 456 7890
- Hours: Mon-Fri, 9 AM - 5 PM WAT

---

**Document Version:** 1.0  
**Last Updated:** August 2024  
**For:** IPMC Limited Admin Dashboard
