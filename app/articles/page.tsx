import Link from 'next/link'
import ArticleImage from '../components/ArticleImage'
import ArticleFilters from '../components/ArticleFilters'
import TrendingLatestSection from '../components/TrendingLatestSection'

import { getBaseUrl } from '../lib/utils'

export const dynamic = 'force-dynamic'

async function getArticles(
  page: number = 1, 
  limit: number = 10, 
  search: string = '', 
  healthTopic: string = ''
) {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      status: '1',
      sortBy: 'created_at',
      sortOrder: 'desc',
    })
    
    if (search) params.append('search', search)
    if (healthTopic) params.append('healthTopic', healthTopic)
    
    const baseUrl = getBaseUrl()
    const url = `${baseUrl}/api/articles?${params.toString()}`
    
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) return { success: false, data: [], pagination: {} }
    return await res.json()
  } catch (error) {
    console.error('Error fetching articles:', error)
    return { success: false, data: [], pagination: {} }
  }
}

async function getHealthTopics() {
  try {
    const baseUrl = getBaseUrl()
    const url = `${baseUrl}/api/health-topics?limit=100`
    
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) return { success: false, data: [] }
    return await res.json()
  } catch (error) {
    console.error('Error fetching health topics:', error)
    return { success: false, data: [] }
  }
}

// Removed getAllArticlesForTopics - we'll use healthTopics directly from API

async function getTrendingArticles() {
  try {
    const baseUrl = getBaseUrl()
    const url = `${baseUrl}/api/articles?status=1&limit=6&sortBy=article_ratings&sortOrder=desc`
    
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) return { success: false, data: [] }
    return await res.json()
  } catch (error) {
    console.error('Error fetching trending articles:', error)
    return { success: false, data: [] }
  }
}

async function getLatestArticles() {
  try {
    const baseUrl = getBaseUrl()
    const url = `${baseUrl}/api/articles?status=1&limit=6&sortBy=created_at&sortOrder=desc`
    
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) return { success: false, data: [] }
    return await res.json()
  } catch (error) {
    console.error('Error fetching latest articles:', error)
    return { success: false, data: [] }
  }
}

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string; healthTopic?: string }
}) {
  const currentPage = parseInt(searchParams.page || '1')
  const search = searchParams.search || ''
  const healthTopic = searchParams.healthTopic || ''
  const limit = 12
  
  const [articlesData, healthTopicsData, trendingData, latestData] = await Promise.all([
    getArticles(currentPage, limit, search, healthTopic),
    getHealthTopics(),
    getTrendingArticles(),
    getLatestArticles()
  ])
  
  const articles = articlesData.data || []
  const pagination = articlesData.pagination || {}
  const healthTopics = healthTopicsData.data || []
  const trendingArticles = trendingData.data || []
  const latestArticles = latestData.data || []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 relative pb-4">
          All Articles
          <span className="absolute bottom-0 left-0 w-16 h-1 bg-gradient-to-r from-primary-500 to-primary-400 rounded"></span>
        </h1>
        <p className="text-lg text-gray-600">Discover our latest health and wellness articles</p>
      </div>

      {/* Search and Filter Component */}
      <ArticleFilters healthTopics={healthTopics} />

      {/* Main Content with Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
        {/* Main Articles Section - Left (3/4 width) */}
        <div className="lg:col-span-3">
          {articles.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {articles.map((article: any, index: number) => (
              <Link 
                key={article.id} 
                href={`/articles/${article.slug || article.id}`}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <article className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <ArticleImage
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full"
                      fallbackClassName="h-48"
                    />
                  </div>
                  <div className="p-6">
                    {article.health_topics && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {article.health_topics.split(',').slice(0, 2).map((topic: string, idx: number) => (
                          <span key={idx} className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full">
                            {topic.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {article.title}
                    </h3>
                    {article.short_description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                        {article.short_description}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{new Date(article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span className="text-primary-600 font-semibold group-hover:translate-x-1 transition-transform inline-block">
                        Read More →
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 flex-wrap">
              <Link 
                href={`/articles?${new URLSearchParams({
                  ...(search && { search }),
                  ...(healthTopic && { healthTopic }),
                  page: String(currentPage - 1)
                }).toString()}`}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
                    : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600 shadow-md hover:shadow-lg'
                }`}
              >
                Previous
              </Link>
              {Array.from({ length: Math.min(pagination.totalPages || 1, 10) }, (_, i) => {
                const pageNum = i + 1
                return (
                  <Link 
                    key={pageNum} 
                    href={`/articles?${new URLSearchParams({
                      ...(search && { search }),
                      ...(healthTopic && { healthTopic }),
                      page: String(pageNum)
                    }).toString()}`}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      currentPage === pageNum
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600 shadow-md hover:shadow-lg'
                    }`}
                  >
                    {pageNum}
                  </Link>
                )
              })}
              <Link 
                href={`/articles?${new URLSearchParams({
                  ...(search && { search }),
                  ...(healthTopic && { healthTopic }),
                  page: String(currentPage + 1)
                }).toString()}`}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentPage >= (pagination.totalPages || 1)
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
                    : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600 shadow-md hover:shadow-lg'
                }`}
              >
                Next
              </Link>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {search || healthTopic 
              ? `No articles found matching your filters. Try adjusting your search or filters.`
              : 'No articles found. Please check your API connection.'}
          </p>
          {(search || healthTopic) && (
            <Link 
              href="/articles"
              className="mt-4 inline-block px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              View All Articles
            </Link>
          )}
        </div>
      )}
        </div>

        {/* Trending Articles Sidebar - Right (1/4 width) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <TrendingLatestSection 
              trendingArticles={trendingArticles}
              latestArticles={latestArticles}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

