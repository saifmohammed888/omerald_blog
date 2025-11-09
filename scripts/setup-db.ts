#!/usr/bin/env tsx

/**
 * Setup database - create tables if they don't exist
 */

// Load environment variables
import { config } from 'dotenv';
import { resolve } from 'path';
import { readFileSync } from 'fs';

config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

import { getPool, query } from '../lib/db/mysql';

async function setupDatabase() {
  console.log('🔧 Setting up database...\n');

  try {
    const pool = getPool();
    
    // Read schema file
    const schemaPath = resolve(process.cwd(), 'lib/db/schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');
    
    // Remove comments and split by semicolons
    const cleanedSchema = schema
      .split('\n')
      .filter(line => !line.trim().startsWith('--') && line.trim().length > 0)
      .join('\n');
    
    // Split by semicolons, but keep CREATE TABLE statements together
    const statements = cleanedSchema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && s.toUpperCase().includes('CREATE'));

    console.log(`Found ${statements.length} CREATE TABLE statements to execute\n`);

    for (let i = 0; i < statements.length; i++) {
      let statement = statements[i];
      if (!statement.endsWith(';')) {
        statement += ';';
      }
      
      // Extract table name
      const tableMatch = statement.match(/CREATE TABLE.*?IF NOT EXISTS.*?`?(\w+)`?/i) ||
                        statement.match(/CREATE TABLE.*?`?(\w+)`?/i);
      const tableName = tableMatch ? tableMatch[1] : `table_${i + 1}`;
      
      try {
        await query(statement);
        console.log(`✅ Created/verified table: ${tableName}`);
      } catch (error: any) {
        // Ignore "table already exists" errors
        if (error.code === 'ER_TABLE_EXISTS_ERROR' || 
            error.message?.includes('already exists') ||
            error.code === 'ER_DUP_ENTRY') {
          console.log(`ℹ️  Table already exists: ${tableName}`);
        } else {
          console.error(`❌ Error creating table ${tableName}:`, error.message);
          if (process.env.NODE_ENV === 'development') {
            console.error(`   SQL: ${statement.substring(0, 200)}...`);
          }
        }
      }
    }

    console.log('\n✨ Database setup complete!');
    
    // Verify tables
    console.log('\n🔍 Verifying tables...');
    const tables = await query<{ TABLE_NAME: string }>(
      `SELECT TABLE_NAME 
       FROM information_schema.TABLES 
       WHERE TABLE_SCHEMA = DATABASE() 
       AND TABLE_NAME IN ('articles', 'health_topics', 'article_health_topics')`
    );
    
    console.log(`✅ Found ${tables.length} tables:`);
    tables.forEach(t => console.log(`   - ${t.TABLE_NAME}`));
    
    await pool.end();
    process.exit(0);

  } catch (error: any) {
    console.error('\n❌ Database setup failed:');
    console.error('   Error:', error.message);
    process.exit(1);
  }
}

setupDatabase();

