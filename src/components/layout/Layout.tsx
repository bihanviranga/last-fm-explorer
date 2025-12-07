import { type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, Container, Heading, HStack } from '@chakra-ui/react';
import { useColorModeStore } from '../../store/useColorModeStore';
import ColorModeToggle from '../common/ColorModeToggle';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { colorMode } = useColorModeStore();

  const bgPrimary = colorMode === 'dark' ? 'gray.900' : 'gray.50';
  const bgSecondary = colorMode === 'dark' ? 'gray.800' : 'white';
  const borderColor = colorMode === 'dark' ? 'gray.700' : 'gray.200';

  return (
    <Box minH="100vh" bg={bgPrimary}>
      <Box as="header" bg={bgSecondary} borderBottom="1px" borderColor={borderColor} py={4}>
        <Container maxW="container.xl">
          <HStack justify="space-between" align="center">
            <Link to="/">
              <Heading size="lg" color="brand.600">
                Last.fm Explorer
              </Heading>
            </Link>
            <HStack gap={4}>
              {!isHome && (
                <Link to="/">
                  <Box
                    as="span"
                    color="brand.600"
                    _hover={{ color: 'brand.700', textDecoration: 'underline' }}
                    cursor="pointer"
                  >
                    ← Back to Search
                  </Box>
                </Link>
              )}
              <ColorModeToggle />
            </HStack>
          </HStack>
        </Container>
      </Box>

      <Box as="main" py={8} w="100%">
        <Container maxW="container.xl" w="100%">{children}</Container>
      </Box>
    </Box>
  );
}

