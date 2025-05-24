import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { colors, darkColors } from '@/constants/colors';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: typeof colors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>(systemColorScheme || 'light');

  useEffect(() => {
    if (systemColorScheme) {
      setTheme(systemColorScheme);
    }
  }, [systemColorScheme]);

  const toggleTheme = () => {
    setTheme(current => (current === 'light' ? 'dark' : 'light'));
  };

  const currentColors = theme === 'dark' ? darkColors : colors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors: currentColors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}