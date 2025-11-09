import Link from 'next/link'
import { notFound } from 'next/navigation'
import ArticleImage from '../../components/ArticleImage'

import { getBaseUrl } from '../../lib/utils'

export const dynamic = 'force-dynamic'

async function getHealthTopic(slug: string) {
  try {
    const baseUrl = getBaseUrl()
    const url = `${baseUrl}/api/health-topics/${slug}`
    
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) return null
    const data = await res.json()
    return data.success ? data.data : null
  } catch (error) {
    console.error('Error fetching health topic:', error)
    return null
  }
}

async function getRelatedArticles(topicSlug: string, limit: number = 6) {
  try {
    const baseUrl = getBaseUrl()
    const url = `${baseUrl}/api/articles?page=1&limit=${limit}&status=1&sortBy=created_at&sortOrder=desc&topic=${topicSlug}`
    
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) return []
    const data = await res.json()
    const articles = data.data || []
    
    return articles
  } catch (error) {
    console.error('Error fetching related articles:', error)
    return []
  }
}

async function getTopicArticles(topicSlug: string, page: number = 1, limit: number = 20) {
  try {
    const baseUrl = getBaseUrl()
    const url = `${baseUrl}/api/articles?page=${page}&limit=${limit}&status=1&sortBy=created_at&sortOrder=desc&topic=${topicSlug}`
    
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) return { articles: [], pagination: null }
    const data = await res.json()
    const articles = data.data || []
    const pagination = data.pagination || null
    
    return { articles, pagination }
  } catch (error) {
    console.error('Error fetching topic articles:', error)
    return { articles: [], pagination: null }
  }
}

export default async function HealthTopicPage({
  params,
}: {
  params: { slug: string }
}) {
  const topic = await getHealthTopic(params.slug)

  if (!topic) {
    notFound()
  }

  const relatedArticles = await getRelatedArticles(topic.slug || params.slug, 6)
  const { articles: topicArticles, pagination } = await getTopicArticles(topic.slug || params.slug, 1, 20)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <Link 
        href="/health-topics" 
        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-8 transition-colors group"
      >
        <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Health Topics
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <article className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 animate-fade-in">
            <div className="p-8 md:p-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">HEALTH TOPICS</span>
                {topic.is_major_health_event && (
                  <span className="px-4 py-2 bg-red-100 text-red-700 text-sm font-semibold rounded-full">
                    Major Health Event
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {topic.title}
              </h1>

              <div className="flex items-center gap-4 mb-8 text-sm text-gray-600">
                <span>Published: {new Date(topic.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                {topic.article_count !== undefined && (
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-semibold">
                    {topic.article_count} {topic.article_count === 1 ? 'Article' : 'Articles'}
                  </span>
                )}
              </div>

              <div 
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700"
                dangerouslySetInnerHTML={{ __html: topic.body || '' }}
              />
            </div>
          </article>
        </div>

        {/* Sidebar - Related Articles */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-24 animate-fade-in">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Related Articles</h2>
              {relatedArticles.length > 0 && (
                <p className="text-sm text-gray-500">{relatedArticles.length} {relatedArticles.length === 1 ? 'article' : 'articles'} found</p>
              )}
            </div>
            
            {relatedArticles.length > 0 ? (
              <div className="p-6 space-y-4">
                {relatedArticles.map((article: any, index: number) => (
                  <Link 
                    key={article.id} 
                    href={`/articles/${article.slug || article.id}`}
                    className="block group animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex gap-4 p-4 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 bg-white group-hover:bg-blue-50/30 transform hover:-translate-y-1">
                      {/* Article Image */}
                      <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                        <ArticleImage
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full"
                          fallbackClassName="w-20 h-20"
                        />
                      </div>
                      
                      {/* Article Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1.5 line-clamp-2 text-sm leading-snug group-hover:text-blue-600 transition-colors">
                          {article.title}
                        </h3>
                        {article.short_description && (
                          <p className="text-xs text-gray-600 line-clamp-2 mb-2 leading-relaxed">
                            {article.short_description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{new Date(article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      </div>
                      
                      {/* Arrow Icon */}
                      <div className="flex-shrink-0 flex items-center">
                        <svg 
                          className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
                
                {/* View All Link */}
                {relatedArticles.length >= 6 && (
                  <Link
                    href={`/articles?health_topic=${topic.id}`}
                    className="block mt-6 text-center py-3 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg transition-colors duration-200"
                  >
                    View All Articles →
                  </Link>
                )}
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <p className="text-gray-600 font-medium mb-1">No related articles yet</p>
                <p className="text-sm text-gray-500">Check back soon for articles about this topic</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Articles Section */}
      {topicArticles.length > 0 && (
        <section className="mt-16 animate-fade-in">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Articles about {topic.title}
              </h2>
              {pagination && (
                <p className="text-gray-600">
                  Showing {topicArticles.length} of {pagination.total} articles
                </p>
              )}
            </div>
            <Link
              href={`/articles?topic=${topic.slug || params.slug}`}
              className="text-gray-700 hover:text-gray-900 font-semibold text-sm border-2 border-gray-300 px-5 py-2.5 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {topicArticles.map((article: any, index: number) => (
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
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed flex-1">
                      {article.short_description || article.description?.substring(0, 150) || 'Read more about this health topic...'}
                    </p>
                    
                    {/* Date & Read Time */}
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                        <span className="text-white font-bold text-sm">O</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">Omerald</p>
                        <p className="text-xs text-gray-500">
                          {new Date(article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {Math.ceil((article.description?.length || 500) / 200)} min read
                        </p>
                      </div>
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
        </section>
      )}
    </div>
  )
}

