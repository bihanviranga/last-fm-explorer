import { Box, VStack, Text, Heading, Button } from '@chakra-ui/react';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon = '🎵',
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <Box
      textAlign="center"
      py={12}
      px={4}
      bg="cardBg"
      borderRadius="lg"
      border="1px"
      borderColor="cardBorder"
    >
      <VStack gap={4}>
        <Text fontSize="6xl" mb={2}>
          {icon}
        </Text>
        <Heading size="lg" color="text">
          {title}
        </Heading>
        <Text color="textSecondary" maxW="400px" mx="auto">
          {description}
        </Text>
        {actionLabel && onAction && (
          <Button onClick={onAction} colorScheme="brand" mt={4}>
            {actionLabel}
          </Button>
        )}
      </VStack>
    </Box>
  );
}

