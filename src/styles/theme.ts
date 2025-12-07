import { createSystem, defaultConfig, defineConfig, defineTokens, defineSemanticTokens } from '@chakra-ui/react';

const customConfig = defineConfig({
  theme: {
    tokens: defineTokens({
      colors: {
        brand: {
          50: { value: '#f0f9ff' },
          100: { value: '#e0f2fe' },
          200: { value: '#bae6fd' },
          300: { value: '#7dd3fc' },
          400: { value: '#38bdf8' },
          500: { value: '#0ea5e9' },
          600: { value: '#0284c7' },
          700: { value: '#0369a1' },
          800: { value: '#075985' },
          900: { value: '#0c4a6e' },
        },
      },
    }),
    semanticTokens: defineSemanticTokens({
      colors: {
        bg: {
          primary: {
            value: { base: '{colors.gray.50}', _dark: '{colors.gray.900}' },
          },
          secondary: {
            value: { base: '{colors.white}', _dark: '{colors.gray.800}' },
          },
        },
        text: {
          primary: {
            value: { base: '{colors.gray.900}', _dark: '{colors.gray.100}' },
          },
          secondary: {
            value: { base: '{colors.gray.600}', _dark: '{colors.gray.400}' },
          },
        },
        border: {
          default: {
            value: { base: '{colors.gray.200}', _dark: '{colors.gray.700}' },
          },
        },
      },
    }),
  },
});

const system = createSystem(defaultConfig, customConfig);

export default system;

