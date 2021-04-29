// @flow 
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IconButton, MuiThemeProvider } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import { useSnackbar } from 'notistack';

import castMemberHttp from '../../util/http/cast-member-http';
import { CastMember, ListResponse } from '../../util/models';
import DefaultTable, { makeActionStyle, TableColumn } from '../../components/Table';

const CastMemberTypeMap = {
    0: 'Diretor',
    1: 'Ator'
}

const columnsDefinition: TableColumn[] = [
    {
        name: "id",
        label: "ID",
        width: "20%",
        options: {
            sort: false
        }
    },
    {
        name: "name",
        label: "Nome",
        width: "25%",
    },
    {
        name: "type",
        label: "Tipo",
        width: "25%",
        options: {
            customBodyRender: (value, tableMeta, updateValue) => {
                return CastMemberTypeMap[value];
            }
        }
    },
    {
        name: "created_at",
        label: "Criado em",
        width: "17%",
        options: {
            customBodyRender(value, tableMeta, updateValue) {
                return <span>{format(parseISO(value), 'dd/MM/yyyy')}</span>
            }
        }
    },
    {
        name: "actions",
        label: "Ações",
        width: "13%",
        options: {
            customBodyRender(value, tableMeta, updateValue) {
                return (
                    <span>
                        <IconButton
                            color={'secondary'}
                            component={Link}
                            to={`/cast-members/${tableMeta.rowData[0]}/edit`}
                        >
                            <EditIcon/>
                        </IconButton>
                    </span>
                )
            }
        }
    }
]
const Table = () => {

    const [data, setData] = useState<CastMember[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const snackbar = useSnackbar();

    useEffect(() => {
        let isSubscribed = true;
        (async function getCastMembers() {
            try {
                setLoading(true);
                const {data} = await castMemberHttp.list<ListResponse<CastMember>>();
                if (isSubscribed) {
                    setData(data.data)
                }
            } catch (error) {
                console.error(error);
                snackbar.enqueueSnackbar(
                    'Nao foi possivel carregar as informacoes',
                    {variant: 'error'}
                )
            } finally {
                setLoading(false);
            }
            
        })();
        return () => {
            isSubscribed = false;
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <MuiThemeProvider theme={makeActionStyle(columnsDefinition.length-1)}>
            <DefaultTable 
                title="Listagem de membros de elenco"
                columns={columnsDefinition}
                data={data}
                loading={loading}
                options={{responsive: "standard"}}
            />
        </MuiThemeProvider>
    );
};

export default Table;