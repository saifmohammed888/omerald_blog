import Link from 'next/link'
import { notFound } from 'next/navigation'
import ArticleImage from '../../components/ArticleImage'

import { getBaseUrl, getHealthTopicName } from '../../lib/utils'

export const dynamic = 'force-dynamic'

async function getArticle(slug: string) {
  try {
    const baseUrl = getBaseUrl()
    const url = `${baseUrl}/api/articles/${slug}`
    
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) return null
    const data = await res.json()
    return data.success ? data.data : null
  } catch (error) {
    console.error('Error fetching article:', error)
    return null
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

async function getRelatedArticles(currentArticleId: number, healthTopics: string) {
  try {
    if (!healthTopics) return []
    
    // Extract health topic IDs from current article
    const currentTopicIds = healthTopics.split(',').map((t: string) => {
      const trimmed = t.trim()
      const parsed = parseInt(trimmed, 10)
      return isNaN(parsed) ? null : parsed
    }).filter((id: number | null) => id !== null) as number[]
    
    if (currentTopicIds.length === 0) return []
    
    const baseUrl = getBaseUrl()
    const firstTopicId = currentTopicIds[0]
    const url = `${baseUrl}/api/articles?page=1&limit=10&status=1&sortBy=created_at&sortOrder=desc&healthTopic=${firstTopicId}`
    
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) return []
    const data = await res.json()
    const articles = data.data || []
    
    // Filter out current article and limit to 6
    const related = articles
      .filter((article: any) => article.id !== currentArticleId)
      .slice(0, 6)
    
    return related
  } catch (error) {
    console.error('Error fetching related articles:', error)
    return []
  }
}

export default async function ArticlePage({
  params,
}: {
  params: { slug: string }
}) {
  const article = await getArticle(params.slug)

  if (!article) {
    notFound()
  }

  const [relatedArticles, healthTopicsData] = await Promise.all([
    getRelatedArticles(article.id, article.health_topics || ''),
    getHealthTopics()
  ])
  
  const healthTopics = healthTopicsData.data || []

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12 animate-fade-in">
      <Link 
        href="/articles" 
        className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium mb-4 sm:mb-6 md:mb-8 transition-colors group text-sm sm:text-base"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Articles
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {/* Main Article Content */}
        <div className="lg:col-span-2">
          <article className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden animate-fade-in">
            <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 overflow-hidden">
              <ArticleImage
                src={article.image}
                alt={article.title}
                className="w-full h-full"
                fallbackClassName="h-48 sm:h-64 md:h-80 lg:h-96"
                priority={true}
              />
            </div>

            <div className="p-4 sm:p-6 md:p-8 lg:p-12">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-5 md:mb-6 leading-tight">
                {article.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-5 md:mb-6 text-xs sm:text-sm text-gray-600">
                <span>Published: {new Date(article.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                {article.updated_at && article.updated_at !== article.created_at && (
                  <span>• Updated: {new Date(article.updated_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                )}
              </div>

              {article.health_topics && (
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6 sm:mb-7 md:mb-8">
                  {article.health_topics.split(',').map((topicId: string, idx: number) => {
                    const topicName = getHealthTopicName(healthTopics, topicId.trim())
                    return (
                      <span key={idx} className="px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-primary-50 text-primary-700 text-xs sm:text-sm font-semibold rounded-full">
                        {topicName}
                      </span>
                    )
                  })}
                </div>
              )}

              {article.short_description && (
                <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-7 md:mb-8 leading-relaxed italic border-l-4 border-primary-500 pl-3 sm:pl-4 md:pl-6">
                  {article.short_description}
                </p>
              )}

              <div 
                className="prose prose-sm sm:prose-base md:prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-primary-600 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-headings:font-bold prose-p:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: article.description || article.short_description || '' }}
              />
            </div>
          </article>
        </div>

        {/* Sidebar - Related Articles */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden sticky top-20 sm:top-24 animate-fade-in">
            <div className="p-4 sm:p-5 md:p-6 border-b border-gray-100">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Related Articles</h2>
              {relatedArticles.length > 0 && (
                <p className="text-xs sm:text-sm text-gray-500">{relatedArticles.length} {relatedArticles.length === 1 ? 'article' : 'articles'} found</p>
              )}
            </div>
            
            {relatedArticles.length > 0 ? (
              <div className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
                {relatedArticles.map((relatedArticle: any, index: number) => (
                  <Link 
                    key={relatedArticle.id} 
                    href={`/articles/${relatedArticle.slug || relatedArticle.id}`}
                    className="block group animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex gap-2 sm:gap-3 md:gap-4 p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 bg-white group-hover:bg-blue-50/30 transform hover:-translate-y-1">
                      {/* Article Image */}
                      <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-20 md:h-20 rounded-lg overflow-hidden bg-gray-100">
                        <ArticleImage
                          src={relatedArticle.image}
                          alt={relatedArticle.title}
                          className="w-full h-full"
                          fallbackClassName="w-16 h-16 sm:w-20 sm:h-20 md:w-20 md:h-20"
                        />
                      </div>
                      
                      {/* Article Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1 sm:mb-1.5 line-clamp-2 text-xs sm:text-sm leading-snug group-hover:text-blue-600 transition-colors">
                          {relatedArticle.title}
                        </h3>
                        {relatedArticle.short_description && (
                          <p className="text-xs text-gray-600 line-clamp-2 mb-1.5 sm:mb-2 leading-relaxed">
                            {relatedArticle.short_description}
                          </p>
                        )}
                        <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-gray-500">
                          <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{new Date(relatedArticle.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      </div>
                      
                      {/* Arrow Icon */}
                      <div className="flex-shrink-0 flex items-center">
                        <svg 
                          className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" 
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
              </div>
            ) : (
              <div className="p-6 sm:p-8 text-center">
                <div className="mb-3 sm:mb-4 flex justify-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm sm:text-base text-gray-600 font-medium mb-1">No related articles yet</p>
                <p className="text-xs sm:text-sm text-gray-500">Check back soon for related articles</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

