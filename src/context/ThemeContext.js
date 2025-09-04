import React, { createContext, useState, useMemo } from 'react';
import { MD3LightTheme as LightTheme, MD3DarkTheme as DarkTheme } from 'react-native-paper';

export const ThemeContext = createContext();

const lightTheme = {
  ...LightTheme,
  colors: { ...LightTheme.colors, primary: '#6200ee', accent: '#03dac4' },
};
const darkTheme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, primary: '#bb86fc', accent: '#03dac4' },
};

export const ThemeProvider = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('#6200ee');

  const toggleTheme = () => setIsDarkTheme(!isDarkTheme);

  const theme = useMemo(() => {
    const baseTheme = isDarkTheme ? darkTheme : lightTheme;
    return { ...baseTheme, colors: { ...baseTheme.colors, primary: primaryColor } };
  }, [isDarkTheme, primaryColor]);

  return (
    <ThemeContext.Provider value={{ toggleTheme, setPrimaryColor, isDarkTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};
