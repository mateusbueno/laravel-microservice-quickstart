// @flow 
import { Typography } from '@material-ui/core';
import * as React from 'react';
import AsyncAutocomplete from '../../../components/AsyncAutocomplete';
import GridSelected from '../../../components/GridSelected';
import { GridSelectedItem } from '../../../components/GridSelectedItem';
import useCollectionManager from '../../../hooks/useCollectionManager';
import useHttpHandled from '../../../hooks/useHttpHandled';
import categoryHttp from '../../../util/http/category-http';
import { Genre } from '../../../util/models';

interface CategoryFieldProps {
    categories: any[];
    setCategories: (categories) => void;
    genres: Genre[]
};
const CategoryField: React.FC<CategoryFieldProps> = (props) => {

    const autocompleteHttp = useHttpHandled();
    const { categories, setCategories, genres } = props;
    const { addItem } = useCollectionManager(categories, setCategories);

    const fetchOptions = () => autocompleteHttp(
        categoryHttp.list({
            queryParams: {
                genres: genres.map(genre => genre.id).join(','), 
                all: ''
            },
        })
    )
        .then((data) => data.data)
        .catch((error) => console.log(error));

    return (
        <>
            <AsyncAutocomplete
                fetchOptions={fetchOptions}
                AutoCompleteProps={{
                    freeSolo: false,
                    getOptionLabel: option => option.name,
                    onChange: (event, value) => addItem(value),
                    disabled: !genres.length
                }}
                TextFieldProps={{
                    label: 'Category'
                }}
            />
            <GridSelected>
                {
                    categories.map((category, key) => (
                        <GridSelectedItem key={key} onClick={() => console.log('clicou!')} xs={12}>
                            <Typography>{category.name}</Typography>
                        </GridSelectedItem>
                    ))
                }

            </GridSelected>
        </>
    );
};

export default CategoryField;