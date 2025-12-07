import { Link } from 'react-router-dom';
import { Box, Heading, Text, Button, VStack } from '@chakra-ui/react';

export default function NotFoundPage() {
  return (
    <Box
      minH="60vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      py={12}
      px={4}
    >
      <VStack gap={6} maxW="600px">
        <Heading size="2xl" color="text">
          404
        </Heading>
        <Heading size="lg" color="text">
          Page Not Found
        </Heading>
        <Text color="textSecondary" fontSize="lg">
          The page you're looking for doesn't exist or has been moved.
        </Text>
        <VStack gap={3} mt={4}>
          <Link to="/">
            <Button colorScheme="brand" size="lg">
              Go to Home
            </Button>
          </Link>
          <Button
            variant="outline"
            size="md"
            onClick={() => window.history.back()}
          >
            ← Go Back
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
}

