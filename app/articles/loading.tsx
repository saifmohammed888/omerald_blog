import { ArticleListSkeleton } from '../components/ArticleSkeleton'

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="mb-8">
        <div className="h-12 bg-gray-200 rounded w-64 mb-4 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded w-96 animate-pulse"></div>
      </div>

      {/* Search and Filter Skeleton */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="w-full sm:w-64 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>

      {/* Articles Skeleton */}
      <ArticleListSkeleton count={12} />
    </div>
  )
}

