// @flow 
import { MenuItem, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import categoryHttp from '../../util/http/category-http';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from '../../util/vendor/yup';
import { useSnackbar } from 'notistack';
import { useHistory, useParams } from 'react-router';
import { IUserRouteParams } from '../../util/models/interfaces';
import genreHttp from '../../util/http/genre-http';
import { Category, Genre } from '../../util/models';
import SubmitActions from '../../components/SubmitActions';
import DefaultForm from '../../components/DafaultForm';

const validationSchema = yup.object().shape({
    name: yup.string()
        .label('Nome')
        .required()
        .max(255),
    categories_id: yup.array()
        .label('Categorias')
        .required(),
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
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            categories_id: [],
            name: ''
        }
    });

    const snackbar = useSnackbar();
    const history = useHistory();
    const { id } = useParams<IUserRouteParams>();
    const [genre, setGenre] = useState<Genre | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        let isSubscribed = true;

        (async function loadData() {
            setLoading(true);
            const promises = [categoryHttp.list({ queryParams: { all: '' } })];
            if (id) {
                promises.push(genreHttp.get(id));
            }
            try {
                const [categoriesResponse, genreResponse] = await Promise.all(promises);
                if (isSubscribed) {
                    setCategories(categoriesResponse.data.data);
                    if (id) {
                        setGenre(genreResponse.data.data);
                        reset({
                            ...genreResponse.data.data,
                            categories_id: genreResponse.data.data.categories.map(category => category.id)
                        });
                    }
                }
            } catch (error) {
                console.error(error);
                snackbar.enqueueSnackbar(
                    'Nao foi possivel carregar as informacoes',
                    { variant: 'error' }
                )
            } finally {
                setLoading(false);
            }
        })();
        // eslint-disable-next-line
    }, []);

    async function onSubmit(formData, event) {

        setLoading(true);
        try {
            const http = !genre
                ? genreHttp.create(formData)
                : genreHttp.update(genre.id, formData);
            const { data } = await http;
            snackbar.enqueueSnackbar(
                'Genero salvo com sucesso',
                { variant: 'success' }
            );
            setTimeout(() => {
                event
                    ? (
                        id
                            ? history.replace(`/genres/${data.data.id}/edit`)
                            : history.push(`/genres/${data.data.id}/edit`)
                    )
                    : history.push('/genres')
            })
        } catch (error) {
            console.error(error);
            snackbar.enqueueSnackbar(
                'Nao foi possivel salvar o genero',
                { variant: 'error' }
            )
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        register({ name: 'categories_id' })
    }, [register]);

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
                select
                name="categories_id"
                value={watch('categories_id')}
                label="Categories"
                margin={'normal'}
                variant={'outlined'}
                fullWidth
                onChange={(e) => {
                    setValue('categories_id', e.target.value);
                }}
                SelectProps={{
                    multiple: true
                }}
                disabled={loading}
                error={errors.categories_id !== undefined}
                helperText={errors.categories_id && errors.categories_id}
                InputLabelProps={{ shrink: true }}
            >
                <MenuItem value="" disabled>
                    <em>Selecione categorias</em>
                </MenuItem>
                {
                    categories.map(
                        (category, key) => (
                            <MenuItem key={key} value={category.id}>{category.name}</MenuItem>
                        )
                    )
                }
            </TextField>
            <SubmitActions
                disabledButtons={loading}
                handleSave={() => trigger().then(isValid => {
                    isValid && onSubmit(getValues(), null)
                })} />
        </DefaultForm>


    );
};