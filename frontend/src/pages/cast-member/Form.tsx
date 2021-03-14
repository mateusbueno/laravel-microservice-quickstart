// @flow 
import {
    Box,
    Button,
    ButtonProps,
    FormControl,
    FormControlLabel,
    FormLabel,
    makeStyles,
    Radio,
    RadioGroup,
    TextField,
    Theme
} from '@material-ui/core';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import categoryHttp from '../../util/http/category-http';

const useStyles = makeStyles((theme: Theme) => {
    return {
        submit: {
            margin: theme.spacing(1)
        }
    }
})

type Props = {

};
export const Form = (props: Props) => {

    const classes = useStyles();

    const buttonProps: ButtonProps = {
        variant: 'outlined',
        size: 'medium',
        className: classes.submit
    }

    const { register, handleSubmit, getValues, setValue } = useForm();

    useEffect( () => {
        register({name: "type"})
    }, [register]);

    function onSubmit(formData, event) {

        console.log(event);
        categoryHttp
            .create(formData)
            .then((response) => console.log(response));
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
                name="name"
                label="Nome"
                fullWidth
                variant={'outlined'}
                inputRef={register}
            />
            <FormControl margin={"normal"}>
                <FormLabel component={"legend"}>Tipo</FormLabel>
                <RadioGroup 
                    name="type"
                    onChange={(e) => {
                        setValue('type', parseInt(e.target.value));
                    }}>
                    <FormControlLabel value="1" control={<Radio/>} label="Diretor"/>
                    <FormControlLabel value="2" control={<Radio/>} label="Ator"/>
                </RadioGroup>
            </FormControl>
            <Box>
                <Button {...buttonProps} onClick={() => onSubmit(getValues(), null)}>Salvar</Button>
                <Button {...buttonProps} type="submit">Salvar e continuar editando</Button>
            </Box>
        </form>
    );
};