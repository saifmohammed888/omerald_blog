'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ArticleImageProps {
  src?: string | null
  alt: string
  className?: string
  fallbackClassName?: string
  priority?: boolean
}

const IMAGE_BASE_URL = 'https://blog.omerald.com/public/uploads/articles'

function getImageUrl(src: string | null | undefined): string | null {
  if (!src) return null
  
  // If it's already a full URL, convert extension to webp
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return convertToWebp(src)
  }
  
  // If it's just a filename, prepend the base URL and convert to webp
  // Remove leading slash if present
  const filename = src.startsWith('/') ? src.slice(1) : src
  const fullUrl = `${IMAGE_BASE_URL}/${filename}`
  return convertToWebp(fullUrl)
}

function convertToWebp(url: string): string {
  // Replace common image extensions with .webp
  return url.replace(/\.(jpg|jpeg|png|gif|bmp|svg)(\?.*)?$/i, '.webp$2')
}

export default function ArticleImage({ 
  src, 
  alt, 
  className = '', 
  fallbackClassName = '',
  priority = false 
}: ArticleImageProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const imageUrl = getImageUrl(src)

  if (!imageUrl || imageError) {
    return (
      <div className={`bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center ${fallbackClassName || className}`}>
        <span className="text-primary-600 text-4xl font-bold">O</span>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${fallbackClassName || className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        </div>
      )}
      <Image
        src={imageUrl}
        alt={alt}
        fill
        className={`object-cover ${isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}`}
        onError={() => setImageError(true)}
        onLoad={() => setIsLoading(false)}
        loading={priority ? undefined : 'lazy'}
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  )
}

