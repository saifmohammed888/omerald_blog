'use client'

import { useState } from 'react'
import Link from 'next/link'
import ArticleImage from './ArticleImage'

interface Article {
  id: number
  title: string
  slug?: string
  image?: string
  short_description?: string
  created_at: string
  health_topics?: string
}

interface TrendingLatestSectionProps {
  trendingArticles: Article[]
  latestArticles: Article[]
}

export default function TrendingLatestSection({ 
  trendingArticles, 
  latestArticles 
}: TrendingLatestSectionProps) {
  const [activeTab, setActiveTab] = useState<'trending' | 'latest'>('trending')
  const articles = activeTab === 'trending' ? trendingArticles : latestArticles

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-12">
      {/* Header with Tabs */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
              {activeTab === 'trending' ? 'Trending Articles' : 'Latest Articles'}
            </h2>
            <p className="text-sm text-gray-500">
              {articles.length} {articles.length === 1 ? 'article' : 'articles'} found
            </p>
          </div>
          
          {/* Tab Switcher */}
          <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('trending')}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                activeTab === 'trending'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Trending
            </button>
            <button
              onClick={() => setActiveTab('latest')}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                activeTab === 'latest'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Latest
            </button>
          </div>
        </div>
      </div>

      {/* Articles List */}
      <div className="p-6">
        {articles.length > 0 ? (
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {articles.map((article, index) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug || article.id}`}
                className="block group"
              >
                <article className="flex gap-4 p-4 rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all duration-300 bg-white group-hover:bg-gradient-to-r group-hover:from-primary-50/50 group-hover:to-transparent">
                  {/* Thumbnail */}
                  <div className="flex-shrink-0 w-24 h-24 md:w-28 md:h-28 rounded-lg overflow-hidden bg-gray-100 shadow-sm group-hover:shadow-md transition-shadow">
                    <ArticleImage
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      fallbackClassName="w-full h-full"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      {/* Health Topics */}
                      {article.health_topics && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {article.health_topics.split(',').slice(0, 2).map((topic: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full"
                            >
                              {topic.trim()}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Title */}
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-base md:text-lg leading-snug group-hover:text-primary-600 transition-colors">
                        {article.title}
                      </h3>

                      {/* Description */}
                      {article.short_description && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3 leading-relaxed">
                          {article.short_description}
                        </p>
                      )}
                    </div>

                    {/* Date and Arrow */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>
                          {new Date(article.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>

                      {/* Arrow Icon */}
                      <svg
                        className="w-5 h-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-gray-600 font-medium mb-1">
              No {activeTab === 'trending' ? 'trending' : 'latest'} articles yet
            </p>
            <p className="text-sm text-gray-500">Check back soon for new articles</p>
          </div>
        )}
      </div>
    </div>
  )
}

