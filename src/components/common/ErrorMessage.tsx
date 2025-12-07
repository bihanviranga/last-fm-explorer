import { AlertRoot, AlertIndicator, AlertTitle, AlertDescription, AlertContent, Box, Button, HStack } from '@chakra-ui/react';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export default function ErrorMessage({ 
  title = 'Error', 
  message, 
  onRetry,
  retryLabel = 'Retry'
}: ErrorMessageProps) {
  return (
    <Box py={4}>
      <AlertRoot status="error" borderRadius="md">
        <AlertIndicator />
        <AlertContent>
          <HStack justify="space-between" align="flex-start" w="100%">
            <Box flex={1}>
              <AlertTitle>{title}</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Box>
            {onRetry && (
              <Button
                size="sm"
                colorScheme="red"
                variant="outline"
                onClick={onRetry}
                ml={4}
              >
                {retryLabel}
              </Button>
            )}
          </HStack>
        </AlertContent>
      </AlertRoot>
    </Box>
  );
}

