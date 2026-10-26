import { createContext } from 'react';

export type Mode = 'light' | 'dark';

export interface ThemeContextValue {
  mode: Mode;
  toggle: () => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  mode: 'light',
  toggle: () => {},
});