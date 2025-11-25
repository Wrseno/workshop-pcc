'use client'

import { useState, useEffect, useRef } from 'react'

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
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    setIsLoading(true)
    setHasError(false)
    
    // If image is already cached, it won't fire onLoad
    // So we need to check if it's already loaded
    if (imgRef.current?.complete && imgRef.current?.naturalHeight !== 0) {
      setIsLoading(false)
    }
  }, [src])

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-gray-900 border border-gray-800 ${className}`}>
        <span className="text-gray-500 text-sm font-mono">ERR_LOAD</span>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className={`absolute inset-0 animate-pulse bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 ${skeletonClassName} z-10`}>
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" 
            style={{ 
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite linear'
            }} 
          />
        </div>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
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
    </div>
  )
}
