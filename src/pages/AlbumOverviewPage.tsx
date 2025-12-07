import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  Grid,
  HStack,
  Text,
  VStack,
  Button,
} from '@chakra-ui/react';
import { getAllArtistAlbums } from '../api/lastfm';
import { useAppStore } from '../store/useAppStore';
import { useColorModeStore } from '../store/useColorModeStore';
import AlbumCard from '../components/common/AlbumCard';
import SkeletonGrid from '../components/common/SkeletonGrid';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import type { Album } from '../api/types';

type SortOption = 'name-asc' | 'name-desc' | 'year-asc' | 'year-desc';

export default function AlbumOverviewPage() {
  const { artistName } = useParams<{ artistName: string }>();
  const navigate = useNavigate();
  const { colorMode } = useColorModeStore();
  const decodedArtistName = artistName ? decodeURIComponent(artistName) : '';
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const isLoadingRef = useRef(false);
  const lastArtistRef = useRef<string>('');
  const cancelledRef = useRef(false);

  useEffect(() => {
    const currentArtist = decodedArtistName;

    // Reset cancelled flag when artist changes
    if (lastArtistRef.current !== currentArtist) {
      cancelledRef.current = false;
      lastArtistRef.current = currentArtist;
      isLoadingRef.current = false;
    }

    const loadAlbums = async () => {
      if (!currentArtist) {
        setIsLoading(false);
        setAlbums([]);
        return;
      }

      const cacheKey = currentArtist.toLowerCase();

      // Prevent multiple simultaneous calls for the same artist
      if (isLoadingRef.current && lastArtistRef.current === currentArtist) {
        return;
      }

      // Check cache first
      const cached = useAppStore.getState().albumCache[cacheKey];
      if (cached && cached.length > 0) {
        // Only update if artist hasn't changed
        if (currentArtist === decodedArtistName && !cancelledRef.current) {
          setAlbums(cached);
          setIsLoading(false);
          setError(null);
        }
        return;
      }

      // No cache, fetch from API
      isLoadingRef.current = true;
      setIsLoading(true);
      setError(null);
      setAlbums([]); // Clear previous albums while loading

      try {
        const allAlbums = await getAllArtistAlbums(currentArtist, 1);

        // Only update if artist hasn't changed and not cancelled
        if (currentArtist !== decodedArtistName || cancelledRef.current) {
          return;
        }

        if (allAlbums && allAlbums.length > 0) {
          setAlbums(allAlbums);
          useAppStore.getState().cacheAlbums(currentArtist, allAlbums);
        } else {
          setAlbums([]);
        }
      } catch (err) {
        // Only update if artist hasn't changed and not cancelled
        if (currentArtist !== decodedArtistName || cancelledRef.current) {
          return;
        }
        setError(err instanceof Error ? err.message : 'Failed to load albums');
        setAlbums([]);
      } finally {
        // Only update loading if artist hasn't changed and not cancelled
        if (currentArtist === decodedArtistName && !cancelledRef.current) {
          setIsLoading(false);
        }
        // Only reset ref if this was for the current artist
        if (lastArtistRef.current === currentArtist) {
          isLoadingRef.current = false;
        }
      }
    };

    loadAlbums();

    return () => {
      // Only cancel if artist is actually changing
      if (currentArtist !== decodedArtistName) {
        cancelledRef.current = true;
      }
    };
  }, [decodedArtistName]);

  // Helper function to extract year from album
  const getAlbumYear = useCallback((album: Album): number | null => {
    if (!album.wiki?.published) {
      return null;
    }
    
    const date = new Date(album.wiki.published);
    if (isNaN(date.getTime())) {
      return null;
    }
    
    return date.getFullYear();
  }, []);

  const sortedAlbums = useMemo(() => {
    const sorted = [...albums];

    switch (sortBy) {
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'year-asc': {
        return sorted.sort((a, b) => {
          const yearA = getAlbumYear(a);
          const yearB = getAlbumYear(b);
          
          // Both have years - sort by year
          if (yearA !== null && yearB !== null) {
            if (yearA !== yearB) {
              return yearA - yearB;
            }
            // Same year, sort by name
            return a.name.localeCompare(b.name);
          }
          
          // One has year, one doesn't - albums with years come first
          if (yearA !== null && yearB === null) {
            return -1;
          }
          if (yearA === null && yearB !== null) {
            return 1;
          }
          
          // Neither has year - sort by name
          return a.name.localeCompare(b.name);
        });
      }
      case 'year-desc': {
        return sorted.sort((a, b) => {
          const yearA = getAlbumYear(a);
          const yearB = getAlbumYear(b);
          
          // Both have years - sort by year (descending)
          if (yearA !== null && yearB !== null) {
            if (yearA !== yearB) {
              return yearB - yearA;
            }
            // Same year, sort by name
            return a.name.localeCompare(b.name);
          }
          
          // One has year, one doesn't - albums with years come first
          if (yearA !== null && yearB === null) {
            return -1;
          }
          if (yearA === null && yearB !== null) {
            return 1;
          }
          
          // Neither has year - sort by name
          return a.name.localeCompare(b.name);
        });
      }
      default:
        return sorted;
    }
  }, [albums, sortBy, getAlbumYear]);

  return (
    <VStack gap={6} align="stretch" w="100%">
      <Box>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          color={colorMode === 'dark' ? 'gray.100' : 'gray.900'}
          _hover={{ 
            bg: colorMode === 'dark' ? 'gray.700' : 'gray.100',
            color: colorMode === 'dark' ? 'white' : 'gray.900'
          }}
          mb={4}
        >
          ← Back
        </Button>
        <Heading size="xl" mb={2}>
          Albums by {decodedArtistName}
        </Heading>
      </Box>

      {albums.length > 0 && (
        <HStack justify="flex-end" align="center">
          <Text fontSize="sm" color="textSecondary" mr={2}>
            Sort by:
          </Text>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as SortOption);
            }}
            style={{
              width: '200px',
              backgroundColor: 'var(--chakra-colors-inputBg)',
              color: 'var(--chakra-colors-inputText)',
              border: '1px solid',
              borderColor: 'var(--chakra-colors-cardBorder)',
              borderRadius: '6px',
              padding: '8px 12px',
              fontSize: '14px',
              outline: 'none',
            }}
            onFocus={(e) => {
              e.target.style.outline = '2px solid';
              e.target.style.outlineColor = 'var(--chakra-colors-brand-600)';
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

      {isLoading && albums.length === 0 && <SkeletonGrid count={8} />}

      {error && (
        <ErrorMessage 
          message={error} 
          onRetry={() => {
            setError(null);
            setIsLoading(true);
            getAllArtistAlbums(decodedArtistName, 1)
              .then((albums) => {
                if (albums && albums.length > 0) {
                  setAlbums(albums);
                  useAppStore.getState().cacheAlbums(decodedArtistName, albums);
                } else {
                  setAlbums([]);
                }
              })
              .catch((err) => {
                setError(err instanceof Error ? err.message : 'Failed to load albums');
              })
              .finally(() => setIsLoading(false));
          }}
          retryLabel="Try Again"
        />
      )}

      {!isLoading && !error && sortedAlbums.length > 0 && (
        <Box
          style={{
            animation: 'fadeIn 0.3s ease-in',
          }}
        >
          <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={6} w="100%">
            {sortedAlbums.map((album, index) => (
              <AlbumCard key={`${album.name}-${index}`} album={album} />
            ))}
          </Grid>
        </Box>
      )}

      {!isLoading && !error && sortedAlbums.length === 0 && albums.length === 0 && (
        <EmptyState
          icon="💿"
          title="No albums found"
          description={`We couldn't find any albums for ${decodedArtistName}. The artist may not have any albums listed on Last.fm.`}
        />
      )}
    </VStack>
  );
}
