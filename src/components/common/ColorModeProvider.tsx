import { useEffect } from 'react';
import { useColorModeStore } from '../../store/useColorModeStore';
import { type ReactNode } from 'react';

interface ColorModeProviderProps {
  children: ReactNode;
}

export default function ColorModeProvider({ children }: ColorModeProviderProps) {
  const { colorMode } = useColorModeStore();

  useEffect(() => {
    // Apply color mode class to document root
    const root = document.documentElement;
    if (colorMode === 'dark') {
      root.classList.add('chakra-ui-dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('chakra-ui-dark');
      root.style.colorScheme = 'light';
    }
  }, [colorMode]);

  // Apply on mount to prevent flash
  useEffect(() => {
    const root = document.documentElement;
    const { colorMode: initialMode } = useColorModeStore.getState();
    if (initialMode === 'dark') {
      root.classList.add('chakra-ui-dark');
      root.style.colorScheme = 'dark';
    }
  }, []);

  return <>{children}</>;
}

