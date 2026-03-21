import { motion } from 'framer-motion';

function SkeletonLine({ width = '100%', height = '16px', className = '' }: { width?: string; height?: string; className?: string }) {
  return (
    <div
      className={`rounded bg-gray-200 ${className}`}
      style={{ width, height, background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }}
    />
  );
}

export default function Loading() {
  return (
    <div className="min-h-screen bg-light-gray flex flex-col">
      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>

      {/* Navbar skeleton */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <SkeletonLine width="140px" height="24px" />
        <div className="flex gap-6">
          {[1, 2, 3, 4, 5].map(i => <SkeletonLine key={i} width="60px" height="16px" />)}
        </div>
        <SkeletonLine width="100px" height="36px" className="rounded-xl" />
      </div>

      {/* Hero skeleton */}
      <div className="bg-deep-blue py-20">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center">
          <SkeletonLine width="300px" height="48px" className="rounded mb-4" />
          <SkeletonLine width="500px" height="24px" className="rounded mb-8" />
          <div className="flex gap-4">
            <SkeletonLine width="180px" height="48px" className="rounded-xl" />
            <SkeletonLine width="160px" height="48px" className="rounded-xl" />
          </div>
        </div>
      </div>

      {/* Cards skeleton */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <SkeletonLine width="200px" height="32px" className="rounded mb-10" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100">
                <SkeletonLine height="176px" className="rounded-none" />
                <div className="p-5 space-y-3">
                  <SkeletonLine width="80%" height="20px" />
                  <SkeletonLine width="60%" height="14px" />
                  <SkeletonLine width="100%" height="8px" className="rounded-full" />
                  <div className="flex justify-between mt-2">
                    <SkeletonLine width="40%" height="14px" />
                    <SkeletonLine width="80px" height="36px" className="rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
