import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ColorMode = 'light' | 'dark';

interface ColorModeState {
  colorMode: ColorMode;
  toggleColorMode: () => void;
  setColorMode: (mode: ColorMode) => void;
}

export const useColorModeStore = create<ColorModeState>()(
  persist(
    (set) => ({
      colorMode: 'light',
      toggleColorMode: () =>
        set((state) => ({
          colorMode: state.colorMode === 'light' ? 'dark' : 'light',
        })),
      setColorMode: (mode) => set({ colorMode: mode }),
    }),
    {
      name: 'color-mode-storage',
    }
  )
);

