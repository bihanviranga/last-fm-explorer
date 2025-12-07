import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Image,
  VStack,
  HStack,
  Grid,
} from '@chakra-ui/react';
import { getAlbumInfo } from '../api/lastfm';
import { getBestImage, decodeArtistName, encodeArtistName, getPlaceholderImage } from '../utils/helpers';
import { useColorModeStore } from '../store/useColorModeStore';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import type { Album, Track } from '../api/types';

export default function AlbumDetailPage() {
  const { artistName, albumName } = useParams<{ artistName: string; albumName: string }>();
  const decodedArtistName = artistName ? decodeArtistName(artistName) : '';
  const decodedAlbumName = albumName ? decodeArtistName(albumName) : '';
  
  const [album, setAlbum] = useState<Album | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isLoadingRef = useRef(false);
  const lastAlbumRef = useRef<string>('');

  useEffect(() => {
    let cancelled = false;

    const loadAlbum = async () => {
      if (!decodedArtistName || !decodedAlbumName) {
        setIsLoading(false);
        return;
      }

      const albumKey = `${decodedArtistName}-${decodedAlbumName}`;

      // Prevent loading the same album multiple times
      if (lastAlbumRef.current === albumKey) {
        if (isLoadingRef.current) {
          return;
        }
      }

      // Prevent multiple simultaneous calls
      if (isLoadingRef.current) {
        return;
      }

      lastAlbumRef.current = albumKey;
      isLoadingRef.current = true;
      setIsLoading(true);
      setError(null);

      try {
        const response = await getAlbumInfo(decodedArtistName, decodedAlbumName);
        
        if (cancelled) return;
        
        setAlbum(response.album);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load album details');
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
        isLoadingRef.current = false;
      }
    };

    loadAlbum();

    return () => {
      cancelled = true;
    };
  }, [decodedArtistName, decodedAlbumName]);

  const imageUrl = album ? getBestImage(album.image) : '';
  const artistNameDisplay = album
    ? typeof album.artist === 'string'
      ? album.artist
      : album.artist.name
    : decodedArtistName;

  // Extract tracks from album
  const tracks: Track[] = album?.tracks?.track
    ? Array.isArray(album.tracks.track)
      ? album.tracks.track
      : [album.tracks.track]
    : [];

  // Format duration from seconds to MM:SS
  const formatDuration = (seconds?: string): string => {
    if (!seconds) return '';
    const sec = parseInt(seconds, 10);
    if (isNaN(sec)) return '';
    const minutes = Math.floor(sec / 60);
    const remainingSeconds = sec % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Get release year from wiki
  const releaseYear = album?.wiki?.published
    ? new Date(album.wiki.published).getFullYear()
    : null;

  const { colorMode } = useColorModeStore();

  return (
    <VStack gap={6} align="stretch" w="100%">
      <Box>
        <Link to={`/artist/${encodeArtistName(decodedArtistName)}/albums`}>
          <Text
            color="brand.600"
            _hover={{ color: 'brand.700', textDecoration: 'underline' }}
            cursor="pointer"
            mb={4}
          >
            ← Back to Albums
          </Text>
        </Link>
      </Box>

      {isLoading && <LoadingSpinner />}

      {error && <ErrorMessage message={error} />}

      {!isLoading && !error && album && (
        <>
          <Grid templateColumns={{ base: '1fr', md: '300px 1fr' }} gap={8} w="100%">
            {/* Album Cover */}
            <Box>
              <Image
                src={imageUrl}
                alt={album.name}
                fit="cover"
                w="100%"
                borderRadius="lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = getPlaceholderImage();
                }}
              />
            </Box>

            {/* Album Info */}
            <VStack align="flex-start" gap={4}>
              <Box>
                <Heading size="xl" mb={2}>
                  {album.name}
                </Heading>
                <Text fontSize="lg" color="textSecondary" mb={2}>
                  by {artistNameDisplay}
                </Text>
                {releaseYear && (
                  <Text fontSize="md" color="textSecondary">
                    Released: {releaseYear}
                  </Text>
                )}
              </Box>

              {album.playcount && (
                <Text fontSize="sm" color="textSecondary">
                  {parseInt(album.playcount, 10).toLocaleString()} plays
                </Text>
              )}

              {album.wiki?.summary && (
                <Box>
                  <Text fontSize="sm" color="textSecondary" lineHeight="tall">
                    {album.wiki.summary.split('<a')[0].trim()}
                  </Text>
                </Box>
              )}

              {album.tags?.tag && album.tags.tag.length > 0 && (
                <HStack flexWrap="wrap" gap={2}>
                  <Text fontSize="sm" fontWeight="medium" color="textSecondary">
                    Tags:
                  </Text>
                  {album.tags.tag.slice(0, 5).map((tag) => (
                    <Box
                      key={tag.name}
                      as="span"
                      px={2}
                      py={1}
                      bg={colorMode === 'dark' ? 'brand.700' : 'brand.100'}
                      color={colorMode === 'dark' ? 'brand.100' : 'brand.800'}
                      borderRadius="md"
                      fontSize="xs"
                      fontWeight="semibold"
                    >
                      {tag.name}
                    </Box>
                  ))}
                </HStack>
              )}
            </VStack>
          </Grid>

          {/* Track List */}
          {tracks.length > 0 && (
            <Box>
              <Heading size="lg" mb={4}>
                Track List ({tracks.length} {tracks.length === 1 ? 'track' : 'tracks'})
              </Heading>
              <Box bg="cardBg" borderRadius="lg" p={4} border="1px" borderColor="cardBorder">
                <VStack align="stretch" gap={2}>
                  {tracks.map((track, index) => {
                    const trackName = typeof track === 'string' ? track : track.name;
                    const trackDuration =
                      typeof track === 'object' && track.duration
                        ? formatDuration(track.duration)
                        : '';
                    const trackNumber = typeof track === 'object' && track['@attr']?.rank
                      ? track['@attr'].rank
                      : (index + 1).toString();

                    return (
                      <Box
                        key={`${trackNumber}-${trackName}`}
                        py={2}
                        px={3}
                        borderRadius="md"
                        _hover={{ bg: colorMode === 'dark' ? 'gray.700' : 'gray.50' }}
                        borderBottom="1px"
                        borderColor="cardBorder"
                      >
                        <HStack justify="space-between">
                          <HStack gap={4}>
                            <Text fontSize="sm" color="textSecondary" minW="30px">
                              {trackNumber}.
                            </Text>
                            <Text fontWeight="medium" color="text">{trackName}</Text>
                          </HStack>
                          {trackDuration && (
                            <Text fontSize="sm" color="textSecondary">
                              {trackDuration}
                            </Text>
                          )}
                        </HStack>
                      </Box>
                    );
                  })}
                </VStack>
              </Box>
            </Box>
          )}

          {tracks.length === 0 && (
            <Box textAlign="center" py={8}>
              <Text color="textSecondary">No track information available for this album.</Text>
            </Box>
          )}
        </>
      )}
    </VStack>
  );
}
