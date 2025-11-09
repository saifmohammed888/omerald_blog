'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ArticleImage from './ArticleImage'

interface Article {
  id: number
  title: string
  slug?: string
  image?: string
  health_topics?: string
  healthTopicName?: string
  short_description?: string
}

interface FeaturedCarouselProps {
  articles: Article[]
}

export default function FeaturedCarousel({ 
  articles
}: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying || articles.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying, articles.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
    // Resume auto-play after 15 seconds
    setTimeout(() => setIsAutoPlaying(true), 15000)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 15000)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % articles.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 15000)
  }

  if (articles.length === 0) {
    return null
  }

  const currentArticle = articles[currentIndex]

  return (
    <div className="relative w-full">
      {/* Main Carousel Container */}
      <div className="relative h-[350px] lg:h-[455px] xl:h-[525px] rounded-2xl overflow-hidden shadow-2xl">
        {/* Articles */}
        <div className="relative w-full h-full">
          {articles.map((article, index) => (
            <Link 
              key={article.id} 
              href={`/articles/${article.slug || article.id}`}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <article className="relative w-full h-full group cursor-pointer overflow-hidden">
                {/* Image Container with better horizontal image support */}
                <div className="absolute inset-0">
                  <ArticleImage
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full"
                    fallbackClassName="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-700"></div>
                </div>
                
                {/* Enhanced overlay gradients for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20"></div>
                {/* Bottom fade for text area */}
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent"></div>
                
                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-10 xl:p-12 text-white">
                  {/* Category tag */}
                  <div className="mb-6 transform group-hover:translate-y-0 translate-y-2 transition-transform duration-500">
                    <span className="inline-block px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider border border-white/30 text-white shadow-lg group-hover:bg-white/30 transition-all duration-300">
                      {article.healthTopicName || 'Health & Wellness'}
                    </span>
                  </div>
                  
                  {/* Title */}
                  <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 leading-tight max-w-4xl transform group-hover:translate-y-0 translate-y-2 transition-transform duration-500 delay-75">
                    {article.title}
                  </h1>
                  
                  {/* Short description if available */}
                  {article.short_description && (
                    <p className="text-lg lg:text-xl text-white/90 line-clamp-2 max-w-4xl leading-relaxed transform group-hover:translate-y-0 translate-y-2 transition-transform duration-500 delay-150">
                      {article.short_description}
                    </p>
                  )}
                  
                  {/* Read More Button */}
                  <div className="mt-6 transform group-hover:translate-y-0 translate-y-2 transition-transform duration-500 delay-200">
                    <span className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-md rounded-full text-sm font-semibold text-white border border-white/30 hover:bg-white/30 transition-all duration-300 shadow-lg">
                      Read Article
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Navigation Buttons */}
        {articles.length > 1 && (
          <>
            {/* Previous Button */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 bg-white/15 backdrop-blur-md hover:bg-white/25 rounded-full p-3 lg:p-4 shadow-2xl transition-all z-20 border border-white/30 hover:scale-110 hover:border-white/50 group"
              aria-label="Previous article"
            >
              <svg className="w-6 h-6 lg:w-7 lg:h-7 text-white group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next Button */}
            <button
              onClick={goToNext}
              className="absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 bg-white/15 backdrop-blur-md hover:bg-white/25 rounded-full p-3 lg:p-4 shadow-2xl transition-all z-20 border border-white/30 hover:scale-110 hover:border-white/50 group"
              aria-label="Next article"
            >
              <svg className="w-6 h-6 lg:w-7 lg:h-7 text-white group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {articles.length > 1 && (
          <div className="absolute bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 flex gap-2.5 z-20 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full">
            {articles.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 bg-white shadow-lg'
                    : 'w-2.5 bg-white/50 hover:bg-white/70 hover:w-3'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

