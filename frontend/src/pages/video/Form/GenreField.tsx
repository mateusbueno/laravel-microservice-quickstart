// @flow 
import { FormControl, FormControlProps, FormHelperText, Typography } from '@material-ui/core';
import React, {MutableRefObject, RefAttributes, useImperativeHandle, useRef} from 'react';
import AsyncAutocomplete, { AsyncAutocompleteComponent } from '../../../components/AsyncAutocomplete';
import GridSelected from '../../../components/GridSelected';
import { GridSelectedItem } from '../../../components/GridSelectedItem';
import useCollectionManager from '../../../hooks/useCollectionManager';
import useHttpHandled from '../../../hooks/useHttpHandled';
import genreHttp from '../../../util/http/genre-http';
import { getGenresFromCategory } from '../../../util/model-filters';
import { Category } from '../../../util/models';

interface GenreFieldProps extends RefAttributes<GenreFieldProps>{
    genres: any[];
    setGenres: (genres) => void;
    error: any;
    categories: Category[];
    setCategories: (categories) => void;
    disabled?: boolean;
    FormControlProps?: FormControlProps
};

export interface GenreFieldComponent {
    clear: () => void;
}

const GenreField = React.forwardRef<GenreFieldComponent, GenreFieldProps>((props, ref) => {
    const { 
            genres, 
            setGenres, 
            error, 
            disabled,
            categories,
            setCategories,
        } = props;
    const { addItem, removeItem } = useCollectionManager(genres, setGenres);
    const { removeItem: removeCategory } = useCollectionManager(categories, setCategories);
    const autocompleteHttp = useHttpHandled();
    const autocompleteRef = useRef() as MutableRefObject<AsyncAutocompleteComponent>;

    const fetchOptions = (searchText) => autocompleteHttp(
        genreHttp.list({
            queryParams: {
                search: searchText,
                all: ''
            },
        })
    )
        .then((data) => data.data)
        .catch((error) => console.log(error));

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
                    freeSolo: true,
                    //getOptionSelected: (option, value) => option.id === value.id,
                    getOptionLabel: option => option.name,
                    onChange: (event, value) => addItem(value),
                    disabled: disabled,
                }}
                TextFieldProps={{
                    label: 'Generos',
                    error: error !== undefined
                }}
            />
            <FormHelperText style={{height: '24px'}}>
                Escolha os géneros do video
            </FormHelperText>
            <FormControl
                margin={'normal'}
                fullWidth
                error={error !== undefined}
                disabled={disabled}
                {...props.FormControlProps}
            >
                <GridSelected>
                    {
                        genres.map((genre, key) => (
                            <GridSelectedItem key={key} 
                                onDelete={ 
                                    () => {
                                        const categoriesWithOneGenre = categories
                                            .filter(category => {
                                                const genresFromCategory = getGenresFromCategory(genre, category);
                                                return genresFromCategory.length === 1 && genresFromCategory[0].id === genre.id
                                            });
                                        categoriesWithOneGenre.forEach(cat =>  removeCategory(cat));
                                        removeItem(genre);
                                    }
                                } 
                            xs={12}>
                                <Typography>{genre.name}</Typography>
                            </GridSelectedItem>
                        ))
                    }

                </GridSelected>
                {
                    error && <FormHelperText>{error.message}</FormHelperText>
                }
            </FormControl>

        </>
    );
});

export default GenreField;