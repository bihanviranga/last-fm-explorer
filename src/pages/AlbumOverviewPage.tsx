import { useParams } from 'react-router-dom';
import { Box, Heading, Text } from '@chakra-ui/react';

export default function AlbumOverviewPage() {
  const { artistName } = useParams<{ artistName: string }>();

  return (
    <Box>
      <Heading size="xl" mb={4}>
        Albums by {decodeURIComponent(artistName || '')}
      </Heading>
      <Text>Album overview page will be implemented here</Text>
    </Box>
  );
}

