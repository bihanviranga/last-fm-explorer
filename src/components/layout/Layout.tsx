import { type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, Container, Heading, HStack } from '@chakra-ui/react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <Box minH="100vh" bg="gray.50">
      <Box as="header" bg="white" borderBottom="1px" borderColor="gray.200" py={4}>
        <Container maxW="container.xl">
          <HStack justify="space-between" align="center">
            <Link to="/">
              <Heading size="lg" color="brand.600">
                Last.fm Explorer
              </Heading>
            </Link>
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
          </HStack>
        </Container>
      </Box>

      <Box as="main" py={8} w="100%">
        <Container maxW="container.xl" w="100%">{children}</Container>
      </Box>
    </Box>
  );
}

