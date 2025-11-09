import Link from 'next/link'
import { notFound } from 'next/navigation'
import ArticleImage from '../../components/ArticleImage'

async function getArticle(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/articles/${slug}`, {
      cache: 'no-store'
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.success ? data.data : null
  } catch (error) {
    return null
  }
}

async function getRelatedArticles(currentArticleId: number, healthTopics: string) {
  try {
    if (!healthTopics) return []
    
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/articles?page=1&limit=100&status=1&sortBy=created_at&sortOrder=desc`, {
      cache: 'no-store'
    })
    if (!res.ok) return []
    const data = await res.json()
    const articles = data.data || []
    
    // Extract health topic IDs from current article
    const currentTopicIds = healthTopics.split(',').map((t: string) => {
      const trimmed = t.trim()
      const parsed = parseInt(trimmed, 10)
      return isNaN(parsed) ? null : parsed
    }).filter((id: number | null) => id !== null) as number[]
    
    if (currentTopicIds.length === 0) return []
    
    // Find articles that share at least one health topic with the current article
    const related = articles
      .filter((article: any) => {
        // Exclude current article
        if (article.id === currentArticleId) return false
        if (!article.health_topics) return false
        
        const articleTopicIds = article.health_topics.split(',').map((t: string) => {
          const trimmed = t.trim()
          const parsed = parseInt(trimmed, 10)
          return isNaN(parsed) ? null : parsed
        }).filter((id: number | null) => id !== null) as number[]
        
        // Check if any topic IDs match
        return currentTopicIds.some(id => articleTopicIds.includes(id))
      })
      .slice(0, 6) // Limit to 6 related articles
    
    return related
  } catch (error) {
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

  const relatedArticles = await getRelatedArticles(article.id, article.health_topics || '')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link 
        href="/articles" 
        className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium mb-8 transition-colors group"
      >
        <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Articles
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Article Content */}
        <div className="lg:col-span-2">
          <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="relative h-96 overflow-hidden">
              <ArticleImage
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
                fallbackClassName="h-96"
              />
            </div>

            <div className="p-8 md:p-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {article.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600">
                <span>Published: {new Date(article.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                {article.updated_at && article.updated_at !== article.created_at && (
                  <span>• Updated: {new Date(article.updated_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                )}
              </div>

              {article.health_topics && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {article.health_topics.split(',').map((topic: string, idx: number) => (
                    <span key={idx} className="px-4 py-2 bg-primary-50 text-primary-700 text-sm font-semibold rounded-full">
                      {topic.trim()}
                    </span>
                  ))}
                </div>
              )}

              {article.short_description && (
                <p className="text-xl text-gray-600 mb-8 leading-relaxed italic border-l-4 border-primary-500 pl-6">
                  {article.short_description}
                </p>
              )}

              <div 
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-primary-600 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700"
                dangerouslySetInnerHTML={{ __html: article.description || article.short_description || '' }}
              />
            </div>
          </article>
        </div>

        {/* Sidebar - Related Articles */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-24">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Related Articles</h2>
              {relatedArticles.length > 0 && (
                <p className="text-sm text-gray-500">{relatedArticles.length} {relatedArticles.length === 1 ? 'article' : 'articles'} found</p>
              )}
            </div>
            
            {relatedArticles.length > 0 ? (
              <div className="p-6 space-y-4">
                {relatedArticles.map((relatedArticle: any) => (
                  <Link 
                    key={relatedArticle.id} 
                    href={`/articles/${relatedArticle.slug || relatedArticle.id}`}
                    className="block group"
                  >
                    <div className="flex gap-4 p-4 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 bg-white group-hover:bg-blue-50/30">
                      {/* Article Image */}
                      <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                        <ArticleImage
                          src={relatedArticle.image}
                          alt={relatedArticle.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          fallbackClassName="w-20 h-20"
                        />
                      </div>
                      
                      {/* Article Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1.5 line-clamp-2 text-sm leading-snug group-hover:text-blue-600 transition-colors">
                          {relatedArticle.title}
                        </h3>
                        {relatedArticle.short_description && (
                          <p className="text-xs text-gray-600 line-clamp-2 mb-2 leading-relaxed">
                            {relatedArticle.short_description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{new Date(relatedArticle.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
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
                <p className="text-sm text-gray-500">Check back soon for related articles</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

