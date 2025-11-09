# Quick Setup Guide

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Database

### Option A: Using Connection String (Recommended)

Create a `.env.local` file in the root directory:

```env
DATABASE_URL=mysql://username:password@localhost:3306/database_name
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Option B: Using Individual Variables

```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=omerald_blog
MYSQL_USER=root
MYSQL_PASSWORD=your_password
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Step 3: Create Database

Connect to MySQL and create the database:

```sql
CREATE DATABASE omerald_blog;
```

## Step 4: Run Database Schema

Execute the SQL from `lib/db/schema.sql` in your MySQL client:

```bash
mysql -u root -p omerald_blog < lib/db/schema.sql
```

Or manually copy and paste the SQL from `lib/db/schema.sql` into your MySQL client.

## Step 5: Seed the Database

This will populate the database with sample articles and health topics:

```bash
npm run seed
```

## Step 6: Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your blog!

## Troubleshooting

### "No articles found" Error

1. **Check Database Connection:**
   - Verify your `.env.local` file has correct database credentials
   - Make sure MySQL is running
   - Test connection: `mysql -u your_user -p your_database`

2. **Check if Database is Seeded:**
   - Run `npm run seed` to populate the database
   - Verify data exists: `SELECT COUNT(*) FROM articles;` in MySQL

3. **Check API Routes:**
   - Visit `http://localhost:3000/api/articles` directly in your browser
   - You should see JSON data or an error message

4. **Check Browser Console:**
   - Open browser DevTools (F12)
   - Check the Console tab for any errors
   - Check the Network tab to see if API calls are failing

### Database Connection Errors

- Make sure MySQL server is running
- Verify credentials in `.env.local`
- Check if the database exists
- Ensure the user has proper permissions

### Common Issues

1. **"Database configuration missing"**
   - Check your `.env.local` file exists
   - Restart the dev server after creating `.env.local`

2. **"ECONNREFUSED"**
   - MySQL server is not running
   - Wrong host/port in configuration

3. **"Access denied"**
   - Wrong username/password
   - User doesn't have access to the database

## Testing the Setup

1. **Test Database Connection:**
   Visit `http://localhost:3000/api/articles` - should return JSON (even if empty)

2. **Test with Data:**
   After seeding, visit `http://localhost:3000` - should show articles

3. **Check Topics:**
   Visit `http://localhost:3000/api/topics` - should return health topics

