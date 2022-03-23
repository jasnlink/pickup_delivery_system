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
      <PayPalScriptProvider options={{ "client-id": 'AR2qxEkod_ECVuOYG1bqm70SQ6kkIv4FKpPh2pTR6cVl0JyA_QyJdbASGExi9yVfDR8z3Sf4fmUHKfi5', currency: 'CAD' }} />
      <ThemeProvider theme={theme}>
        <Core />
      </ThemeProvider>
    </>
    )
}

export default App;
