'use client'

import Link from 'next/link'
import ArticleImage from './ArticleImage'

interface Article {
  id: number
  title: string
  slug?: string
  image?: string
  created_at?: string
  short_description?: string
}

interface ArticleCarouselProps {
  articles: Article[]
  title?: string
}

export default function ArticleCarousel({ articles, title = 'More recent articles' }: ArticleCarouselProps) {
  if (articles.length === 0) {
    return (
      <div className="w-full h-full flex flex-col">
        <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-3 lg:mb-4">{title}</h2>
        <p className="text-gray-500 text-xs lg:text-sm">No articles available</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-4 pb-3 border-b border-gray-200">
        <h2 className="text-lg lg:text-xl font-bold text-gray-900">{title}</h2>
      </div>
      
      <div className="space-y-3 lg:space-y-4 flex-1 flex flex-col justify-between overflow-y-auto custom-scrollbar pr-1">
        {articles.map((article, index) => (
          <Link 
            key={article.id} 
            href={`/articles/${article.slug || article.id}`}
            className="block group"
          >
            <article className="flex gap-3 lg:gap-4 p-3 rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-md bg-white group-hover:bg-gradient-to-r group-hover:from-primary-50/30 group-hover:to-transparent transition-all duration-300 cursor-pointer">
              {/* Thumbnail */}
              <div className="flex-shrink-0 w-20 h-20 lg:w-24 lg:h-24 rounded-lg overflow-hidden bg-gray-100 shadow-sm group-hover:shadow-md transition-all duration-300">
                <ArticleImage
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  fallbackClassName="w-full h-full"
                />
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <h3 className="text-sm lg:text-base font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-primary-600 transition-colors mb-2">
                  {article.title}
                </h3>
                
                {/* Date */}
                {article.created_at && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>
                      {new Date(article.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Arrow Icon */}
              <div className="flex-shrink-0 flex items-center">
                <svg 
                  className="w-5 h-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  )
}

