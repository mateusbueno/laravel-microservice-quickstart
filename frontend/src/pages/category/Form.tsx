// @flow 
import { Checkbox, FormControlLabel, TextField } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import categoryHttp from '../../util/http/category-http';
import * as yup from '../../util/vendor/yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useHistory, useParams } from 'react-router';
import { IUserRouteParams } from '../../util/models/interfaces';
import { useSnackbar } from 'notistack';
import { Category } from '../../util/models';
import SubmitActions from '../../components/SubmitActions';
import DefaultForm from '../../components/DafaultForm';
import LoadingContext from '../../components/loading/LoadingContext';

const validationSchema = yup.object().shape({
    name: yup.string()
        .label('Nome')
        .required()
        .max(255)
})

export const Form = () => {

    const {
        register,
        handleSubmit,
        getValues,
        setValue,
        errors,
        reset,
        watch,
        trigger
    } = useForm<{name, is_active}>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            is_active: true
        }
    });

    const snackbar = useSnackbar();
    const history = useHistory();
    const { id } = useParams<IUserRouteParams>();
    const [category, setCategory] = useState<Category | null>(null);
    const loading = useContext(LoadingContext);

    useEffect(() => {
        if (!id) {
            return;
        }
        (async function getCategory() {
            try {
                const { data } = await categoryHttp.get(id);
                setCategory(data.data);
                reset(data.data);
            } catch (error) {
                console.log(error);
                snackbar.enqueueSnackbar(
                    'Nao foi possivel carregar as informacoes!', {
                    variant: 'error'
                });
            }
        })()

        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        register({ name: 'is_active' })
    }, [register]);

    async function onSubmit(formData, event) {
        try {
            const http = !category
                ? categoryHttp.create(formData)
                : categoryHttp.update(category.id, formData);
            const { data } = await http;
            snackbar.enqueueSnackbar(
                'Categoria salva com sucesso!', {
                variant: 'success'
            });
            setTimeout(() => {
                event
                    ? (
                        id
                            ? history.replace(`/categories/${data.data.id}/edit`)
                            : history.push(`/categories/${data.data.id}/edit`)
                    ) : history.push(`/categories`)
            });
        } catch (error) {
            console.log(error);
            snackbar.enqueueSnackbar(
                'Nao foi possivel salvar a categoria!', {
                variant: 'error'
            });
        }
    }

    return (
        <DefaultForm
            GridItemProps={{ xs: 12, md: 6 }}
            onSubmit={handleSubmit(onSubmit)}>
            <TextField
                name="name"
                label="Nome"
                fullWidth
                variant={'outlined'}
                inputRef={register}
                disabled={loading}
                error={(errors as any).name !== undefined}
                helperText={(errors as any).name && (errors as any).name.message}
                InputLabelProps={{ shrink: true }}
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
                InputLabelProps={{ shrink: true }}
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
            <SubmitActions
                disabledButtons={loading}
                handleSave={() =>
                    trigger().then(isValid => {
                        isValid && onSubmit(getValues(), null)
                    })
                }
            />
        </DefaultForm>
    );
};