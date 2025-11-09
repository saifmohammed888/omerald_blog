export default function ArticleSkeleton() {
  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-md animate-pulse">
      <div className="relative h-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
      </div>
      <div className="p-6">
        <div className="flex gap-2 mb-3">
          <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
          <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
        </div>
        <div className="h-6 bg-gray-300 rounded mb-3 w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
        <div className="h-4 bg-gray-200 rounded mb-2 w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded mb-4 w-4/6"></div>
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </article>
  )
}

export function ArticleListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ArticleSkeleton key={i} />
      ))}
    </div>
  )
}

export function ArticleDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-32 mb-8"></div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Article Content */}
        <div className="lg:col-span-2">
          <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="relative h-96 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
            </div>
            
            <div className="p-8 md:p-12">
              <div className="h-10 bg-gray-300 rounded mb-6 w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
              <div className="flex gap-2 mb-8">
                <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
                <div className="h-8 w-28 bg-gray-200 rounded-full"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded mb-4 w-full"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-4/6"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
            </div>
          </article>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-24">
            <div className="p-6 border-b border-gray-100">
              <div className="h-8 bg-gray-300 rounded mb-2 w-40"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="p-6 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl border border-gray-200">
                  <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

