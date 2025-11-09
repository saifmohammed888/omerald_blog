# 🚨 QUICK FIX FOR 500 ERRORS

## The Problem
You're getting 500 errors because the database is not configured.

## The Solution (3 Steps)

### Step 1: Create `.env.local` file

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your actual database credentials:

```env
DATABASE_URL=mysql://root:your_password@localhost:3306/omerald_blog
# OR use individual variables:
# MYSQL_HOST=localhost
# MYSQL_PORT=3306
# MYSQL_DATABASE=omerald_blog
# MYSQL_USER=root
# MYSQL_PASSWORD=your_password

NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Step 2: Create Database and Run Schema

```sql
CREATE DATABASE omerald_blog;
```

Then run the SQL from `lib/db/schema.sql` in your MySQL client, or:

```bash
mysql -u root -p omerald_blog < lib/db/schema.sql
```

### Step 3: Seed the Database

```bash
npm run seed
```

### Step 4: Restart Dev Server

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

## Verify It's Working

1. Visit: `http://localhost:3000/api/health` - Should show database status
2. Visit: `http://localhost:3000/api/articles` - Should return JSON (even if empty)
3. Visit: `http://localhost:3000` - Should show articles

## Still Getting Errors?

Check the browser console and terminal for specific error messages. The new error handling will tell you exactly what's wrong:
- "Database configuration missing" → Create `.env.local`
- "Table doesn't exist" → Run the schema
- "ECONNREFUSED" → MySQL is not running
- "Access denied" → Wrong username/password

