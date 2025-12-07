import axios from 'axios';
import type {
  LastFmApiResponse,
  ArtistSearchResponse,
  ArtistTopAlbumsResponse,
  AlbumInfoResponse,
  TopArtistsResponse,
  TopTracksResponse,
  Album,
} from './types';

const API_KEY = import.meta.env.VITE_LASTFM_API_KEY;
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';
const REQUEST_TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second

// Validate API key in development
if (import.meta.env.DEV && (!API_KEY || API_KEY === 'your_api_key_here')) {
  console.warn(
    'Last.fm API key is not set. Please add VITE_LASTFM_API_KEY to your .env file'
  );
}

/**
 * Sleep utility for retry delays
 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Base function to make Last.fm API requests with retry logic and timeout
 * Last.fm API returns data in different formats:
 * - Search methods: wrapped in 'results'
 * - Info/Chart methods: return data directly
 */
async function apiRequest<T extends object>(
  params: Record<string, string | number>,
  signal?: AbortSignal,
  retries = MAX_RETRIES
): Promise<T> {
  const searchParams = new URLSearchParams({
    api_key: API_KEY || '',
    format: 'json',
    ...Object.fromEntries(
      Object.entries(params).map(([key, value]) => [key, String(value)])
    ),
  });

  const url = `${BASE_URL}?${searchParams.toString()}`;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await axios.get<LastFmApiResponse<T> | T>(url, {
        headers: {
          'User-Agent': 'last-fm-frontend/1.0.0',
        },
        timeout: REQUEST_TIMEOUT,
        signal,
      });

      const data = response.data;

      // Check for API errors (Last.fm returns error at root level)
      if ('error' in data && data.error) {
        const errorMessage =
          ('message' in data && data.message) || `API Error: ${data.error}`;
        // Don't retry on API errors (4xx), only on network errors
        throw new Error(errorMessage);
      }

      // If response has 'results' property (search methods), return it
      if ('results' in data && data.results) {
        return data.results as T;
      }

      // Otherwise, return data directly (info/chart methods)
      return data as T;
    } catch (error) {
      // Check if request was cancelled
      if (signal?.aborted || (axios.isAxiosError(error) && error.code === 'ERR_CANCELED')) {
        throw new Error('Request cancelled');
      }

      const isLastAttempt = attempt === retries;

      if (axios.isAxiosError(error)) {
        // Don't retry on client errors (4xx)
        if (error.response && error.response.status >= 400 && error.response.status < 500) {
          throw new Error(
            `API request failed: ${error.response.status} ${error.response.statusText}`
          );
        }

        // Retry on network errors or server errors (5xx)
        if (!isLastAttempt && (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK' || (error.response && error.response.status >= 500))) {
          await sleep(RETRY_DELAY * (attempt + 1)); // Exponential backoff
          continue;
        }

        if (error.code === 'ECONNABORTED') {
          throw new Error('Request timeout: The server took too long to respond');
        }

        if (error.request) {
          throw new Error('Network error: Unable to connect to the server. Please check your internet connection.');
        }

        if (error.response) {
          throw new Error(
            `API request failed: ${error.response.status} ${error.response.statusText}`
          );
        }
      }

      // If it's the last attempt or not a retryable error, throw
      if (isLastAttempt || !(error instanceof Error && error.message.includes('timeout'))) {
        throw error;
      }

      // Wait before retrying
      await sleep(RETRY_DELAY * (attempt + 1));
    }
  }

  throw new Error('API request failed after all retry attempts');
}

/**
 * Search for artists by name
 */
export async function searchArtist(
  artist: string,
  limit = 30,
  page = 1
): Promise<ArtistSearchResponse> {
  return apiRequest<ArtistSearchResponse>({
    method: 'artist.search',
    artist,
    limit,
    page,
  });
}

/**
 * Get top albums for an artist (with pagination support)
 */
export async function getArtistTopAlbums(
  artist: string,
  page = 1,
  limit = 50
): Promise<ArtistTopAlbumsResponse> {
  return apiRequest<ArtistTopAlbumsResponse>({
    method: 'artist.gettopalbums',
    artist,
    page,
    limit,
  });
}

/**
 * Get albums for an artist (loads first page by default)
 * @param artist - Artist name
 * @param maxPages - Maximum number of pages to fetch (default: 1)
 */
export async function getAllArtistAlbums(
  artist: string,
  maxPages: number = 1
): Promise<Album[]> {
  const allAlbums: Album[] = [];
  let currentPage = 1;
  let totalPages = 1;
  const MAX_PAGES = maxPages;

  do {
    const response = await getArtistTopAlbums(artist, currentPage, 50);

    // Handle case where album might be a single object or array
    const albums = response.topalbums?.album
      ? Array.isArray(response.topalbums.album)
        ? response.topalbums.album
        : [response.topalbums.album]
      : [];

    allAlbums.push(...albums);

    // Safely parse totalPages (only on first page)
    if (currentPage === 1) {
      const totalPagesStr = response.topalbums?.['@attr']?.totalPages;
      if (totalPagesStr) {
        totalPages = parseInt(totalPagesStr, 10);
        if (isNaN(totalPages) || totalPages < 1) {
          totalPages = 1;
        }
      } else {
        // If no totalPages info, assume this is the only page
        totalPages = 1;
      }
    }

    currentPage++;

    // Safety check: limit to MAX_PAGES to prevent excessive API calls
    if (currentPage > MAX_PAGES) {
      break;
    }
  } while (currentPage <= totalPages && currentPage <= MAX_PAGES);

  return allAlbums;
}

/**
 * Get detailed information about an album
 */
export async function getAlbumInfo(
  artist: string,
  album: string,
  signal?: AbortSignal
): Promise<AlbumInfoResponse> {
  return apiRequest<AlbumInfoResponse>(
    {
      method: 'album.getinfo',
      artist,
      album,
    },
    signal
  );
}

/**
 * Get top artists globally
 */
export async function getTopArtists(
  limit = 50,
  page = 1
): Promise<TopArtistsResponse> {
  return apiRequest<TopArtistsResponse>({
    method: 'chart.gettopartists',
    limit,
    page,
  });
}

/**
 * Get top tracks globally
 */
export async function getTopTracks(
  limit = 50,
  page = 1
): Promise<TopTracksResponse> {
  return apiRequest<TopTracksResponse>({
    method: 'chart.gettoptracks',
    limit,
    page,
  });
}

