import React, { createContext, useState, useMemo } from 'react';
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const ThemeContext = createContext();

export const CoresPadrao = {
  azulMarinho: '#1A237E',
  azulAcinzentado: '#5C6BC0',
  verde: '#00897B',
  laranja: '#F4511E',
  roxo: '#7B1FA2',
  rosa: '#D81B60',
};

const lightTheme = {
  ...MD3LightTheme,
  roundness: 3,
  colors: {
    ...MD3LightTheme.colors,
    primary: CoresPadrao.azulMarinho,
    secondary: CoresPadrao.azulAcinzentado,
    background: '#F5F7FA',
    surface: '#FFFFFF',
    surfaceVariant: '#EEF0F8',
    surfaceElevated: '#FFFFFF',
    primaryContainer: '#E8EAF6',
    secondaryContainer: '#E8EAF6',
    onPrimaryContainer: '#1A237E',
    outline: '#C5CAE9',
    outlineVariant: '#E8EAF6',
    shadow: '#000000',
    cardBorder: '#E8EAF6',
  },
};

const darkTheme = {
  ...MD3DarkTheme,
  roundness: 3,
  colors: {
    ...MD3DarkTheme.colors,
    primary: CoresPadrao.azulAcinzentado,
    secondary: CoresPadrao.azulMarinho,
    background: '#0D0D12',
    surface: '#1A1A24',
    surfaceVariant: '#252535',
    surfaceElevated: '#1F1F2E',
    primaryContainer: '#1A237E22',
    secondaryContainer: '#5C6BC022',
    onPrimaryContainer: '#C5CAE9',
    outline: '#2D2D45',
    outlineVariant: '#252535',
    cardBorder: '#2D2D45',
  },
};

export const ThemeProvider = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [coresAtuais, setCoresAtuais] = useState({
    primary: CoresPadrao.azulMarinho,
    secondary: CoresPadrao.azulAcinzentado,
  });

  const toggleTheme = () => setIsDarkTheme((v) => !v);

  const setPrimaryColor = (primary) => {
    const pairs = {
      [CoresPadrao.azulMarinho]: CoresPadrao.azulAcinzentado,
      [CoresPadrao.azulAcinzentado]: CoresPadrao.azulMarinho,
      [CoresPadrao.verde]: '#4DB6AC',
      [CoresPadrao.laranja]: '#FFAB91',
      [CoresPadrao.roxo]: '#CE93D8',
      [CoresPadrao.rosa]: '#F48FB1',
    };
    setCoresAtuais({ primary, secondary: pairs[primary] || CoresPadrao.azulAcinzentado });
  };

  const theme = useMemo(() => {
    const baseTheme = isDarkTheme ? darkTheme : lightTheme;
    return {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        primary: coresAtuais.primary,
        secondary: coresAtuais.secondary,
      },
    };
  }, [isDarkTheme, coresAtuais]);

  return (
    <ThemeContext.Provider value={{ toggleTheme, setPrimaryColor, isDarkTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};
