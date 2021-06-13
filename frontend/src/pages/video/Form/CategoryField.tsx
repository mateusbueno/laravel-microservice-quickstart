// @flow 
import { FormControl, FormControlProps, FormHelperText, makeStyles, Theme, Typography } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import React, {MutableRefObject, RefAttributes, useImperativeHandle, useRef} from 'react';
import AsyncAutocomplete, { AsyncAutocompleteComponent } from '../../../components/AsyncAutocomplete';
import GridSelected from '../../../components/GridSelected';
import { GridSelectedItem } from '../../../components/GridSelectedItem';
import useCollectionManager from '../../../hooks/useCollectionManager';
import useHttpHandled from '../../../hooks/useHttpHandled';
import categoryHttp from '../../../util/http/category-http';
import { getGenresFromCategory } from '../../../util/model-filters';
import { Genre } from '../../../util/models';

const useStyles = makeStyles((theme: Theme) => ({
    genresSubtitle: {
        color: grey["800"],
        fontSize: '0.8rem'
    }
}))

interface CategoryFieldProps extends RefAttributes<CategoryFieldProps>{
    categories: any[];
    setCategories: (categories) => void;
    genres: Genre[];
    error: any;
    disabled?: boolean;
    FormControlProps?: FormControlProps
};

export interface CategoryFieldComponent {
    clear: () => void;
}
const CategoryField = React.forwardRef<CategoryFieldComponent, CategoryFieldProps>((props, ref) => {

    const classes = useStyles();
    const autocompleteHttp = useHttpHandled();
    const { categories, setCategories, genres, error, disabled } = props;
    const { addItem, removeItem } = useCollectionManager(categories, setCategories);
    const autocompleteRef = useRef() as MutableRefObject<AsyncAutocompleteComponent>;

    function fetchOptions(searchText) {
        return autocompleteHttp(
            categoryHttp
                .list({
                    queryParams: {
                        genres: genres.map(genre => genre.id).join(','),
                        all: ""
                    }
                })
        ).then(data => data.data)
    };

    useImperativeHandle(ref, () => ({
        clear: () => autocompleteRef.current.clear()
    }));

    return (
        <>
            <AsyncAutocomplete
                ref={autocompleteRef}
                fetchOptions={fetchOptions}
                AutoCompleteProps={{
                    autoSelect: true,
                    clearOnEscape: true,
                    freeSolo: false,
                    getOptionLabel: option => option.name,
                    onChange: (event, value) => addItem(value),
                    disabled: disabled === true || !genres.length
                }}
                TextFieldProps={{
                    label: 'Categorias',
                    error: error !== undefined
                }}
            />
            <FormControl
                margin={'normal'}
                fullWidth
                error={error !== undefined}
                disabled={disabled}
                {...props.FormControlProps}
            >
                <GridSelected>
                    {
                        categories.map((category, key) => {
                            const genresFromCategory = getGenresFromCategory(genres, category)
                                .map(genre => genre.name)
                                .join(',');
                            return (
                                <GridSelectedItem 
                                    key={key} 
                                    onDelete={
                                        () => removeItem(category)} 
                                        xs={12}
                                >
                                    <Typography noWrap={true}>{category.name}</Typography>
                                    <Typography noWrap={true} className={classes.genresSubtitle}>
                                        Genero: {genresFromCategory}
                                    </Typography>
                                </GridSelectedItem>
                            )
                        })
                    }

                </GridSelected>
                {
                    error && <FormHelperText>{error.message}</FormHelperText>
                }
            </FormControl>
        </>
    );
});

export default CategoryField;