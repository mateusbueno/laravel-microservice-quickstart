// @flow 
import MUIDataTable, { MUIDataTableColumn } from 'mui-datatables';
import React, { useEffect, useState } from 'react';

import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import castMemberHttp from '../../util/http/cast-member-http';

const CastMemberTypeMap = {
    0: 'Diretor',
    1: 'Ator'
}

const columnsDefinition: MUIDataTableColumn[] = [
    {
        name: "name",
        label: "Nome"
    },
    {
        name: "type",
        label: "Tipo",
        options: {
            customBodyRender: (value, tableMeta, updateValue) => {
                return CastMemberTypeMap[value];
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
        let isSubscribed = true;
        (async function getCastMembers() {
            const {data} = await castMemberHttp.list();
            if (isSubscribed) {
                setData(data.data)
            }
        })();
        return () => {
            isSubscribed = false;
        }
    }, []);

    return (
        <div>
            <MUIDataTable 
                title="Listagem de membros de elenco"
                columns={columnsDefinition}
                data={data}
            />
        </div>
    );
};

export default Table;