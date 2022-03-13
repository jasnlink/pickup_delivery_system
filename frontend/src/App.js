import React from 'react';
import Core from './components/Core';

//responsive font size
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material/styles';


function App() {

  //create responsive font size theme
  let theme = createTheme();
  theme = responsiveFontSizes(theme);

  return (
      <ThemeProvider theme={theme}>
        <Core />
      </ThemeProvider>
    )
}

export default App;
