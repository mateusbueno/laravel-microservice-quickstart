import React from 'react';
import './App.css';
import { Box } from '@material-ui/core';

import { Navbar } from './components/Navbar';
import { BrowserRouter } from 'react-router-dom';
import AppRoute from './routes/AppRoute';
import Breadcrumb from './components/Breadcrumb';

function App() {
  return (
    <React.Fragment>
      <BrowserRouter>
        <Navbar />
        <Box paddingTop={'70px'}>
          <Breadcrumb/>
          <AppRoute />
        </Box>
      </BrowserRouter>

    </React.Fragment>
  );
}

export default App;
