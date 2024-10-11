import React, { createContext, useContext, useState } from 'react';
import themeConfig from './theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(themeConfig);

  const updateTheme = (newTheme) => {
    setTheme((prevTheme) => ({
      ...prevTheme,
      ...newTheme,
    }));
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);