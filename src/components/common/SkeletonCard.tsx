import { Box, Skeleton } from '@chakra-ui/react';

interface SkeletonCardProps {
  h?: string;
}

export default function SkeletonCard({ h = '300px' }: SkeletonCardProps) {
  return (
    <Box
      bg="cardBg"
      border="1px"
      borderColor="cardBorder"
      borderRadius="md"
      overflow="hidden"
      h={h}
    >
      <Skeleton h="200px" w="100%" />
      <Box p={4}>
        <Skeleton h="20px" w="80%" mb={2} />
        <Skeleton h="16px" w="60%" />
      </Box>
    </Box>
  );
}

