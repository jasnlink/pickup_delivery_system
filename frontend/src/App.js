import React from 'react';
import Core from './components/Core';

//responsive font size
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material/styles';

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";


function App() {

  //create responsive font size theme
  let theme = createTheme();
  theme = responsiveFontSizes(theme);

  return (
    <>
      <PayPalScriptProvider options={{ "client-id": process.env.REACT_APP_PAYPAL_API_KEY }} />
      <ThemeProvider theme={theme}>
        <Core />
      </ThemeProvider>
    </>
    )
}

export default App;
