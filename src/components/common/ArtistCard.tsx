import { memo, useState } from 'react';
import { CardRoot, CardBody, Image, Heading, Text, Skeleton, Box } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { getBestImage, encodeArtistName, getPlaceholderImage } from '../../utils/helpers';
import type { Artist } from '../../api/types';

interface ArtistCardProps {
  artist: Artist;
}

function ArtistCard({ artist }: ArtistCardProps) {
  const navigate = useNavigate();
  const imageUrl = getBestImage(artist.image);
  const [imgError, setImgError] = useState(false);
  const [imgLoading, setImgLoading] = useState(true);

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
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`View albums by ${artist.name}`}
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
          alt={artist.name}
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
          title={artist.name}
        >
          {artist.name}
        </Heading>
        {artist.listeners && (
          <Text fontSize="sm" color="textSecondary">
            {parseInt(artist.listeners, 10).toLocaleString()} listeners
          </Text>
        )}
      </CardBody>
    </CardRoot>
  );
}

export default memo(ArtistCard);

