#!/usr/bin/env tsx

// Load environment variables
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

import { query } from '../lib/db/mysql';

async function checkData() {
  try {
    console.log('📊 Checking database data...\n');
    
    // Check articles
    const articles = await query('SELECT id, title, status FROM articles LIMIT 10');
    console.log(`Articles: ${articles.length} found`);
    if (articles.length > 0) {
      articles.forEach((a: any) => {
        console.log(`  - [${a.id}] ${a.title} (status: ${a.status})`);
      });
    }
    
    // Check health topics
    try {
      const topics = await query('SELECT * FROM health_topics LIMIT 10');
      console.log(`\nHealth Topics: ${topics.length} found`);
      if (topics.length > 0) {
        topics.forEach((t: any) => {
          const name = t.name || t.topic_name || JSON.stringify(t);
          console.log(`  - [${t.id}] ${name}`);
        });
      }
    } catch (e: any) {
      console.log(`\n⚠️  Could not query health_topics: ${e.message}`);
    }
    
    // Check article_health_topics
    try {
      const relations = await query('SELECT COUNT(*) as count FROM article_health_topics');
      console.log(`\nArticle-Topic Relations: ${relations[0]?.count || 0} found`);
    } catch (e: any) {
      console.log(`\n⚠️  article_health_topics table doesn't exist`);
    }
    
    process.exit(0);
  } catch (error: any) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkData();

