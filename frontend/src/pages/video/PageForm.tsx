// @flow 
import * as React from 'react';
import { useParams } from 'react-router';
import { Page } from '../../components/Page';
import { IUserRouteParams } from '../../util/models/interfaces';
import { Form } from './Form';

const PageForm = () => {
    const { id } = useParams<IUserRouteParams>();
    return (
        <Page title={ !id ? 'Criar video': 'Editar video'}>
            <Form/>
        </Page>
    );
};

export default PageForm;