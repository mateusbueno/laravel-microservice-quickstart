// @flow 
import { Box, Button, ButtonProps, Checkbox, FormControlLabel, makeStyles, TextField, Theme } from '@material-ui/core';
import  React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import categoryHttp from '../../util/http/category-http';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from '../../util/vendor/yup';
import { useParams } from 'react-router';
import { IUserRouteParams } from '../../util/models/interfaces';

const useStyles = makeStyles((theme: Theme) => {
    return {
        submit: {
            margin: theme.spacing(1)
        }
    }
})

const validationSchema = yup.object().shape({
    name: yup.string()
        .label('Nome')
        .required()
        .max(255)
})

export const Form = () => {

    const classes = useStyles();

    const { 
            register, 
            handleSubmit, 
            getValues, 
            errors, 
            reset, 
            watch, 
            setValue 
        } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            is_active: true
        }
    });

    const {id} = useParams<IUserRouteParams>();
    const [ category, setCategory] = useState<{id: string} | null>(null);
    const [ loading, setLoading ] = useState<boolean>(false);

    const buttonProps: ButtonProps = {
        variant: 'contained',
        color: 'secondary',
        size: 'medium',
        className: classes.submit,
        disabled: loading
    }

    useEffect(() => {
        register({name: 'is_active'})
    }, [register]);

    useEffect(() => {
        if(!id) {
            return;
        }
        setLoading(true);
        categoryHttp
            .get(id)
            .then(({data}) => {
                setCategory(data.data);
                reset(data.data);
            })
            .finally(() => setLoading(false))
            // eslint-disable-next-line
    }, []);

    function onSubmit(formData, event) {
        setLoading(true);
        const http = !category ? categoryHttp.create(formData) : categoryHttp.update(category.id, formData);
        http
            .then((response) => console.log(response))
            .finally(() => setLoading(false))
    }

    console.log(errors);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
                name="name"
                label="Nome"
                fullWidth
                variant={'outlined'}
                inputRef={register}
                disabled={loading}
                error={(errors as any).name !== undefined}
                helperText={(errors as any).name && (errors as any).name.message}
                InputLabelProps={{shrink: true}}
            />
            <TextField
                name="description"
                label="Descrição"
                multiline
                rows="4"
                fullWidth
                variant={'outlined'}
                margin={'normal'}
                disabled={loading}
                inputRef={register}
                InputLabelProps={{shrink: true}}
            />
            <FormControlLabel
                control={
                    <Checkbox
                        name="is_active"
                        color={'primary'}
                        onChange={
                            () => setValue('is_active', !getValues()['is_active'])
                        }
                        checked={watch('is_active')}
                        disabled={loading}
                    />
                }
                label={'Ativo'}
                labelPlacement={'end'}
            />
            <Box>
                <Button {...buttonProps} onClick={() => onSubmit(getValues(), null)}>Salvar</Button>
                <Button {...buttonProps} type="submit">Salvar e continuar editando</Button>
            </Box>
        </form>
    );
};