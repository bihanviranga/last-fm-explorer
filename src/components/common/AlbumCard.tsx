import { memo, useState, useMemo, useCallback } from 'react';
import { CardRoot, CardBody, Image, Heading, Text, Skeleton, Box } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { getBestImage, encodeArtistName, getPlaceholderImage } from '../../utils/helpers';
import type { Album } from '../../api/types';

interface AlbumCardProps {
  album: Album;
}

function AlbumCard({ album }: AlbumCardProps) {
  const navigate = useNavigate();
  const imageUrl = getBestImage(album.image);
  const [imgError, setImgError] = useState(false);
  const [imgLoading, setImgLoading] = useState(true);
  
  const artistName = useMemo(
    () => (typeof album.artist === 'string' ? album.artist : album.artist.name),
    [album.artist]
  );
  
  const albumYear = useMemo(
    () => (album.wiki?.published ? new Date(album.wiki.published).getFullYear() : null),
    [album.wiki]
  );

  const handleClick = useCallback(() => {
    navigate(`/album/${encodeArtistName(artistName)}/${encodeArtistName(album.name)}`);
  }, [navigate, artistName, album.name]);

  return (
    <CardRoot
      cursor="pointer"
      onClick={handleClick}
      _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }}
      transition="all 0.2s"
      h="100%"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`View album ${album.name} by ${artistName}`}
    >
      <Box position="relative" h="200px" w="100%" overflow="hidden">
        {imgLoading && !imgError && (
          <Skeleton
            position="absolute"
            top={0}
            left={0}
            w="100%"
            h="100%"
            zIndex={1}
          />
        )}
        <Image
          src={imgError ? getPlaceholderImage() : imageUrl}
          alt={album.name}
          fit="cover"
          h="200px"
          w="100%"
          onError={() => {
            setImgError(true);
            setImgLoading(false);
          }}
          onLoad={() => setImgLoading(false)}
          style={{
            opacity: imgLoading ? 0 : 1,
            transition: 'opacity 0.3s ease-in-out',
          }}
        />
      </Box>
      <CardBody>
        <Heading 
          size="md" 
          mb={2} 
          style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          title={album.name}
        >
          {album.name}
        </Heading>
        {albumYear && (
          <Text fontSize="sm" color="textSecondary">
            {albumYear}
          </Text>
        )}
      </CardBody>
    </CardRoot>
  );
}

export default memo(AlbumCard);

