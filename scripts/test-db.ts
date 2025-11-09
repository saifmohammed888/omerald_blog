#!/usr/bin/env tsx

/**
 * Test database connection and API endpoints
 */

// Load environment variables from .env.local
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

import { getPool, query } from '../lib/db/mysql';
import { readFileSync } from 'fs';
import { join } from 'path';

async function testDatabase() {
  console.log('🔍 Testing Database Connection...\n');

  try {
    // Test 1: Check environment variables
    console.log('1️⃣ Checking environment variables...');
    const hasDatabaseUrl = !!process.env.DATABASE_URL;
    const hasIndividualVars = !!(
      process.env.MYSQL_HOST &&
      process.env.MYSQL_USER &&
      process.env.MYSQL_PASSWORD &&
      process.env.MYSQL_DATABASE
    );

    if (!hasDatabaseUrl && !hasIndividualVars) {
      console.error('❌ No database configuration found!');
      console.error('   Please create .env.local with either:');
      console.error('   - DATABASE_URL=mysql://user:pass@host:port/db');
      console.error('   - OR MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE');
      process.exit(1);
    }
    console.log('✅ Environment variables configured\n');

    // Test 2: Test connection
    console.log('2️⃣ Testing database connection...');
    const pool = getPool();
    await query('SELECT 1 as test');
    console.log('✅ Database connection successful\n');

    // Test 3: Check if tables exist
    console.log('3️⃣ Checking if tables exist...');
    const tables = await query<{ TABLE_NAME: string }>(
      `SELECT TABLE_NAME 
       FROM information_schema.TABLES 
       WHERE TABLE_SCHEMA = DATABASE() 
       AND TABLE_NAME IN ('articles', 'health_topics', 'article_health_topics')`
    );

    const tableNames = tables.map(t => t.TABLE_NAME);
    const requiredTables = ['articles', 'health_topics', 'article_health_topics'];
    const missingTables = requiredTables.filter(t => !tableNames.includes(t));

    if (missingTables.length > 0) {
      console.error(`❌ Missing tables: ${missingTables.join(', ')}`);
      console.error('   Please run the schema from lib/db/schema.sql');
      process.exit(1);
    }
    console.log('✅ All required tables exist\n');

    // Test 4: Check data
    console.log('4️⃣ Checking data...');
    const articleCount = await query<{ count: number }>('SELECT COUNT(*) as count FROM articles');
    const topicCount = await query<{ count: number }>('SELECT COUNT(*) as count FROM health_topics');
    
    const articles = articleCount[0]?.count || 0;
    const topics = topicCount[0]?.count || 0;

    console.log(`   Articles: ${articles}`);
    console.log(`   Health Topics: ${topics}`);

    if (articles === 0) {
      console.warn('⚠️  No articles found. Run: npm run seed');
    } else {
      console.log('✅ Articles found');
    }

    if (topics === 0) {
      console.warn('⚠️  No health topics found. Run: npm run seed');
    } else {
      console.log('✅ Health topics found');
    }

    // Test 5: Test a sample query
    if (articles > 0) {
      console.log('\n5️⃣ Testing article query...');
      const sampleArticles = await query(
        `SELECT a.id, a.title, a.status 
         FROM articles a 
         WHERE a.status = 1 
         LIMIT 5`
      );
      console.log(`✅ Found ${sampleArticles.length} approved articles`);
      if (sampleArticles.length > 0) {
        console.log('   Sample articles:');
        sampleArticles.forEach((article: any) => {
          console.log(`   - [${article.id}] ${article.title}`);
        });
      }
    }

    // Test 6: Test topics query
    if (topics > 0) {
      console.log('\n6️⃣ Testing topics query...');
      const sampleTopics = await query(
        `SELECT id, name, slug FROM health_topics LIMIT 5`
      );
      console.log(`✅ Found ${sampleTopics.length} health topics`);
      if (sampleTopics.length > 0) {
        console.log('   Sample topics:');
        sampleTopics.forEach((topic: any) => {
          console.log(`   - [${topic.id}] ${topic.name} (${topic.slug})`);
        });
      }
    }

    console.log('\n✨ All database tests passed!');
    await pool.end();
    process.exit(0);

  } catch (error: any) {
    console.error('\n❌ Database test failed:');
    console.error('   Error:', error.message);
    
    if (error.message?.includes('Database configuration missing')) {
      console.error('\n   💡 Create .env.local with database credentials');
    } else if (error.message?.includes('ECONNREFUSED')) {
      console.error('\n   💡 MySQL server is not running');
    } else if (error.message?.includes('Access denied')) {
      console.error('\n   💡 Check your username and password');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('\n   💡 Database does not exist. Create it first.');
    } else if (error.code === 'ER_NO_SUCH_TABLE') {
      console.error('\n   💡 Tables do not exist. Run the schema from lib/db/schema.sql');
    }
    
    process.exit(1);
  }
}

testDatabase();

