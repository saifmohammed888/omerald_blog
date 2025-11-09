'use client'

import { useState, useEffect, useTransition, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface HealthTopic {
  id: number
  title: string
  slug?: string
}

interface ArticleFiltersProps {
  healthTopics: HealthTopic[]
  articles?: any[] // Optional: articles to extract topics from
}

export default function ArticleFilters({ healthTopics, articles = [] }: ArticleFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [selectedTopic, setSelectedTopic] = useState(searchParams.get('healthTopic') || '')

  // Extract unique health topics from healthTopics table or from articles
  const uniqueTopics = healthTopics.length > 0 
    ? healthTopics 
    : (() => {
        // Extract unique topics from articles if healthTopics table is empty
        const topicSet = new Set<string>()
        articles.forEach((article: any) => {
          if (article.health_topics) {
            article.health_topics.split(',').forEach((topic: string) => {
              const trimmed = topic.trim()
              if (trimmed) topicSet.add(trimmed)
            })
          }
        })
        return Array.from(topicSet).map((topic, index) => ({
          id: index + 1,
          title: topic,
        }))
      })()

  // Debounced search effect - only for search input
  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Set new timer for debounced search
    debounceTimerRef.current = setTimeout(() => {
      updateFilters(search, selectedTopic)
    }, 500) // 500ms debounce delay

    // Cleanup on unmount
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]) // Only trigger on search change - selectedTopic is handled separately

  const handleSearch = (value: string) => {
    setSearch(value)
    // Don't call updateFilters here - let the debounce effect handle it
  }

  const handleTopicChange = (topic: string) => {
    setSelectedTopic(topic)
    // Clear debounce timer when topic changes
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    updateFilters(search, topic) // Topic changes immediately (no debounce needed)
  }

  const clearFilters = () => {
    setSearch('')
    setSelectedTopic('')
    // Clear debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    updateFilters('', '')
  }

  const updateFilters = (searchValue: string, topicValue: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      
      // Reset to page 1 when filters change
      params.set('page', '1')
      
      if (searchValue) {
        params.set('search', searchValue)
      } else {
        params.delete('search')
      }
      
      if (topicValue) {
        params.set('healthTopic', topicValue)
      } else {
        params.delete('healthTopic')
      }
      
      router.push(`/articles?${params.toString()}`)
    })
  }

  const hasActiveFilters = search || selectedTopic

  return (
    <div className="mb-8 space-y-4">
      {/* Search and Filter in One Line */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        {/* Search Bar */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            disabled={isPending}
          />
          {search && (
            <button
              onClick={() => handleSearch('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Health Topic Filter */}
        <div className="w-full sm:w-64 flex-shrink-0">
          <select
            id="healthTopic"
            value={selectedTopic}
            onChange={(e) => handleTopicChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white appearance-none cursor-pointer text-gray-900"
            disabled={isPending}
          >
            <option value="">All Topics</option>
            {uniqueTopics.map((topic) => (
              <option key={topic.id} value={topic.title}>
                {topic.title}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            disabled={isPending}
            className="px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex-shrink-0"
          >
            Clear
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center text-sm">
          <span className="text-gray-600">Active filters:</span>
          {search && (
            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full flex items-center gap-2">
              Search: &quot;{search}&quot;
              <button
                onClick={() => handleSearch('')}
                className="hover:text-primary-900"
                aria-label="Remove search filter"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          {selectedTopic && (
            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full flex items-center gap-2">
              Topic: {selectedTopic}
              <button
                onClick={() => handleTopicChange('')}
                className="hover:text-primary-900"
                aria-label="Remove topic filter"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
        </div>
      )}

      {/* Loading Indicator */}
      {isPending && (
        <div className="text-sm text-gray-500 flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Filtering articles...
        </div>
      )}
    </div>
  )
}

