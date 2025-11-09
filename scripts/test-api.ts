#!/usr/bin/env tsx

/**
 * Test API endpoints
 * Make sure the dev server is running: npm run dev
 */

const API_BASE = process.env.API_BASE || 'http://localhost:3000';

async function testAPI() {
  console.log('🔍 Testing API Endpoints...\n');
  console.log(`Base URL: ${API_BASE}\n`);

  const tests = [
    {
      name: 'Health Check',
      url: `${API_BASE}/api/health`,
      method: 'GET',
    },
    {
      name: 'Get Articles',
      url: `${API_BASE}/api/articles?limit=5&status=1`,
      method: 'GET',
    },
    {
      name: 'Get Topics',
      url: `${API_BASE}/api/topics`,
      method: 'GET',
    },
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}...`);
      const response = await fetch(test.url, {
        method: test.method,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        console.log(`✅ ${test.name} - Status: ${response.status}`);
        
        // Show some data
        if (test.name === 'Health Check') {
          console.log(`   Database: ${data.database}`);
          console.log(`   Tables: ${data.tables?.exists?.length || 0} exist`);
          console.log(`   Articles: ${data.articleCount || 0}`);
          console.log(`   Message: ${data.message}`);
        } else if (test.name === 'Get Articles') {
          console.log(`   Articles returned: ${data.articles?.length || 0}`);
          console.log(`   Total: ${data.total || 0}`);
          if (data.articles?.length > 0) {
            console.log(`   First article: ${data.articles[0].title}`);
          }
        } else if (test.name === 'Get Topics') {
          console.log(`   Topics returned: ${Array.isArray(data) ? data.length : 0}`);
          if (Array.isArray(data) && data.length > 0) {
            console.log(`   First topic: ${data[0].name}`);
          }
        }
        passed++;
      } else {
        console.error(`❌ ${test.name} - Status: ${response.status}`);
        console.error(`   Error: ${data.error || 'Unknown error'}`);
        if (data.message) {
          console.error(`   Message: ${data.message}`);
        }
        failed++;
      }
    } catch (error: any) {
      console.error(`❌ ${test.name} - Failed`);
      console.error(`   Error: ${error.message}`);
      if (error.message?.includes('ECONNREFUSED') || error.message?.includes('fetch failed')) {
        console.error('   💡 Make sure the dev server is running: npm run dev');
      }
      failed++;
    }
    console.log('');
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Results: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log('✨ All API tests passed!');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed. Check the errors above.');
    process.exit(1);
  }
}

testAPI();

