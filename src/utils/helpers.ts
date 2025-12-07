import type { Image } from '../api/types';

/**
 * Generate a placeholder image as data URI
 * Uses neutral colors that work in both light and dark modes
 */
export function getPlaceholderImage(): string {
  // SVG placeholder with "No Image" text
  // Using neutral gray colors that are visible in both light and dark modes
  const svg = `
    <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="300" fill="#9ca3af"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="18" fill="#ffffff" font-weight="500" text-anchor="middle" dominant-baseline="middle">No Image</text>
    </svg>
  `.trim();
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Get the best available image from Last.fm image array
 * Prefers: extralarge > large > medium > small
 * Note: Last.fm often returns empty strings for images, so we check for non-empty URLs
 */
export function getBestImage(images?: Image[]): string {
  if (!images || images.length === 0) {
    return getPlaceholderImage();
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
  return firstImage?.['#text'] || getPlaceholderImage();
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

