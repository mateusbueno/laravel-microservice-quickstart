// @flow 
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MuiThemeProvider, IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import { useSnackbar } from 'notistack';

import genreHttp from '../../util/http/genre-http';
import { Genre, ListResponse } from '../../util/models';
import DefaultTable, { makeActionStyle, TableColumn } from '../../components/Table';

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
        width: "25%"
    },
    {
        name: "categories",
        label: "Categorias",
        width: "20%",
        options: {
            customBodyRender(value, tableMeta, updateValue) {
                return value.map((value: any) => value.name).join(', ')
            }
        }
    }, 
    {
        name: "created_at",
        label: "Criado em",
        width: "20%",
        options: {
            customBodyRender(value, tableMeta, updateValue) {
                return <span>{format(parseISO(value), 'dd/MM/yyyy')}</span>
            }
        }
    },
    {
        name: "actions",
        label: "Ações",
        width: "15%",
        options: {
            customBodyRender(value, tableMeta, updateValue) {
                return (
                    <span>
                        <IconButton
                            color={'secondary'}
                            component={Link}
                            to={`/genres/${tableMeta.rowData[0]}/edit`}
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

    const snackbar = useSnackbar();
    const [data, setData] = useState<Genre[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        let isCancelled = false;
        (async function getGenres() {
            try {
                setLoading(true);
                const {data} = await genreHttp.list<ListResponse<Genre>>();
                if (!isCancelled) {
                    setData(data.data)
                }
            } catch (error) {
                console.error(error);
                snackbar.enqueueSnackbar(
                    'Nao foi possivel carregar as informacoes',
                    {variant: 'error'}
                )
            }
        })();
        return () => {
            isCancelled = true;
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <MuiThemeProvider theme={makeActionStyle(columnsDefinition.length-1)}>
            <DefaultTable 
                title="Listagem de generos"
                columns={columnsDefinition}
                data={data}
                loading={loading}
                options={{responsive: "standard"}}
            />
        </MuiThemeProvider>
    );
};

export default Table;