import { Box, Button } from '@chakra-ui/react';
import { useColorModeStore } from '../../store/useColorModeStore';

export default function ColorModeToggle() {
  const { colorMode, toggleColorMode } = useColorModeStore();

  return (
    <Button
      onClick={toggleColorMode}
      size="sm"
      variant="ghost"
      aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
    >
      {colorMode === 'light' ? '🌙' : '☀️'}
    </Button>
  );
}

