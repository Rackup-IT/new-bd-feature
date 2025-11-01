export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header skeleton */}
      <div className="w-full bg-gray-100 animate-pulse">
        <div className="wrapper mx-auto py-4">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
        </div>
      </div>

      {/* Title and image skeleton */}
      <div className="wrapper mx-auto mt-8 lg:mt-12">
        <div className="animate-pulse space-y-6">
          {/* Title skeleton */}
          <div className="space-y-3">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-8 bg-gray-200 rounded w-2/3"></div>
          </div>

          {/* Image skeleton */}
          <div className="w-full h-96 bg-gray-200 rounded-lg"></div>

          {/* Date skeleton */}
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>

        {/* Content area skeleton */}
        <div className="mt-8 md:grid md:grid-cols-12 md:gap-6 lg:gap-8">
          {/* Left sidebar skeleton */}
          <div className="hidden md:block md:col-span-1">
            <div className="space-y-3">
              <div className="w-10 h-10 bg-gray-200 rounded"></div>
              <div className="w-10 h-10 bg-gray-200 rounded"></div>
              <div className="w-10 h-10 bg-gray-200 rounded"></div>
              <div className="w-10 h-10 bg-gray-200 rounded"></div>
            </div>
          </div>

          {/* Main content skeleton */}
          <main className="md:col-span-7 lg:col-span-7 animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-4/5"></div>
            <div className="mt-6 space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </main>

          {/* Right sidebar skeleton */}
          <aside className="hidden md:block md:col-span-4 lg:col-span-4 lg:ml-14 animate-pulse space-y-6">
            {/* Author skeleton */}
            <div>
              <div className="h-4 bg-gray-200 rounded w-20 mb-4"></div>
              <div className="flex items-start gap-3">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            </div>

            {/* Disclosure skeleton */}
            <div>
              <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-4/5"></div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
