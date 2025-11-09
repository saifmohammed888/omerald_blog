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
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [selectedTopics, setSelectedTopics] = useState<string[]>(() => {
    const topicsParam = searchParams.get('healthTopic')
    return topicsParam ? topicsParam.split(',').filter(Boolean) : []
  })
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [topicSearch, setTopicSearch] = useState('')

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
  
  // Create a mapping of topic titles to IDs for quick lookup
  const topicTitleToIdMap = new Map<string, string>()
  uniqueTopics.forEach((topic) => {
    topicTitleToIdMap.set(topic.title, topic.id.toString())
  })
  
  // Helper function to get topic ID from title or return the value if it's already an ID
  const getTopicId = (value: string): string => {
    // If it's already a numeric ID, return it
    if (/^\d+$/.test(value)) {
      return value
    }
    // Otherwise, look it up in the map
    return topicTitleToIdMap.get(value) || value
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
        setTopicSearch('')
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  // Debounced search effect - only for search input
  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Set new timer for debounced search
    debounceTimerRef.current = setTimeout(() => {
      updateFilters(search, selectedTopics)
    }, 500) // 500ms debounce delay

    // Cleanup on unmount
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]) // Only trigger on search change - selectedTopics is handled separately

  const handleSearch = (value: string) => {
    setSearch(value)
    // Don't call updateFilters here - let the debounce effect handle it
  }

  const toggleTopic = (topicTitle: string) => {
    const topicId = getTopicId(topicTitle)
    // Check if this topic ID is already selected (handle both ID and title formats)
    const isSelected = selectedTopics.some(t => {
      const tId = getTopicId(t)
      return tId === topicId || t === topicTitle
    })
    
    const newTopics = isSelected
      ? selectedTopics.filter(t => {
          const tId = getTopicId(t)
          return tId !== topicId && t !== topicTitle
        })
      : [...selectedTopics, topicId] // Store IDs instead of titles
    
    setSelectedTopics(newTopics)
    // Clear debounce timer when topic changes
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    updateFilters(search, newTopics) // Topic changes immediately (no debounce needed)
  }

  const removeTopic = (topicValue: string) => {
    const topicId = getTopicId(topicValue)
    const newTopics = selectedTopics.filter(t => {
      const tId = getTopicId(t)
      return tId !== topicId && t !== topicValue
    })
    setSelectedTopics(newTopics)
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    updateFilters(search, newTopics)
  }

  const clearFilters = () => {
    setSearch('')
    setSelectedTopics([])
    // Clear debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    updateFilters('', [])
  }

  const updateFilters = (searchValue: string, topicValues: string[]) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      
      // Reset to page 1 when filters change
      params.set('page', '1')
      
      if (searchValue) {
        params.set('search', searchValue)
      } else {
        params.delete('search')
      }
      
      if (topicValues.length > 0) {
        params.set('healthTopic', topicValues.join(','))
      } else {
        params.delete('healthTopic')
      }
      
      router.replace(`/articles?${params.toString()}`)
    })
  }

  // Filter topics based on search
  const filteredTopics = uniqueTopics.filter(topic =>
    topic.title.toLowerCase().includes(topicSearch.toLowerCase())
  )

  const hasActiveFilters = search || selectedTopics.length > 0

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

        {/* Health Topic Filter - Custom Dropdown */}
        <div className="w-full sm:w-64 flex-shrink-0 relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-left flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
            disabled={isPending}
          >
            <span className="text-gray-900 truncate">
              {selectedTopics.length === 0
                ? 'All Topics'
                : selectedTopics.length === 1
                ? (() => {
                    // Get topic title from ID
                    const topicId = getTopicId(selectedTopics[0])
                    const topic = uniqueTopics.find(t => t.id.toString() === topicId)
                    return topic ? topic.title : selectedTopics[0]
                  })()
                : `${selectedTopics.length} topics selected`}
            </span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute z-50 w-full mt-2 bg-gray-800 rounded-lg shadow-2xl border border-gray-700 overflow-hidden">
              {/* Search Input */}
              <div className="p-3 border-b border-gray-700">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={topicSearch}
                    onChange={(e) => setTopicSearch(e.target.value)}
                    placeholder="Search topics..."
                    className="w-full pl-10 pr-3 py-2 bg-gray-900 text-white text-sm rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>

              {/* Topics List */}
              <div className="max-h-64 overflow-y-auto">
                {/* Select All Option */}
                <button
                  type="button"
                  onClick={() => {
                    // Check if all filtered topics are selected (by ID)
                    const filteredTopicIds = filteredTopics.map(t => t.id.toString())
                    const allSelected = filteredTopicIds.every(id => 
                      selectedTopics.some(st => getTopicId(st) === id)
                    )
                    
                    if (allSelected && filteredTopics.length > 0) {
                      setSelectedTopics([])
                      updateFilters(search, [])
                    } else {
                      // Select all filtered topics by their IDs
                      setSelectedTopics(filteredTopicIds)
                      updateFilters(search, filteredTopicIds)
                    }
                  }}
                  className="w-full px-4 py-2.5 text-left text-white hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm"
                >
                  <div className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                    filteredTopics.length > 0 && filteredTopics.every(t => 
                      selectedTopics.some(st => getTopicId(st) === t.id.toString())
                    )
                      ? 'bg-primary-500 border-primary-500'
                      : 'border-gray-500'
                  }`}>
                    {filteredTopics.length > 0 && filteredTopics.every(t => 
                      selectedTopics.some(st => getTopicId(st) === t.id.toString())
                    ) && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span>All Topics</span>
                </button>

                {/* Topic Options */}
                {filteredTopics.length > 0 ? (
                  filteredTopics.map((topic) => {
                    const topicId = topic.id.toString()
                    const isSelected = selectedTopics.some(st => getTopicId(st) === topicId)
                    return (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => toggleTopic(topic.title)}
                        className={`w-full px-4 py-2.5 text-left text-white hover:bg-pink-600 transition-colors flex items-center gap-2 text-sm ${
                          isSelected ? 'bg-gray-700' : ''
                        }`}
                      >
                        <div className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                          isSelected ? 'bg-primary-500 border-primary-500' : 'border-gray-500'
                        }`}>
                          {isSelected && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span>{topic.title}</span>
                      </button>
                    )
                  })
                ) : (
                  <div className="px-4 py-3 text-gray-400 text-sm text-center">
                    No topics found
                  </div>
                )}
              </div>
            </div>
          )}
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
          {selectedTopics.map((topicValue) => {
            // Get topic title from ID
            const topicId = getTopicId(topicValue)
            const topic = uniqueTopics.find(t => t.id.toString() === topicId)
            const topicTitle = topic ? topic.title : topicValue
            return (
              <span key={topicValue} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full flex items-center gap-2">
                Topic: {topicTitle}
                <button
                  onClick={() => removeTopic(topicValue)}
                  className="hover:text-primary-900"
                  aria-label={`Remove ${topicTitle} filter`}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )
          })}
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

