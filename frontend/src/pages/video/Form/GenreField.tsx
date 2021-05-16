// @flow 
import { Typography } from '@material-ui/core';
import * as React from 'react';
import AsyncAutocomplete from '../../../components/AsyncAutocomplete';
import GridSelected from '../../../components/GridSelected';
import { GridSelectedItem } from '../../../components/GridSelectedItem';
import useCollectionManager from '../../../hooks/useCollectionManager';
import useHttpHandled from '../../../hooks/useHttpHandled';
import genreHttp from '../../../util/http/genre-http';

interface GenreFieldProps {
    genres: any[];
    setGenres: (genres) => void;
};
const GenreField: React.FC<GenreFieldProps> = (props) => {
    const { genres, setGenres } = props;
    const { addItem } = useCollectionManager(genres, setGenres);
    const autocompleteHttp = useHttpHandled();
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

    return (
        <>
            <AsyncAutocomplete
                fetchOptions={fetchOptions}
                AutoCompleteProps={{
                    freeSolo: true,
                    getOptionLabel: option => option.name,
                    onChange: (event, value) => addItem(value)
                }}
                TextFieldProps={{
                    label: 'Generos'
                }}
            />
            <GridSelected>
                {
                    genres.map((genre, key) => (
                        <GridSelectedItem key={key} onClick={() => console.log('clicou!')} xs={12}>
                            <Typography>{genre.name}</Typography>
                        </GridSelectedItem>
                    ))
                }

            </GridSelected>
        </>
    );
};

export default GenreField;