import Link from 'next/link'
import HealthTopicsSearch from './components/HealthTopicsSearch'

export const dynamic = 'force-dynamic'

async function getHealthTopics() {
  try {
    // Use relative URL in production
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
    const url = process.env.VERCEL_URL ? '/api/health-topics?limit=100' : `${baseUrl}/api/health-topics?limit=100`
    
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) return { success: false, data: [] }
    return await res.json()
  } catch (error) {
    console.error('Error fetching health topics:', error)
    return { success: false, data: [] }
  }
}

export default async function HealthTopicsPage() {
  const healthTopicsData = await getHealthTopics()
  const healthTopics = healthTopicsData.data || []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 relative pb-4">
          Health Topics
          <span className="absolute bottom-0 left-0 w-16 h-1 bg-gradient-to-r from-blue-500 to-blue-400 rounded"></span>
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Explore our curated health topics and discover related articles
        </p>
        
        {/* Search Component */}
        <HealthTopicsSearch initialTopics={healthTopics} />
      </div>
    </div>
  )
}

