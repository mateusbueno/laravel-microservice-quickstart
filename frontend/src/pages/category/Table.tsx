// @flow 
import MUIDataTable, { MUIDataTableColumn } from 'mui-datatables';
import React, { useEffect, useState } from 'react';
import { httpVideo } from '../../util/http';

const columnsDefinition: MUIDataTableColumn[] = [
    {
        name: "name",
        label: "Nome"
    },
    {
        name: "is_active",
        label: "Ativo?"
    }, 
    {
        name: "created_at",
        label: "Criado em"
    }
]

type Props = {
    
};
const Table = (props: Props) => {

    const [data, setData] = useState([]);

    useEffect(() => {
        httpVideo.get('categories').then(
            response => setData(response.data.data)
        )
    }, []);

    return (
        <div>
            <MUIDataTable 
                title="Listagem de categorias"
                columns={columnsDefinition}
                data={data}
            />
        </div>
    );
};

export default Table;