import { CardRoot, CardBody, Image, Heading, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { getBestImage, encodeArtistName, getPlaceholderImage } from '../../utils/helpers';
import { useColorModeStore } from '../../store/useColorModeStore';
import type { Artist } from '../../api/types';
import { useState } from 'react';

interface ArtistCardProps {
  artist: Artist;
}

export default function ArtistCard({ artist }: ArtistCardProps) {
  const navigate = useNavigate();
  const imageUrl = getBestImage(artist.image);
  const [imgError, setImgError] = useState(false);
  const { colorMode } = useColorModeStore();
  const textSecondary = colorMode === 'dark' ? 'gray.400' : 'gray.600';

  const handleClick = () => {
    navigate(`/artist/${encodeArtistName(artist.name)}/albums`);
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
        src={imgError ? getPlaceholderImage() : imageUrl}
        alt={artist.name}
        fit="cover"
        h="200px"
        w="100%"
        onError={() => setImgError(true)}
      />
      <CardBody>
        <Heading size="md" mb={2} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {artist.name}
        </Heading>
        {artist.listeners && (
          <Text fontSize="sm" color={textSecondary}>
            {parseInt(artist.listeners, 10).toLocaleString()} listeners
          </Text>
        )}
      </CardBody>
    </CardRoot>
  );
}

