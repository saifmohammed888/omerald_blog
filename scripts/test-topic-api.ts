/**
 * Test script for topic parameter in articles API
 */

async function testTopicAPI() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
  const testTopic = 'sleep'
  
  console.log(`\n🧪 Testing Articles API with topic parameter: ${testTopic}\n`)
  console.log(`📍 Testing URL: ${baseUrl}/api/articles?topic=${testTopic}&status=1&limit=5\n`)

  try {
    const url = `${baseUrl}/api/articles?topic=${testTopic}&status=1&limit=5`
    const response = await fetch(url)
    
    if (!response.ok) {
      console.error(`❌ API request failed with status: ${response.status}`)
      const text = await response.text()
      console.error(`Response: ${text}`)
      return
    }

    const data = await response.json()
    
    if (data.success) {
      console.log(`✅ API request successful!`)
      console.log(`📊 Found ${data.data.length} articles`)
      console.log(`📄 Total articles: ${data.pagination?.total || 'N/A'}`)
      console.log(`\n📝 Sample articles:`)
      
      data.data.slice(0, 3).forEach((article: any, index: number) => {
        console.log(`\n  ${index + 1}. ${article.title}`)
        console.log(`     ID: ${article.id}`)
        console.log(`     Health Topics: ${article.health_topics}`)
        console.log(`     Created: ${new Date(article.created_at).toLocaleDateString()}`)
      })
      
      console.log(`\n✅ Test completed successfully!\n`)
    } else {
      console.error(`❌ API returned success: false`)
      console.error(`Error: ${data.error || 'Unknown error'}`)
    }
  } catch (error: any) {
    console.error(`❌ Test failed with error:`)
    console.error(error.message)
    if (error.message.includes('fetch')) {
      console.error(`\n💡 Make sure the server is running:`)
      console.error(`   npm run dev`)
    }
  }
}

// Run the test
testTopicAPI()

