// @flow 
import React, { useEffect, useRef, useState } from 'react';

import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import categoryHttp from '../../util/http/category-http';
import { BadgeNo, BadgeYes } from '../../components/Badge';
import { Category, ListResponse } from '../../util/models';
import DefaultTable, { makeActionStyle, TableColumn } from '../../components/Table';
import { useSnackbar } from 'notistack';
import { IconButton, MuiThemeProvider } from '@material-ui/core';
import { Link } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import { FilterResetButton } from '../../components/Table/FilterResetButton';
import { Creators } from '../../store/filter';
import useFilter from '../../hooks/useFilter';

const columnsDefinition: TableColumn[] = [
    {
        name: "id",
        label: "ID",
        width: "33%",
        options: {
            sort: false
        }
    },
    {
        name: "name",
        label: "Nome",
        width: "40%"
    },
    {
        name: "is_active",
        label: "Ativo?",
        width: "4%",
        options: {
            customBodyRender(value, tableMeta, updateValue) {
                return value ? <BadgeYes /> : <BadgeNo />
            }
        }
    },
    {
        name: "created_at",
        label: "Criado em",
        width: "10%",
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
                            to={`/categories/${tableMeta.rowData[0]}/edit`}
                        >
                            <EditIcon />
                        </IconButton>
                    </span>
                )
            }
        }
    }
]

const Table = () => {

    const snackbar = useSnackbar();
    const subscribed = useRef(true);
    const [data, setData] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const {
        columns,
        filterManager,
        filterState,
        dispatch,
        totalRecords,
        setTotalRecords
    } = useFilter({
        columns: columnsDefinition,
        debounceTime: 500,
        rowsPerPage: 10,
        rowsPerPageOptions: [10, 25, 50]
    });

    useEffect(() => {
        subscribed.current = true;
        getData();
        return () => {
            subscribed.current = false;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        filterState.search,
        filterState.pagination.page,
        filterState.pagination.per_page,
        filterState.order,
    ]);

    async function getData() {
        setLoading(true);
        try {
            const { data } = await categoryHttp.list<ListResponse<Category>>({
                queryParams: {
                    search: cleanSearchText(filterState.search),
                    page: filterState.pagination.page,
                    per_page: filterState.pagination.per_page,
                    sort: filterState.order.sort,
                    dir: filterState.order.dir,
                }
            });
            if (subscribed.current) {
                setData(data.data);
                setTotalRecords(data.meta.total);
            }
        } catch (error) {
            console.error(error);
            if (categoryHttp.isCancelledRequest(error)) {
                return;
            }
            snackbar.enqueueSnackbar(
                'Nao foi possivel carregar as informacoes',
                { variant: 'error' }
            )
        } finally {
            setLoading(false);
        }
    }

    function cleanSearchText(text) {
        let newText = text;
        if (text && text.value !== undefined ) {
            newText = text.value
        }
        return newText;
    }
    return (
        <MuiThemeProvider theme={makeActionStyle(columnsDefinition.length - 1)}>
            <DefaultTable
                title="Listagem de categorias"
                columns={columns}
                data={data}
                loading={loading}
                debouncedSearchTime={500}
                options={
                    {
                        serverSide: true,
                        responsive: "standard",
                        searchText: filterState.search as any,
                        page: filterState.pagination.page - 1,
                        rowsPerPage: filterState.pagination.per_page,
                        count: totalRecords,
                        customToolbar: () => (
                            <FilterResetButton
                                handleClick={() => dispatch(Creators.setReset())}
                            />
                        ),
                        onSearchChange: (value: any) => filterManager.changeSearch(value),
                        onChangePage: (page: number) => filterManager.changePage(page),
                        onChangeRowsPerPage: (perPage: number) => filterManager.changeRowsPerPage(perPage),
                        onColumnSortChange: (changedColumn: string, direction: string) => filterManager.changeColumnSortChange(changedColumn, direction),
                    }
                }
            />
        </MuiThemeProvider>
    );
};

export default Table;