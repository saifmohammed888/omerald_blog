'use client'

import { useState, useMemo, useEffect, useRef, useTransition } from 'react'
import Link from 'next/link'
import ArticleImage from '../../components/ArticleImage'

interface HealthTopic {
  id: number
  title: string
  slug?: string
  body?: string
  article_count?: number
  is_major_health_event?: boolean
}

interface Article {
  id: number
  title: string
  slug: string
  short_description?: string
  image?: string
  created_at: string
}

interface HealthTopicsSearchProps {
  initialTopics: HealthTopic[]
}

export default function HealthTopicsSearch({ initialTopics }: HealthTopicsSearchProps) {
  const [searchInput, setSearchInput] = useState('') // Immediate input value for smooth typing
  const [debouncedQuery, setDebouncedQuery] = useState('') // Debounced query for filtering
  const [isPending, startTransition] = useTransition()
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([])
  const [isLoadingArticles, setIsLoadingArticles] = useState(false)

  // Debounce the search query
  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Set new timer for debounced search
    debounceTimerRef.current = setTimeout(() => {
      startTransition(() => {
        setDebouncedQuery(searchInput)
      })
    }, 300) // 300ms debounce delay (faster than ArticleFilters for better UX)

    // Cleanup on unmount
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [searchInput])

  // Pre-compute lowercase versions for better performance
  const topicsWithLowercase = useMemo(() => {
    return initialTopics.map(topic => ({
      ...topic,
      titleLower: topic.title?.toLowerCase() || '',
      bodyLower: topic.body?.toLowerCase() || '',
    }))
  }, [initialTopics])

  // Filter topics based on debounced search query
  const filteredTopics = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return initialTopics
    }

    const query = debouncedQuery.toLowerCase().trim()
    return topicsWithLowercase.filter((topic) => {
      const titleMatch = topic.titleLower.includes(query)
      const bodyMatch = topic.bodyLower.includes(query)
      return titleMatch || bodyMatch
    }).map(({ titleLower, bodyLower, ...topic }) => topic) // Remove helper properties
  }, [debouncedQuery, initialTopics, topicsWithLowercase])

  // Fetch related articles for visible health topics
  useEffect(() => {
    const fetchRelatedArticles = async () => {
      if (filteredTopics.length === 0) {
        setRelatedArticles([])
        return
      }

      setIsLoadingArticles(true)
      try {
        // Get base URL - use environment variable or fallback to current origin
        const baseUrl = typeof window !== 'undefined' 
          ? (process.env.NEXT_PUBLIC_API_URL || window.location.origin)
          : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
        // Get articles for the first 3 visible topics to avoid too many API calls
        const topicsToFetch = filteredTopics.slice(0, 3)
        const articlePromises = topicsToFetch.map(topic =>
          fetch(
            `${baseUrl}/api/articles?page=1&limit=6&status=1&sortBy=created_at&sortOrder=desc&healthTopic=${topic.id}`,
            { cache: 'no-store' }
          ).then(res => res.json()).then(data => data.data || []).catch(() => [])
        )

        const articleArrays = await Promise.all(articlePromises)
        // Combine all articles and remove duplicates
        const allArticles = articleArrays.flat()
        const uniqueArticles = allArticles.reduce((acc: Article[], article: Article) => {
          if (!acc.find(a => a.id === article.id)) {
            acc.push(article)
          }
          return acc
        }, [])

        // Sort by created_at descending and limit to 12 articles
        uniqueArticles.sort((a: Article, b: Article) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        setRelatedArticles(uniqueArticles.slice(0, 12))
      } catch (error) {
        console.error('Error fetching related articles:', error)
        setRelatedArticles([])
      } finally {
        setIsLoadingArticles(false)
      }
    }

    // Debounce article fetching to avoid too many requests
    const articleTimer = setTimeout(fetchRelatedArticles, 500)
    return () => clearTimeout(articleTimer)
  }, [filteredTopics])

  return (
    <div>
      {/* Search Input */}
      <div className="mb-8">
        <div className="relative max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search health topics..."
            className="block w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 transition-all duration-200 shadow-sm hover:shadow-md"
          />
          {searchInput && (
            <button
              onClick={() => {
                setSearchInput('')
                if (debounceTimerRef.current) {
                  clearTimeout(debounceTimerRef.current)
                }
                startTransition(() => {
                  setDebouncedQuery('')
                })
              }}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
        
        {/* Search Results Count and Loading Indicator */}
        <div className="mt-3 flex items-center gap-3">
          {isPending && searchInput && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Searching...</span>
            </div>
          )}
          {debouncedQuery && !isPending && (
            <p className="text-sm text-gray-600">
              Found <span className="font-semibold text-gray-900">{filteredTopics.length}</span>{' '}
              {filteredTopics.length === 1 ? 'result' : 'results'} for &quot;{debouncedQuery}&quot;
            </p>
          )}
        </div>
      </div>

      {/* Health Topics Grid */}
      {filteredTopics.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopics.map((topic) => (
            <Link key={topic.id} href={`/health-topics/${topic.slug || topic.id}`}>
              <article className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden h-full">
                <div className="p-8">
                  {/* {topic.is_major_health_event && (
                    <div className="mb-4">
                      <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                        Major Health Event
                      </span>
                    </div>
                  )} */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                    {topic.title}
                  </h3>
                  {topic.body && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {topic.body.substring(0, 100)}...
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{topic.article_count || 0}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {topic.article_count || 0} {topic.article_count === 1 ? 'Article' : 'Articles'}
                        </p>
                        <p className="text-xs text-gray-500">Related content</p>
                      </div>
                    </div>
                    <span className="text-blue-600 font-semibold text-sm">View →</span>
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
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <p className="text-gray-600 font-medium mb-1">
            {debouncedQuery ? 'No health topics found' : 'No health topics available'}
          </p>
          <p className="text-sm text-gray-500">
            {debouncedQuery
              ? `Try adjusting your search terms for "${debouncedQuery}"`
              : 'Check back later for new health topics'}
          </p>
          {debouncedQuery && (
            <button
              onClick={() => {
                setSearchInput('')
                if (debounceTimerRef.current) {
                  clearTimeout(debounceTimerRef.current)
                }
                startTransition(() => {
                  setDebouncedQuery('')
                })
              }}
              className="mt-4 text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {/* Related Articles Section */}
      {filteredTopics.length > 0 && (
        <div className="mt-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Related Articles</h2>
            {relatedArticles.length > 0 && !isLoadingArticles && (
              <p className="text-sm text-gray-600">
                {relatedArticles.length} {relatedArticles.length === 1 ? 'article' : 'articles'} found
              </p>
            )}
          </div>

          {isLoadingArticles ? (
            <div className="text-center py-12">
              <div className="flex items-center justify-center gap-2 text-gray-500">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Loading articles...</span>
              </div>
            </div>
          ) : relatedArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.map((article, index) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.slug || article.id}`}
                  className="block group animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <article className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden h-full">
                    {/* Article Image */}
                    <div className="relative w-full h-48 bg-gray-100">
                      <ArticleImage
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full"
                        fallbackClassName="w-full h-48"
                      />
                    </div>
                    
                    {/* Article Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                        {article.title}
                      </h3>
                      {article.short_description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                          {article.short_description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-gray-500 pt-4 border-t border-gray-200">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{new Date(article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span className="ml-auto text-blue-600 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                          Read more
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-600 font-medium mb-1">No related articles found</p>
              <p className="text-sm text-gray-500">Check back soon for articles about these topics</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

