import { useEffect, useState, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Heading,
  Grid,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { getAllArtistAlbums } from '../api/lastfm';
import { useAppStore } from '../store/useAppStore';
import AlbumCard from '../components/common/AlbumCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import type { Album } from '../api/types';

type SortOption = 'name-asc' | 'name-desc' | 'year-asc' | 'year-desc';

export default function AlbumOverviewPage() {
  const { artistName } = useParams<{ artistName: string }>();
  const decodedArtistName = artistName ? decodeURIComponent(artistName) : '';
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const isLoadingRef = useRef(false);
  const lastArtistRef = useRef<string>('');

  useEffect(() => {
    const loadAlbums = async () => {
      if (!decodedArtistName) {
        setIsLoading(false);
        return;
      }

      const cacheKey = decodedArtistName.toLowerCase();

      // Prevent loading the same artist multiple times
      if (lastArtistRef.current === decodedArtistName) {
        // If we're already loading, don't start another request
        if (isLoadingRef.current) {
          return;
        }
        // If we have cached data, use it
        const cached = useAppStore.getState().albumCache[cacheKey];
        if (cached && cached.length > 0) {
          setAlbums(cached);
          setIsLoading(false);
          return;
        }
      }

      // Prevent multiple simultaneous calls
      if (isLoadingRef.current) {
        return;
      }

      lastArtistRef.current = decodedArtistName;

      // Check cache first - access store directly to avoid dependency issues
      const cached = useAppStore.getState().albumCache[cacheKey];
      if (cached && cached.length > 0) {
        setAlbums(cached);
        setIsLoading(false);
        return;
      }

      isLoadingRef.current = true;
      setIsLoading(true);
      setError(null);

      try {
        // Load only first page (50 albums)
        const allAlbums = await getAllArtistAlbums(decodedArtistName, 1);
        
        if (allAlbums && allAlbums.length > 0) {
          setAlbums(allAlbums);
          useAppStore.getState().cacheAlbums(decodedArtistName, allAlbums);
        } else {
          setAlbums([]);
          setError('No albums found for this artist');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load albums');
        setAlbums([]);
      } finally {
        setIsLoading(false);
        isLoadingRef.current = false;
      }
    };

    loadAlbums();
  }, [decodedArtistName]);

  const sortedAlbums = useMemo(() => {
    const sorted = [...albums];

    switch (sortBy) {
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'year-asc': {
        return sorted.sort((a, b) => {
          const yearA = a.wiki?.published ? new Date(a.wiki.published).getFullYear() : 0;
          const yearB = b.wiki?.published ? new Date(b.wiki.published).getFullYear() : 0;
          return yearA - yearB;
        });
      }
      case 'year-desc': {
        return sorted.sort((a, b) => {
          const yearA = a.wiki?.published ? new Date(a.wiki.published).getFullYear() : 0;
          const yearB = b.wiki?.published ? new Date(b.wiki.published).getFullYear() : 0;
          return yearB - yearA;
        });
      }
      default:
        return sorted;
    }
  }, [albums, sortBy]);

  return (
    <VStack gap={6} align="stretch" w="100%">
      <Box>
        <Heading size="xl" mb={2}>
          Albums by {decodedArtistName}
        </Heading>
        <Text color="gray.600" mb={4}>
          {albums.length} album{albums.length !== 1 ? 's' : ''} found
        </Text>
      </Box>

      {albums.length > 0 && (
        <HStack justify="flex-end" align="center">
          <Text fontSize="sm" color="gray.600" mr={2}>
            Sort by:
          </Text>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as SortOption);
            }}
            style={{
              width: '200px',
              backgroundColor: 'white',
              border: '1px solid',
              borderColor: '#e2e8f0',
              borderRadius: '6px',
              padding: '8px 12px',
              fontSize: '14px',
              outline: 'none',
            }}
            onFocus={(e) => {
              e.target.style.outline = '2px solid';
              e.target.style.outlineColor = '#0284c7';
              e.target.style.outlineOffset = '2px';
            }}
            onBlur={(e) => {
              e.target.style.outline = 'none';
            }}
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="year-asc">Year (Oldest First)</option>
            <option value="year-desc">Year (Newest First)</option>
          </select>
        </HStack>
      )}

      {isLoading && <LoadingSpinner />}

      {error && <ErrorMessage message={error} />}

      {!isLoading && !error && sortedAlbums.length > 0 && (
        <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={6} w="100%">
          {sortedAlbums.map((album, index) => (
            <AlbumCard key={`${album.name}-${index}`} album={album} />
          ))}
        </Grid>
      )}

      {!isLoading && !error && sortedAlbums.length === 0 && (
        <Box textAlign="center" py={8}>
          <Text color="gray.600">No albums found for this artist.</Text>
        </Box>
      )}
    </VStack>
  );
}
