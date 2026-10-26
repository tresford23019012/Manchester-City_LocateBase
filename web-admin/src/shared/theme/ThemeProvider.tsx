import { useEffect, useState, type ReactNode } from 'react';
import { ThemeContext, type Mode } from './ThemeContext';
import { lightTokens } from './light';
import { darkTokens } from './dark';

const STORAGE_KEY = 'locatebase-theme';

function initialMode(): Mode {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>(initialMode);

  useEffect(() => {
    const tokens = mode === 'dark' ? darkTokens : lightTokens;
    const root = document.documentElement;
    Object.entries(tokens).forEach(([key, value]) => {
      root.style.setProperty('--' + key.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase()), value);
    });
    root.dataset.theme = mode;
    root.style.colorScheme = mode;
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const toggle = () => setMode((m) => (m === 'light' ? 'dark' : 'light'));

  return <ThemeContext.Provider value={{ mode, toggle }}>{children}</ThemeContext.Provider>;
}