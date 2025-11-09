'use client'

import { useState } from 'react'

interface ArticleImageProps {
  src?: string | null
  alt: string
  className?: string
  fallbackClassName?: string
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

export default function ArticleImage({ src, alt, className = '', fallbackClassName = '' }: ArticleImageProps) {
  const [imageError, setImageError] = useState(false)
  const imageUrl = getImageUrl(src)

  if (!imageUrl || imageError) {
    return (
      <div className={`bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center ${fallbackClassName || className}`}>
        <span className="text-primary-600 text-4xl font-bold">O</span>
      </div>
    )
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
      onError={() => setImageError(true)}
    />
  )
}

