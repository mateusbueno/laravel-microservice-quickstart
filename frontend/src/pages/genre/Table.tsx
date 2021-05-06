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
import { Category, Genre, ListResponse } from '../../util/models';
import DefaultTable, { makeActionStyle, MuiDataTableRefComponent, TableColumn } from '../../components/Table';
import useFilter from '../../hooks/useFilter';
import { FilterResetButton } from '../../components/Table/FilterResetButton';
import * as yup from '../../util/vendor/yup';
import categoryHttp from '../../util/http/category-http';

const columnsDefinition: TableColumn[] = [
    {
        name: "id",
        label: "ID",
        width: "20%",
        options: {
            sort: false,
            filter: false,
        }
    },
    {
        name: "name",
        label: "Nome",
        width: "25%",
        options: {
            filter: false,
        }
    },
    {
        name: "categories",
        label: "Categorias",
        width: "20%",
        options: {
            filterType: 'multiselect',
            filterOptions:{
                names: []
            },
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
            filter: false,
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
            filter: false,
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
    const [categories, setCategories] = useState<Category[]>([]);
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

    const indexColumnCategories = columns.findIndex(c => c.name === 'categories');
    const columnCategories = columns[indexColumnCategories];
    const categoriesFilterValue = filterState.extraFilter && filterState.extraFilter.categories;
    (columnCategories.options as any).filterList = categoriesFilterValue ? categoriesFilterValue : [];

    const serverSideFilterList = columns.map(column => []);
    if (categoriesFilterValue) {
        serverSideFilterList[indexColumnCategories] = categoriesFilterValue;
    }

    useEffect(() => {
        let isSubscribed = true;

        (async () => {
            try {
               const {data} = await categoryHttp.list({queryParams: {all: ''}});
               if (isSubscribed) {
                   setCategories(data.data);
                   console.log(categories);
                   (columnCategories.options as any).filterOptions.names = data.data.map(category => category.name);
               } 
            } catch (error) {
                console.error(error);
                snackbar.enqueueSnackbar(
                    'Nao foi possivel carregar as informacoes',
                    { variant: 'error' }
                )
            }
        })();

        return () => {
            isSubscribed = false;
        }
    })

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
        JSON.stringify(debouncedFilterState.extraFilter)
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
                    ...(
                        debouncedFilterState.extraFilter &&
                        debouncedFilterState.extraFilter.categories &&
                        {categories: debouncedFilterState.extraFilter.categories.join(',')}
                    )
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
                        serverSideFilterList,
                        serverSide: true,
                        responsive: "scrollMaxHeight",
                        searchText: filterState.search as any,
                        page: filterState.pagination.page - 1,
                        rowsPerPage: filterState.pagination.per_page,
                        rowsPerPageOptions,
                        count: totalRecords,
                        onFilterChange: (column, FilterList) => {
                            const columnIndex = columns.findIndex(c => c.name === column);
                            filterManager.changeExtraFilter({
                                [column]: FilterList[columnIndex].length ? FilterList[columnIndex] : null
                            })
                        },
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