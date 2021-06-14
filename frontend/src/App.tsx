import React from 'react';
import './App.css';
import { Box, CssBaseline, MuiThemeProvider } from '@material-ui/core';

import { Navbar } from './components/Navbar';
import { BrowserRouter } from 'react-router-dom';
import AppRoute from './routes/AppRoute';
import Breadcrumb from './components/Breadcrumb';
import theme from './theme';
import { SnackBarProvider } from './components/SnackBarProvider';
import Spinner from './components/Spinner';
import LoadingProvider from './components/loading/LoadingProvider';

function App() {
  return (
    <React.Fragment>
      <LoadingProvider>
        <MuiThemeProvider theme={theme}>
          <SnackBarProvider>
          <CssBaseline/>
          <BrowserRouter>
            <Spinner />
            <Navbar />
            <Box paddingTop={'70px'}>
              <Breadcrumb/>
              <AppRoute />
            </Box>
          </BrowserRouter>
          </SnackBarProvider>
        </MuiThemeProvider>
      </LoadingProvider>
    </React.Fragment>
  );
}

export default App;
