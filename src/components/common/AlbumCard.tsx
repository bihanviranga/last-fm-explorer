import { memo, useState, useMemo, useCallback } from 'react';
import { CardRoot, CardBody, Image, Heading, Text } from '@chakra-ui/react';
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
    >
      <Image
        src={imgError ? getPlaceholderImage() : imageUrl}
        alt={album.name}
        fit="cover"
        h="200px"
        w="100%"
        onError={() => setImgError(true)}
      />
      <CardBody>
        <Heading size="md" mb={2} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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

