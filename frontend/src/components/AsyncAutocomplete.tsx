/* eslint-disable no-mixed-operators */
// @flow 
import { CircularProgress, TextField, TextFieldProps } from '@material-ui/core';
import { Autocomplete, AutocompleteProps, UseAutocompleteSingleProps } from '@material-ui/lab';
import { useSnackbar } from 'notistack';
import React, { RefAttributes, useEffect, useImperativeHandle, useState } from 'react';
import { useDebounce } from 'use-debounce/lib';

interface AsyncAutocompleteProps extends RefAttributes<AsyncAutocompleteProps>{
    fetchOptions: (searchText) => Promise<any>;
    debounceTime?: number;
    TextFieldProps?: TextFieldProps;
    AutoCompleteProps?: Omit<AutocompleteProps<any>, 'renderInput'> & UseAutocompleteSingleProps<any>;
};

export interface AsyncAutocompleteComponent {
    clear: () => void;
}
const AsyncAutocomplete = React.forwardRef<AsyncAutocompleteComponent, AsyncAutocompleteProps> ((props, ref) => {

    const {AutoCompleteProps, debounceTime = 300} = props;
    const {onOpen, onClose, onInputChange, freeSolo} = AutoCompleteProps as any;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const snackbar = useSnackbar();
    const [open, setOpen] = useState(false);
    const [searchText, setSearText] = useState('');
    const [debouncedSearchText] = useDebounce(searchText, debounceTime);
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
        inputValue: searchText,
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
        if (!open || debouncedSearchText === "" && freeSolo) {
            return;
        }
        let isSubscribed = true;
        (async () => {
            setLoading(true);
            try {
                const data = await props.fetchOptions(debouncedSearchText);
                if (isSubscribed) {
                    setOptions(data);
                }
            } finally{
                setLoading(false);
            }
        })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [freeSolo ? debouncedSearchText : open]);

    useImperativeHandle(ref, () => ({
        clear: () => {
            setSearText('');
            setOptions([]);
        }
    }));

    return (
        <Autocomplete
            {...autocompleteProps}
        />
    );
});

export default AsyncAutocomplete;