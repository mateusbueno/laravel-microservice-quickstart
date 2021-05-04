/* eslint-disable react-hooks/exhaustive-deps */
// @flow 
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MuiThemeProvider, IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import { useSnackbar } from 'notistack';

import genreHttp from '../../util/http/genre-http';
import { Genre, ListResponse } from '../../util/models';
import DefaultTable, { makeActionStyle, MuiDataTableRefComponent, TableColumn } from '../../components/Table';
import useFilter from '../../hooks/useFilter';
import { FilterResetButton } from '../../components/Table/FilterResetButton';
import * as yup from '../../util/vendor/yup';

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

const debouncedTime = 300;
const debouncedSearchTime = 300;
const rowsPerPage = 15;
const rowsPerPageOptions = [15, 25, 50];

const Table = () => {

    const snackbar = useSnackbar();
    const subscribed = useRef(true);
    const [data, setData] = useState<Genre[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const tableRef = useRef() as React.MutableRefObject<MuiDataTableRefComponent>;

    const {
        columns,
        filterManager,
        filterState,
        debouncedFilterState,
        totalRecords,
        setTotalRecords,
    } = useFilter({
        columns: columnsDefinition,
        debounceTime: debouncedTime,
        rowsPerPage,
        rowsPerPageOptions,
        tableRef,
        extraFilter: {
            createValidationSchema: () => {
                return yup.object().shape({
                    categories: yup.mixed()
                        .nullable()
                        .transform( value => {
                            return !value || value === '' ? undefined : value.split(',');
                        })
                        .default(null)
                })
            },
            formatSearchParams: (debouncedState) => {
                return debouncedState.extraFilter ? {
                    ...(
                        debouncedState.extraFilter.categories &&
                        {categories: debouncedState.extraFilter.categories.join(',')}
                    )
                } : undefined
            },
            getStateFromURL: (queryParams) => {
                return {
                    categories: queryParams.get('categories')
                }
            }
        }
    });

    useEffect(() => {
        filterManager.replaceHistory();
    }, []);

    useEffect(() => {
        subscribed.current = true;
        filterManager.pushHistory();
        getData();
        return () => {
            subscribed.current = false;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        filterManager.cleanSearchText(debouncedFilterState.search),
        debouncedFilterState.pagination.page,
        debouncedFilterState.pagination.per_page,
        debouncedFilterState.order,
    ]);

    async function getData() {
        setLoading(true);
        try {
            const { data } = await genreHttp.list<ListResponse<Genre>>({
                queryParams: {
                    search: filterManager.cleanSearchText(filterState.search),
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
            if (genreHttp.isCancelledRequest(error)) {
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

    return (
        <MuiThemeProvider theme={makeActionStyle(columnsDefinition.length-1)}>
            <DefaultTable 
                title="Listagem de generos"
                columns={columnsDefinition}
                data={data}
                loading={loading}
                debouncedSearchTime={debouncedSearchTime}
                ref={tableRef}
                options={
                    {
                        serverSide: true,
                        responsive: "standard",
                        searchText: filterState.search as any,
                        page: filterState.pagination.page - 1,
                        rowsPerPage: filterState.pagination.per_page,
                        rowsPerPageOptions,
                        count: totalRecords,
                        customToolbar: () => (
                            <FilterResetButton
                                handleClick={() => filterManager.resetFilter()}
                            />
                        ),
                        onSearchChange: (value: any) => filterManager.changeSearch(value),
                        onChangePage: (page: number) => filterManager.changePage(page),
                        onChangeRowsPerPage: (perPage: number) => filterManager.changeRowsPerPage(perPage),
                        onColumnSortChange: (changedColumn: string, direction: string) => filterManager.changeColumnSort(changedColumn, direction),
                    }
                }
            />
        </MuiThemeProvider>
    );
};

export default Table;