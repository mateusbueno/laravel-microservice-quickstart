// @flow 
import * as React from 'react';
import { Box, Fab } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Page } from '../../components/Page';
import { Add } from '@material-ui/icons';
import Table from './Table';

const PagList = () => {
    return (
       <Page title="Listagem videos">
           <Box dir={'rtl'} paddingBottom={2}>
            <Fab
                title="Adicionar video"
                color={'secondary'}
                size="small"
                component={Link}
                to="/videos/create"
            >
                <Add/>
            </Fab>
           </Box>
           <Box>
               <Table/>
           </Box>
       </Page>
    );
};

export default PagList;