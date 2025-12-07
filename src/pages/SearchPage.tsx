import { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Heading,
  Input,
  InputGroup,
  Grid,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useSearchStore } from '../store/useSearchStore';
import { useAppStore } from '../store/useAppStore';
import { searchArtist, getTopArtists, getTopTracks } from '../api/lastfm';
import ArtistCard from '../components/common/ArtistCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { results, isLoading, error, setQuery, setResults, setLoading, setError, clearSearch } =
    useSearchStore();
  const {
    popularContent,
    setTopArtists,
    setTopTracks,
    setPopularContentLoading,
    setPopularContentError,
  } = useAppStore();

  // Handle search
  const handleSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        clearSearch();
        return;
      }

      setQuery(query);
      setLoading(true);
      setError(null);

      try {
        const response = await searchArtist(query, 30, 1);
        const artists = response.artistmatches?.artist
          ? Array.isArray(response.artistmatches.artist)
            ? response.artistmatches.artist
            : [response.artistmatches.artist]
          : [];

        setResults(artists);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to search artists');
      }
    },
    [setQuery, setResults, setLoading, setError, clearSearch]
  );

  // Load popular content on mount
  useEffect(() => {
    const loadPopularContent = async () => {
      if (popularContent.topArtists.length > 0) {
        return; // Already loaded
      }

      setPopularContentLoading(true);
      try {
        const [artistsResponse, tracksResponse] = await Promise.all([
          getTopArtists(20, 1),
          getTopTracks(20, 1),
        ]);

        const artists = Array.isArray(artistsResponse.artists.artist)
          ? artistsResponse.artists.artist
          : [artistsResponse.artists.artist];
        const tracks = Array.isArray(tracksResponse.tracks.track)
          ? tracksResponse.tracks.track
          : [tracksResponse.tracks.track];

        setTopArtists(artists);
        setTopTracks(tracks);
      } catch (err) {
        setPopularContentError(
          err instanceof Error ? err.message : 'Failed to load popular content'
        );
      } finally {
        setPopularContentLoading(false);
      }
    };

    loadPopularContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced search with cancellation
  useEffect(() => {
    let cancelled = false;
    const timeoutId = setTimeout(() => {
      if (!cancelled) {
        handleSearch(searchQuery);
      }
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [searchQuery, handleSearch]);

  const displayArtists = results.length > 0 ? results : popularContent.topArtists;
  const showPopular = results.length === 0 && !isLoading && !error;

  return (
    <VStack gap={6} align="stretch" w="100%">
      <Box>
        <Heading size="xl" mb={2}>
          {showPopular ? 'Popular Artists' : 'Search Results'}
        </Heading>
        <Text color="textSecondary" mb={4}>
          {showPopular
            ? 'Discover popular artists on Last.fm'
            : `Found ${results.length} artist${results.length !== 1 ? 's' : ''}`}
        </Text>
      </Box>

      <InputGroup startElement={<Text fontSize="lg" color="textPlaceholder">🔍</Text>} w="100%">
        <Input
          placeholder="Search for artists..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          bg="inputBg"
          size="lg"
          color="inputText"
        />
      </InputGroup>

      {isLoading && <LoadingSpinner />}

      {error && <ErrorMessage message={error} />}

      {!isLoading && !error && displayArtists.length > 0 && (
        <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={6} w="100%">
          {displayArtists.map((artist) => (
            <ArtistCard key={artist.name} artist={artist} />
          ))}
        </Grid>
      )}

      {!isLoading && !error && displayArtists.length === 0 && searchQuery && (
        <Box textAlign="center" py={8}>
          <Text color="textSecondary">No artists found. Try a different search term.</Text>
        </Box>
      )}
    </VStack>
  );
}
