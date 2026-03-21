'use client';
import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="min-h-screen bg-light-gray flex flex-col">
      {/* Navbar skeleton */}
      <div className="bg-deep-blue h-16 px-6 flex items-center gap-4">
        <div className="w-10 h-10 bg-white/10 rounded-xl animate-pulse" />
        <div className="w-32 h-4 bg-white/10 rounded animate-pulse" />
        <div className="ml-auto flex gap-3">
          <div className="w-20 h-4 bg-white/10 rounded animate-pulse" />
          <div className="w-20 h-4 bg-white/10 rounded animate-pulse" />
          <div className="w-24 h-8 bg-gold/30 rounded-xl animate-pulse" />
        </div>
      </div>

      {/* Hero skeleton */}
      <div className="bg-deep-blue py-24 text-center px-4">
        <div className="h-12 bg-white/10 rounded-xl w-80 mx-auto animate-pulse mb-4" />
        <div className="h-6 bg-white/10 rounded w-96 mx-auto animate-pulse" />
      </div>

      {/* Cards skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100">
              <div className="h-44 bg-gray-200 animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="h-5 bg-gray-100 rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse" />
                <div className="h-2 bg-gray-100 rounded-full animate-pulse" />
                <div className="flex justify-between items-center mt-3">
                  <div className="h-4 bg-gray-100 rounded w-20 animate-pulse" />
                  <div className="h-8 bg-gold/30 rounded-xl w-24 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
