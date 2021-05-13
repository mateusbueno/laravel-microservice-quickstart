/* eslint-disable no-mixed-operators */
// @flow 
import { CircularProgress, TextField, TextFieldProps } from '@material-ui/core';
import { Autocomplete, AutocompleteProps } from '@material-ui/lab';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';

interface AsyncAutocompleteProps {
    fetchOptions: (searchText) => Promise<any>;
    TextFieldProps?: TextFieldProps;
    AutoCompleteProps?: Omit<AutocompleteProps<any>, 'renderInput'>;
};
const AsyncAutocomplete: React.FC<AsyncAutocompleteProps> = (props) => {

    const {AutoCompleteProps} = props;
    const {onOpen, onClose, onInputChange, freeSolo} = AutoCompleteProps as any;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const snackbar = useSnackbar();
    const [open, setOpen] = useState(false);
    const [searchText, setSearText] = useState('');
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState([]);

    const TextFieldProps: TextFieldProps = {
        margin: 'normal',
        variant: 'outlined',
        fullWidth: true,
        InputLabelProps: { shrink: true },
        ...(props.TextFieldProps && { ...props.TextFieldProps })
    }

    const autocompleteProps: AutocompleteProps<any> = {
        loadingText: 'Carregando...',
        noOptionsText: 'Nenhum item encontrado',
        loading: loading,
        ...(props.AutoCompleteProps && { ...props.AutoCompleteProps }),
        open,
        options,
        onOpen() {
            setOpen(true);
            onOpen && onOpen();
        },
        onClose() {
            setOpen(false);
            onClose && onClose();
        },
        onInputChange(event, value) {
            setSearText(value);
            onInputChange && onInputChange();
        },
        renderInput: params => (
            <TextField
                {...params}
                {...TextFieldProps}
                InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                        <>
                            {loading && <CircularProgress color={'inherit'} size={20} />}
                            {params.InputProps.endAdornment}
                        </>
                    )
                }}
            />
        )
    };

    useEffect(() => {
        if (!open && !freeSolo) {
            setOptions([]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[open])

    useEffect(() => {
        if (!open || searchText === "" && freeSolo) {
            return;
        }
        let isSubscribed = true;
        (async () => {
            setLoading(true);
            try {
                const data = await props.fetchOptions(searchText);
                if (isSubscribed) {
                    setOptions(data);
                }
            } catch (error) {
                console.log(error);
                snackbar.enqueueSnackbar(
                    'Nao foi possivel carregar as informacoes',
                    { variant: 'error'}
                );
            } finally{
                setLoading(false);
            }
        })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [freeSolo ? searchText : open]);

    return (
        <Autocomplete
            {...autocompleteProps}
        />
    );
};

export default AsyncAutocomplete;