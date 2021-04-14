// @flow 
import MUIDataTable, { MUIDataTableColumn } from 'mui-datatables';
import React, { useEffect, useState } from 'react';

import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import genreHttp from '../../util/http/genre-http';

const columnsDefinition: MUIDataTableColumn[] = [
    {
        name: "name",
        label: "Nome"
    },
    {
        name: "categories",
        label: "Categorias",
        options: {
            customBodyRender(value, tableMeta, updateValue) {
                return value.map((value: any) => value.name).join(', ')
            }
        }
    }, 
    {
        name: "created_at",
        label: "Criado em",
        options: {
            customBodyRender(value, tableMeta, updateValue) {
                return <span>{format(parseISO(value), 'dd/MM/yyyy')}</span>
            }
        }
    }
]

type Props = {
    
};
const Table = (props: Props) => {

    const [data, setData] = useState([]);

    useEffect(() => {
        let isCancelled = false;
        (async function getGenres() {
            const {data} = await genreHttp.list();
            if (!isCancelled) {
                setData(data.data)
            }
        })();
        return () => {
            isCancelled = true;
        }
    }, []);

    return (
        <div>
            <MUIDataTable 
                title="Listagem de generos"
                columns={columnsDefinition}
                data={data}
            />
        </div>
    );
};

export default Table;