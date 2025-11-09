# Vercel Deployment Guide

## Issue: No Content Showing on Production

The app is deployed but showing no content because the **database is not configured** in Vercel.

## Solution: Add Environment Variables to Vercel

### Step 1: Access Vercel Dashboard
1. Go to: https://vercel.com/dashboard
2. Select your `omerald-blog` project
3. Click on **Settings** → **Environment Variables**

### Step 2: Add Database Environment Variables

Add the following environment variables (use your actual database credentials):

```
MYSQL_HOST=your_production_database_host
MYSQL_PORT=3306
MYSQL_USER=your_database_username  
MYSQL_PASSWORD=your_database_password
MYSQL_DATABASE=medinlife
```

### Step 3: Choose a Cloud Database

Your database must be **accessible from the internet**. If you're using localhost, you need to use a cloud database:

#### Option 1: PlanetScale (Recommended - MySQL)
- Free tier available
- MySQL compatible
- Easy setup: https://planetscale.com/
- Get connection string and add to Vercel

#### Option 2: Railway
- Free tier available
- MySQL/PostgreSQL support
- URL: https://railway.app/

#### Option 3: AWS RDS / DigitalOcean / Other
- More control but requires setup
- Paid options

### Step 4: Redeploy

After adding environment variables:
1. Go to **Deployments** tab in Vercel
2. Click on the latest deployment
3. Click **Redeploy** button

Or simply push new code to trigger automatic deployment:

```bash
git add .
git commit -m "Update for Vercel deployment"
git push origin main
```

## Verifying the Fix

After redeployment with database configured:
1. Visit your site: https://omerald-blog.vercel.app/
2. Check if articles and health topics appear
3. Open browser console to check for any errors

## Current Status

✅ Code is deployed to Vercel  
✅ API routes are configured correctly  
❌ Database credentials not configured (causing "no content" issue)  

Once database is configured, all content will load properly.

