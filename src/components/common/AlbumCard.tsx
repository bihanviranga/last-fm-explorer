import { CardRoot, CardBody, Image, Heading, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { getBestImage, encodeArtistName } from '../../utils/helpers';
import type { Album } from '../../api/types';
import { useState } from 'react';

interface AlbumCardProps {
  album: Album;
}

export default function AlbumCard({ album }: AlbumCardProps) {
  const navigate = useNavigate();
  const imageUrl = getBestImage(album.image);
  const [imgError, setImgError] = useState(false);
  
  const artistName = typeof album.artist === 'string' ? album.artist : album.artist.name;
  const albumYear = album.wiki?.published 
    ? new Date(album.wiki.published).getFullYear() 
    : null;

  const handleClick = () => {
    navigate(`/album/${encodeArtistName(artistName)}/${encodeArtistName(album.name)}`);
  };

  return (
    <CardRoot
      cursor="pointer"
      onClick={handleClick}
      _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }}
      transition="all 0.2s"
      h="100%"
    >
      <Image
        src={imgError ? 'https://via.placeholder.com/300x300?text=No+Image' : imageUrl}
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
          <Text fontSize="sm" color="gray.600">
            {albumYear}
          </Text>
        )}
      </CardBody>
    </CardRoot>
  );
}

