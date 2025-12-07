import type { Image } from '../api/types';

/**
 * Get the best available image from Last.fm image array
 * Prefers: extralarge > large > medium > small
 * Note: Last.fm often returns empty strings for images, so we check for non-empty URLs
 */
export function getBestImage(images?: Image[]): string {
  if (!images || images.length === 0) {
    return 'https://via.placeholder.com/300x300?text=No+Image';
  }

  // Filter out empty strings and find images in order of preference
  const sizes = ['extralarge', 'large', 'medium', 'small', 'mega'];
  for (const size of sizes) {
    const image = images.find(
      (img) => img.size === size && img['#text'] && img['#text'].trim() !== ''
    );
    if (image && image['#text'] && image['#text'].trim() !== '') {
      return image['#text'];
    }
  }

  // Fallback to first non-empty image
  const firstImage = images.find(
    (img) => img['#text'] && img['#text'].trim() !== ''
  );
  return firstImage?.['#text'] || 'https://via.placeholder.com/300x300?text=No+Image';
}

/**
 * Encode artist name for URL
 */
export function encodeArtistName(name: string): string {
  return encodeURIComponent(name);
}

/**
 * Decode artist name from URL
 */
export function decodeArtistName(encoded: string): string {
  return decodeURIComponent(encoded);
}

