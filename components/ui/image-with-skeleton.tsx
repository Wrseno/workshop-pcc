'use client'

import { useState } from 'react'

interface ImageWithSkeletonProps {
  src: string
  alt: string
  className?: string
  skeletonClassName?: string
}

export default function ImageWithSkeleton({ 
  src, 
  alt, 
  className = '', 
  skeletonClassName = '' 
}: ImageWithSkeletonProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-gray-900 border border-gray-800 ${className}`}>
        <span className="text-gray-500 text-sm font-mono">ERR_LOAD</span>
      </div>
    )
  }

  return (
    <>
      {isLoading && (
        <div className={`absolute inset-0 animate-pulse bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 ${skeletonClassName}`}>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" 
               style={{ 
                 backgroundSize: '200% 100%',
                 animation: 'shimmer 1.5s infinite'
               }} 
          />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={className}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false)
          setHasError(true)
        }}
        style={{ display: isLoading ? 'none' : 'block' }}
      />
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </>
  )
}
