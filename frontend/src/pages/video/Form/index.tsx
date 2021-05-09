// @flow 
import { Checkbox, FormControlLabel, Grid, TextField, Typography, useMediaQuery, useTheme } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from '../../../util/vendor/yup';
import { useHistory, useParams } from 'react-router';
import { IUserRouteParams } from '../../../util/models/interfaces';
import { useSnackbar } from 'notistack';
import { Video } from '../../../util/models';
import SubmitActions from '../../../components/SubmitActions';
import DefaultForm from '../../../components/DafaultForm';
import videoHttp from '../../../util/http/video-http';
import RatingField from './RatingField';

const validationSchema = yup.object().shape({
    name: yup.string()
        .label('Nome')
        .required()
        .max(255),
    description: yup.string()
        .label('Sinopse')
        .required(),
    year_launched: yup.number()
        .label('Ano de lancamento')
        .required()
        .min(1),
    duration: yup.number()
        .label('Duracao')
        .required()
        .min(1),
    rating: yup.string()
        .label('Classificacao')
        .required(),
})

export const Form = () => {

    const {
        register,
        handleSubmit,
        getValues,
        errors,
        reset,
        watch,
        trigger,
        setValue
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            rating: null,
            opened: true
        }
    });

    const snackbar = useSnackbar();
    const history = useHistory();
    const { id } = useParams<IUserRouteParams>();
    const [video, setVideo] = useState<Video | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const theme = useTheme();
    const isGreaterMd = useMediaQuery(theme.breakpoints.up('md'));

    useEffect(() => {
        ['rating', 'opened'].forEach((name: any) => register({name}));
    }, [register]);

    useEffect(() => {
        if (!id) {
            return;
        }
        (async function getVideo() {
            setLoading(true);
            try {
                const { data } = await videoHttp.get(id);
                setVideo(data.data);
                reset(data.data);
            } catch (error) {
                console.log(error);
                snackbar.enqueueSnackbar(
                    'Nao foi possivel carregar as informacoes!', {
                    variant: 'error'
                });
            } finally {
                setLoading(false);
            }
        })()

        // eslint-disable-next-line
    }, []);

    async function onSubmit(formData, event) {
        setLoading(true);
        try {
            const http = !video
                ? videoHttp.create(formData)
                : videoHttp.update(video.id, formData);
            const { data } = await http;
            snackbar.enqueueSnackbar(
                'Video salvo com sucesso!', {
                variant: 'success'
            });
            setTimeout(() => {
                event
                    ? (
                        id
                            ? history.replace(`/videos/${data.data.id}/edit`)
                            : history.push(`/videos/${data.data.id}/edit`)
                    ) : history.push(`/videos`)
            });
        } catch (error) {
            console.log(error);
            snackbar.enqueueSnackbar(
                'Nao foi possivel salvar a video!', {
                variant: 'error'
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <DefaultForm
            GridItemProps={{ xs: 12 }}
            onSubmit={handleSubmit(onSubmit)}>

            <Grid container spacing={5}>
                <Grid item xs={12} md={6}>
                    <TextField
                        name="title"
                        label="Titulo"
                        fullWidth
                        variant={'outlined'}
                        inputRef={register}
                        disabled={loading}
                        InputLabelProps={{ shrink: true }}
                        error={(errors as any).title !== undefined}
                        helperText={(errors as any).title && (errors as any).title.message}
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
                        error={(errors as any).description !== undefined}
                        helperText={(errors as any).description && (errors as any).description.message}
                    />
                    <Grid container spacing={5}>
                        <Grid item xs={6}>
                            <TextField
                                name="year_launched"
                                label="Ano de lancamento"
                                type="number"
                                margin="normal"
                                variant={'outlined'}
                                fullWidth
                                inputRef={register}
                                disabled={loading}
                                InputLabelProps={{ shrink: true }}
                                error={(errors as any).year_launched !== undefined}
                                helperText={(errors as any).year_launched && (errors as any).year_launched.message}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                name="duration"
                                label="Duracao"
                                type="number"
                                margin="normal"
                                variant={'outlined'}
                                fullWidth
                                inputRef={register}
                                disabled={loading}
                                InputLabelProps={{ shrink: true }}
                                error={(errors as any).duration !== undefined}
                                helperText={(errors as any).duration && (errors as any).duration.message}
                            />
                        </Grid>
                    </Grid>
                    Elenco
                    <br />
                    Generos e Categorias
                </Grid>
                <Grid item xs={12} md={6}>
                    <RatingField
                        value={watch('rating')}
                        setValue={(value) => setValue('rating', value)}
                        errors={errors.rating}
                        disabled={loading}
                        formControlProps={{
                            margin: isGreaterMd ? 'none' : 'normal'
                        }}
                    />
                    <br />
                    Uploads
                    <br />
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="opened"
                                color={'primary'}
                                onChange={
                                    () => setValue('opened', !getValues()['opened'])
                                }
                                checked={watch('opened')}
                                disabled={loading}
                            />
                        }
                        label={
                            <Typography color="primary" variant={"subtitle2"}>
                                Quero que este conteudo apareca na secao lancamentos
                            </Typography>
                        }
                        labelPlacement={'end'}
                    />
                </Grid>
            </Grid>
            <SubmitActions
                disabledButtons={loading}
                handleSave={() => trigger().then(isValid => {
                    isValid && onSubmit(getValues(), null)
                })}
            />

        </DefaultForm>
    );
};