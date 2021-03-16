import React from 'react';
import './App.css';
import { Box, CssBaseline, MuiThemeProvider } from '@material-ui/core';

import { Navbar } from './components/Navbar';
import { BrowserRouter } from 'react-router-dom';
import AppRoute from './routes/AppRoute';
import Breadcrumb from './components/Breadcrumb';
import theme from './theme';

function App() {
  return (
    <React.Fragment>
      <MuiThemeProvider theme={theme}>
        <CssBaseline/>
        <BrowserRouter>
          <Navbar />
          <Box paddingTop={'70px'}>
            <Breadcrumb/>
            <AppRoute />
          </Box>
        </BrowserRouter>
      </MuiThemeProvider>
    </React.Fragment>
  );
}

export default App;
