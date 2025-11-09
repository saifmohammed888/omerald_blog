import { ArticleListSkeleton } from './components/ArticleSkeleton'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16 animate-fade-in">
        {/* Carousel Section Skeleton */}
        <section className="mb-20">
          <div className="mb-6">
            <div className="h-10 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-96 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg h-[400px] lg:h-[500px] animate-pulse">
                <div className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-5 h-[350px] lg:h-[455px] animate-pulse">
                <div className="h-full bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Posts Section Skeleton */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-10">
            <div className="h-10 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
          <ArticleListSkeleton count={9} />
        </section>
      </div>
    </div>
  )
}

