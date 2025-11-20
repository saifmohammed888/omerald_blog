import Link from 'next/link'
import ArticleImage from './components/ArticleImage'
import ArticleCarousel from './components/ArticleCarousel'
import FeaturedCarousel from './components/FeaturedCarousel'

import { getBaseUrl } from './lib/utils'

export const dynamic = 'force-dynamic'

async function getArticles() {
  try {
    const baseUrl = getBaseUrl()
    const url = `${baseUrl}/api/articles?page=1&limit=20&status=1&sortBy=created_at&sortOrder=desc`
    
    const res = await fetch(url, {
      cache: 'no-store'
    })
    if (!res.ok) {
      console.error('Failed to fetch articles:', res.status, res.statusText)
      return { success: false, data: [] }
    }
    return await res.json()
  } catch (error) {
    console.error('Error fetching articles:', error)
    return { success: false, data: [] }
  }
}

async function getHealthTopics() {
  try {
    const baseUrl = getBaseUrl()
    const url = `${baseUrl}/api/health-topics?limit=100`
    
    const res = await fetch(url, {
      cache: 'no-store'
    })
    if (!res.ok) {
      console.error('Failed to fetch health topics:', res.status, res.statusText)
      return { success: false, data: [] }
    }
    return await res.json()
  } catch (error) {
    console.error('Error fetching health topics:', error)
    return { success: false, data: [] }
  }
}

// Helper function to get health topic name from ID
function getHealthTopicName(healthTopics: any[], topicId: string): string {
  if (!topicId) return 'Health & Wellness'
  const id = parseInt(topicId.trim(), 10)
  if (isNaN(id)) return topicId
  const topic = healthTopics.find((t: any) => t.id === id)
  return topic?.title || 'Health & Wellness'
}

export default async function Home() {
  const articlesData = await getArticles()
  const healthTopicsData = await getHealthTopics()
  const articles = articlesData.data || []
  const healthTopics = healthTopicsData.data || []

  // Pre-process articles to resolve health topic names
  const processedArticles = articles.map((article: any) => {
    let healthTopicName = 'Health & Wellness'
    if (article.health_topics) {
      const topicId = article.health_topics.split(',')[0]?.trim()
      if (topicId) {
        healthTopicName = getHealthTopicName(healthTopics, topicId)
      }
    }
    return {
      ...article,
      healthTopicName
    }
  })

  // Use recent articles for carousels (already sorted by created_at desc)
  const recentCarouselArticles = processedArticles.slice(0, 5) // Most recent 5 for main carousel
  const otherRecentArticles = processedArticles.slice(5, 10) // Next 5 for sidebar
  const recentArticles = processedArticles.slice(10, 19) // Next 9 articles for recent posts grid

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        {/* Recent Articles Carousel Section with Sidebar */}
        {recentCarouselArticles.length > 0 && (
          <section className="mb-20 animate-fade-in">
            <div className="mb-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Latest Articles</h2>
              <p className="text-gray-600">Discover our most recent health and wellness insights</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
              {/* Main Recent Articles Carousel - Left (2/3 width) */}
              <div className="lg:col-span-2">
                <FeaturedCarousel 
                  articles={recentCarouselArticles}
                />
              </div>

              {/* Other Recent Articles - Right (1/3 width) */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-5 sticky top-24 h-[350px] lg:h-[455px] xl:h-[525px] flex flex-col">
                  <ArticleCarousel 
                    articles={otherRecentArticles.slice(0, 5)} 
                    title="More recent articles"
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Recent Posts Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Recent Posts</h2>
            <Link 
              href="/articles"
              className="text-gray-700 hover:text-gray-900 font-semibold text-sm border-2 border-gray-300 px-5 py-2.5 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
            >
              All Posts
            </Link>
          </div>

          {recentArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {recentArticles.map((article: any, index: number) => (
                <Link 
                  key={article.id} 
                  href={`/articles/${article.slug || article.id}`}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <article className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group h-full flex flex-col transform hover:-translate-y-1">
                    {/* Image */}
                    <div className="relative h-64 overflow-hidden bg-gray-100">
                      <ArticleImage
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full"
                        fallbackClassName="h-64"
                      />
                      {/* Category Badge Overlay */}
                      {article.healthTopicName && (
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1.5 bg-black/70 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wide rounded-full">
                            {article.healthTopicName}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed flex-1">
                        {article.short_description || article.description?.substring(0, 150) || 'Read more about this health topic...'}
                      </p>
                      
                      {/* Author & Read Time */}
                      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                        {article.writer_name && (
                          <>
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                              {article.writer_profile_photo ? (
                                <img 
                                  src={`https://blog.omerald.com/public/uploads/users/${article.writer_profile_photo}`}
                                  alt={article.writer_name} 
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                <span className="text-white font-bold text-sm">
                                  {article.writer_name[0].toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900">{article.writer_name}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {Math.ceil((article.description?.length || 500) / 200)} min read
                              </p>
                            </div>
                          </>
                        )}
                        {!article.writer_name && (
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500">
                              {new Date(article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {Math.ceil((article.description?.length || 500) / 200)} min read
                            </p>
                          </div>
                        )}
                        {/* Arrow Icon */}
                        <svg 
                          className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-600 font-medium mb-1">More articles coming soon...</p>
              <p className="text-sm text-gray-500">Check back later for new content</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
