import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from './theme';

const ThemeContext = createContext(lightTheme);

export const ThemeProvider = ({ children } : any) => {

  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState(systemColorScheme === 'dark' ? darkTheme : lightTheme);

  useEffect(() => {
    setTheme(systemColorScheme === 'dark' ? darkTheme : lightTheme);
  }, [systemColorScheme]);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}


export const useTheme = () => {
    return useContext(ThemeContext);
};