import { Grid } from '@chakra-ui/react';
import SkeletonCard from './SkeletonCard';

interface SkeletonGridProps {
  count?: number;
  columns?: string;
}

export default function SkeletonGrid({ count = 6, columns = 'repeat(auto-fill, minmax(200px, 1fr))' }: SkeletonGridProps) {
  return (
    <Grid templateColumns={columns} gap={6} w="100%">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </Grid>
  );
}

