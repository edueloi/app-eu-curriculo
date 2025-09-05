import React, { createContext, useState, useMemo } from 'react';
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const ThemeContext = createContext();

// 🎨 --- SUA NOVA PALETA DE CORES PADRÃO --- 🎨
export const CoresPadrao = {
  azulMarinho: '#1E2554',
  azulAcinzentado: '#6A86A1',
};

const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: CoresPadrao.azulMarinho,
    secondary: CoresPadrao.azulAcinzentado,
    background: '#F0F4F8',
    surface: '#FFFFFF',
    surfaceVariant: '#E7E9EF',
  },
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: CoresPadrao.azulAcinzentado,
    secondary: CoresPadrao.azulMarinho,
    background: '#121212',
    surface: '#1E1E1E',
    surfaceVariant: '#2A2A2A',
  },
};

export const ThemeProvider = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [coresAtuais, setCoresAtuais] = useState({
    primary: CoresPadrao.azulMarinho,
    secondary: CoresPadrao.azulAcinzentado,
  });

  const toggleTheme = () => setIsDarkTheme(!isDarkTheme);

  // Função setPrimaryColor atualizada para também definir a cor secundária
  const setPrimaryColor = (primary) => {
    let secondary = CoresPadrao.azulAcinzentado;
    if (primary === CoresPadrao.azulAcinzentado) {
      secondary = CoresPadrao.azulMarinho;
    }
    setCoresAtuais({ primary, secondary });
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