import React, { createContext, useState, useContext, useMemo } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

const ThemeContext = createContext();

export const useThemeMode = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                // Modo Claro - Colores rosados/lavanda
                primary: {
                  main: '#9b8dc4', // Lavanda
                  light: '#c5b8e3',
                  dark: '#7565a8',
                },
                secondary: {
                  main: '#d4a5d4', // Rosa lavanda
                  light: '#e8c5e8',
                  dark: '#b885b8',
                },
                background: {
                  default: '#e8dff5', // Fondo lavanda muy claro
                  paper: '#f5f0fb', // Fondo de tarjetas
                },
                text: {
                  primary: '#4a3869', // Texto oscuro morado
                  secondary: '#6b5888',
                },
              }
            : {
                // Modo Oscuro - Tonos morados oscuros
                primary: {
                  main: '#8b7ab8', // Morado medio
                  light: '#a999cc',
                  dark: '#6a5a95',
                },
                secondary: {
                  main: '#b59bb8', // Rosa morado
                  light: '#ccb3cc',
                  dark: '#9980a0',
                },
                background: {
                  default: '#2e2640', // Fondo morado muy oscuro
                  paper: '#3d3354', // Fondo de tarjetas morado oscuro
                },
                text: {
                  primary: '#e8dff5', // Texto claro lavanda
                  secondary: '#c5b8e3',
                },
              }),
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
