/**
 * Normalize image URL for Next.js Image component
 * Handles relative paths, absolute URLs, and invalid values
 */

export function normalizeImageUrl(image: string | null | undefined): string | null {
  if (!image || typeof image !== 'string' || image.trim() === '') {
    return null;
  }

  const trimmed = image.trim();

  // If it's already a full URL (http:// or https://), return as is
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // If it starts with /, it's a relative path - return as is (Next.js handles this)
  if (trimmed.startsWith('/')) {
    return trimmed;
  }

  // If it's just a filename, assume it's in /public/images/ or needs a base URL
  // Check if it looks like a filename (has extension)
  if (trimmed.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
    // If it doesn't start with /, add it
    return `/${trimmed.startsWith('images/') ? '' : 'images/'}${trimmed}`;
  }

  // If it's a path without leading slash, add it
  if (trimmed.includes('/')) {
    return `/${trimmed}`;
  }

  // Default: treat as filename in images folder
  return `/images/${trimmed}`;
}

/**
 * Check if image URL is valid for Next.js Image component
 */
export function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  
  try {
    // If it's a full URL, validate it
    if (url.startsWith('http://') || url.startsWith('https://')) {
      new URL(url);
      return true;
    }
    
    // If it's a relative path starting with /, it's valid
    if (url.startsWith('/')) {
      return true;
    }
    
    return false;
  } catch {
    return false;
  }
}

