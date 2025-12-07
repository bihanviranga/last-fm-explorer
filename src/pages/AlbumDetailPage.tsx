import { useParams } from 'react-router-dom';
import { Box, Heading, Text } from '@chakra-ui/react';

export default function AlbumDetailPage() {
  const { artistName, albumName } = useParams<{ artistName: string; albumName: string }>();

  return (
    <Box>
      <Heading size="xl" mb={4}>
        {decodeURIComponent(albumName || '')}
      </Heading>
      <Text mb={2}>by {decodeURIComponent(artistName || '')}</Text>
      <Text>Album detail page will be implemented here</Text>
    </Box>
  );
}

