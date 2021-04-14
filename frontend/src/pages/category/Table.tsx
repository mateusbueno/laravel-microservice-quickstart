// @flow 
import MUIDataTable, { MUIDataTableColumn } from 'mui-datatables';
import React, { useEffect, useState } from 'react';

import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import categoryHttp from '../../util/http/category-http';
import { BadgeNo, BadgeYes } from '../../components/Badge';

const columnsDefinition: MUIDataTableColumn[] = [
    {
        name: "name",
        label: "Nome"
    },
    {
        name: "is_active",
        label: "Ativo?",
        options: {
            customBodyRender(value, tableMeta, updateValue) {
                return value ? <BadgeYes/> : <BadgeNo/>
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
interface Category {
    id: string;
    name: string;
}

type Props = {
    
};
const Table = (props: Props) => {

    const [data, setData] = useState<Category[]>([]);

    useEffect(() => {
        let isSubscribed = true;
        (async function getCategories() {
            const {data} = await categoryHttp.list();
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
                title="Listagem de categorias"
                columns={columnsDefinition}
                data={data}
            />
        </div>
    );
};

export default Table;