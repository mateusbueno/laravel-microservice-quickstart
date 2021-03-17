// @flow 
import { Box, Button, ButtonProps, Checkbox, makeStyles, TextField, Theme } from '@material-ui/core';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import categoryHttp from '../../util/http/category-http';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const useStyles = makeStyles((theme: Theme) => {
    return {
        submit: {
            margin: theme.spacing(1)
        }
    }
})

const validationSchema = yup.object().shape({
    name: yup.string().label('Nome').required(),
})

export const Form = () => {

    const classes = useStyles();

    const buttonProps: ButtonProps = {
        variant: 'contained',
        color: 'secondary',
        size: 'medium',
        className: classes.submit
    }

    const { register, handleSubmit, getValues, errors } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            is_active: true
        }
    });

    function onSubmit(formData, event) {

        console.log(event);
        categoryHttp
            .create(formData)
            .then((response) => console.log(response));
    }

    console.log(errors);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
                name="name"
                label="Nome"
                fullWidth
                variant={'outlined'}
                inputRef={register({
                    required: 'O campo nome e requerido',
                    maxLength: {
                        value: 2,
                        message: 'O maximo caracteres e 2'
                    }
                })}
                error={(errors as any).name !== undefined}
                helperText={(errors as any).name && (errors as any).name.message}
            />
            <TextField
                name="description"
                label="Descrição"
                multiline
                rows="4"
                fullWidth
                variant={'outlined'}
                margin={'normal'}
                inputRef={register}
            />
            <Checkbox
                name="is_active"
                color={'primary'}
                inputRef={register}
                defaultChecked
            />
            Ativo
            <Box>
                <Button {...buttonProps} onClick={() => onSubmit(getValues(), null)}>Salvar</Button>
                <Button {...buttonProps} type="submit">Salvar e continuar editando</Button>
            </Box>
        </form>
    );
};