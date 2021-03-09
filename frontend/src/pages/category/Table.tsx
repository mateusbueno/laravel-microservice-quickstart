// @flow 
import MUIDataTable, { MUIDataTableColumn } from 'mui-datatables';
import * as React from 'react';

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

const data  = [
    {name: "test1", is_active: true, createad: "2021-12-12"},
    {name: "test2", is_active: false, createad: "2021-01-12"},
    {name: "test3", is_active: true, createad: "2021-03-12"},
    {name: "test4", is_active: true, createad: "2021-05-12"},
    {name: "test5", is_active: true, createad: "2021-04-12"},
]

type Props = {
    
};
const Table = (props: Props) => {
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