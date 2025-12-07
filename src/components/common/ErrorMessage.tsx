import { AlertRoot, AlertIndicator, AlertTitle, AlertDescription, AlertContent, Box } from '@chakra-ui/react';

interface ErrorMessageProps {
  title?: string;
  message: string;
}

export default function ErrorMessage({ title = 'Error', message }: ErrorMessageProps) {
  return (
    <Box py={4}>
      <AlertRoot status="error" borderRadius="md">
        <AlertIndicator />
        <AlertContent>
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </AlertContent>
      </AlertRoot>
    </Box>
  );
}

