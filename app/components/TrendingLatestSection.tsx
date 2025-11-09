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

interface HealthTopic {
  id: number
  title: string
}

interface TrendingLatestSectionProps {
  trendingArticles: Article[]
  latestArticles: Article[]
  healthTopics?: HealthTopic[]
}

export default function TrendingLatestSection({ 
  trendingArticles, 
  latestArticles,
  healthTopics = []
}: TrendingLatestSectionProps) {
  const [activeTab, setActiveTab] = useState<'trending' | 'latest'>('trending')
  const articles = activeTab === 'trending' ? trendingArticles : latestArticles

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header with Tabs */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="px-3 py-2.5 flex flex-col gap-2.5">
          <div>
            <h2 className="text-base font-bold text-gray-900 mb-0.5">
              {activeTab === 'trending' ? 'Trending Articles' : 'Latest Articles'}
            </h2>
            <p className="text-[10px] text-gray-500">
              {articles.length} {articles.length === 1 ? 'article' : 'articles'}
            </p>
          </div>
          
          {/* Tab Switcher */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setActiveTab('trending')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all duration-200 flex-1 ${
                activeTab === 'trending'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Trending
            </button>
            <button
              onClick={() => setActiveTab('latest')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all duration-200 flex-1 ${
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
      <div className="p-3">
        {articles.length > 0 ? (
          <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
            {articles.map((article, index) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug || article.id}`}
                className="block group"
              >
                <article className="flex gap-2 p-2 rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all duration-300 bg-white group-hover:bg-gradient-to-r group-hover:from-primary-50/50 group-hover:to-transparent">
                  {/* Thumbnail */}
                  <div className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shadow-sm group-hover:shadow-md transition-shadow">
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
                        <div className="flex flex-wrap gap-1 mb-1">
                          {article.health_topics.split(',').slice(0, 1).map((topicId: string, idx: number) => {
                            const topicName = healthTopics.find((t: HealthTopic) => t.id === parseInt(topicId.trim(), 10))?.title || topicId.trim()
                            return (
                              <span
                                key={idx}
                                className="px-1 py-0.5 bg-primary-50 text-primary-700 text-[9px] font-semibold rounded-full"
                              >
                                {topicName}
                              </span>
                            )
                          })}
                        </div>
                      )}

                      {/* Title */}
                      <h3 className="font-bold text-gray-900 mb-1 line-clamp-2 text-xs leading-snug group-hover:text-primary-600 transition-colors">
                        {article.title}
                      </h3>

                      {/* Description */}
                      {article.short_description && (
                        <p className="text-[10px] text-gray-600 line-clamp-2 mb-1.5 leading-relaxed">
                          {article.short_description}
                        </p>
                      )}
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-1 text-[9px] text-gray-500">
                      <svg
                        className="w-2.5 h-2.5"
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
                        })}
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <div className="mb-3 flex justify-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-gray-400"
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
            <p className="text-gray-600 font-medium mb-1 text-sm">
              No {activeTab === 'trending' ? 'trending' : 'latest'} articles yet
            </p>
            <p className="text-xs text-gray-500">Check back soon</p>
          </div>
        )}
      </div>
    </div>
  )
}

