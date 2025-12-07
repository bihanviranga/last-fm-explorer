import { Spinner, Box } from '@chakra-ui/react';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export default function LoadingSpinner({ size = 'xl' }: LoadingSpinnerProps) {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" py={8}>
      <Spinner size={size} color="brand.500" />
    </Box>
  );
}

