// @flow 
import { Card, CardContent, Checkbox, FormControlLabel, FormHelperText, Grid, makeStyles, TextField, Theme, Typography, useMediaQuery, useTheme } from '@material-ui/core';
import React, { createRef, MutableRefObject, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from '../../../util/vendor/yup';
import { useHistory, useParams } from 'react-router';
import { IUserRouteParams } from '../../../util/models/interfaces';
import { useSnackbar } from 'notistack';
import { Video, VideoFileFieldsMap } from '../../../util/models';
import SubmitActions from '../../../components/SubmitActions';
import DefaultForm from '../../../components/DafaultForm';
import videoHttp from '../../../util/http/video-http';
import RatingField from './RatingField';
import UploadField from './UploadField';
import GenreField from './GenreField';
import CategoryField from './CategoryField';
import CastMemberField from './CastMemberField';
import { omit, zipObject } from 'lodash';
import { InputFileComponent } from '../../../components/InputFile';
import useSnackbarFormError from '../../../hooks/useSnackbarFormError';
import SnackbarUpload from '../../../components/Snackbar/Upload';

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
    genres: yup.array()
        .label('Generos')
        .required()
        .test({
            message: 'Cada genero escolhido precisa ter pelo menos uma categoria selecionada',
            test(value: any) {
                return value.every(v => v.categories.filter(
                    cat => this.parent.categories.map(c => c.id).includes(cat.id)
                ).length !== 0)
            }
        }),
    categories: yup.array()
        .label('Categorias')
        .required(),
    cast_members: yup.array()
        .label('CasteMembers')
        .required(),
    rating: yup.string()
        .label('Classificacao')
        .required(),
});

const useStyles = makeStyles((theme: Theme) => ({
    card: {
        borderRadius: "4px",
        backgroundColor: "#f5f5f5",
        margin: theme.spacing(2, 0)
    },
    cardOpened: {
        borderRadius: '4px',
        backgroundColor: '#f5f5f5'
    },
    cardContentOpened: {
        paddingBottom: theme.spacing(2) + 'px !important'
    }
}));

const fileFields = Object.keys(VideoFileFieldsMap);

export const Form = () => {

    const classes = useStyles();
    const {
        register,
        handleSubmit,
        getValues,
        errors,
        reset,
        watch,
        trigger,
        setValue,
        formState,
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            rating: null,
            opened: true,
            thumb_file: '',
            banner_file: '',
            trailer_file: '',
            video_file: '',
            genres: [],
            categories: [],
            cast_members: [],
        }
    });

    const snackbar = useSnackbar();
    const history = useHistory();
    const { id } = useParams<IUserRouteParams>();
    const [video, setVideo] = useState<Video | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const theme = useTheme();
    const isGreaterMd = useMediaQuery(theme.breakpoints.up('md'));
    const castMemberRef = useRef() as MutableRefObject<any>;
    const genreRef = useRef() as MutableRefObject<any>;
    const categoryRef = useRef() as MutableRefObject<any>;
    const uploadsRef = useRef(
        zipObject(fileFields, fileFields.map(() => createRef()))
    ) as MutableRefObject<{ [key: string]: MutableRefObject<InputFileComponent> }>
   

    useEffect(() => {
        [
            'rating',
            'opened',
            'genres',
            'categories',
            'cast_members',
            ...fileFields
        ].forEach((name: any) => register({ name }));
    }, [register]);

    useEffect(() => {
        snackbar.enqueueSnackbar('', {
            key: 'snackbar-upload',
            persist: true,
            anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'right'
            },
            content: (key: string | number, message) => (
                <SnackbarUpload id={key}/>
            )
        });
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

    useSnackbarFormError(formState.submitCount, errors)

    async function onSubmit(formData, event) {
        const sendData = omit(formData, ['cast_members', 'genres', 'categories']);
        sendData['cast_members_id'] = formData['cast_members'].map(cast_member => cast_member.id);
        sendData['categories_id'] = formData['categories'].map(category => category.id);
        sendData['genres_id'] = formData['genres'].map(genre => genre.id);

        setLoading(true);
        try {
            const http = !video
                ? videoHttp.create(sendData)
                : videoHttp.update(video.id, { ...sendData, _method: 'PUT' }, { http: { usePost: true } });
            const { data } = await http;
            snackbar.enqueueSnackbar(
                'Video salvo com sucesso!', {
                variant: 'success'
            });
            id && resetForm(video);
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
    };

    function resetForm(data) {
        Object.keys(uploadsRef.current).forEach(
            field => uploadsRef.current[field].current.clear()
        );
        castMemberRef.current.clear();
        genreRef.current.clear();
        categoryRef.current.clear();
        reset(data);
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
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <CastMemberField
                                castMembers={watch('cast_members')}
                                setCastMembers={(value) => setValue('cast_members', value)}
                                error={errors.cast_members}
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <GenreField
                                genres={watch('genres')}
                                setGenres={(value) => setValue('genres', value)}
                                categories={watch('categories')}
                                setCategories={(value) => setValue('categories', value)}
                                error={errors.genres}
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <CategoryField
                                categories={watch('categories')}
                                setCategories={(value) => setValue('categories', value)}
                                genres={watch('genres')}
                                error={errors.categories}
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormHelperText>
                                Escolha os generos do video
                            </FormHelperText>
                            <FormHelperText>
                                Escolha pelo menos uma categoria de cada genero
                            </FormHelperText>
                        </Grid>
                    </Grid>

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
                    <Card className={classes.card}>
                        <CardContent>
                            <Typography color="primary" variant="h6">
                                Imagens
                            </Typography>
                            <UploadField
                                ref={uploadsRef.current['thumb_file']}
                                accept={'image/*'}
                                label={'Thumb'}
                                setValue={(value) => setValue('thumb_file', value)}
                            />
                            <UploadField
                                ref={uploadsRef.current['banner_file']}
                                accept={'images/*'}
                                label={'Banner'}
                                setValue={(value) => setValue('banner_file', value)}
                            />
                        </CardContent>
                    </Card>
                    <Card className={classes.card}>
                        <CardContent>
                            <Typography color="primary" variant="h6">
                                Videos
                            </Typography>
                            <UploadField
                                ref={uploadsRef.current['trailer_file']}
                                accept={'video/mp4'}
                                label={'Trailer'}
                                setValue={(value) => setValue('trailer_file', value)}
                            />
                            <UploadField
                                ref={uploadsRef.current['video_file']}
                                accept={'video/mp4'}
                                label={'Principal'}
                                setValue={(value) => {
                                    setValue('video_file', value);
                                    console.log(getValues());
                                }}
                            />
                        </CardContent>
                    </Card>

                    <Card className={classes.cardOpened}>
                        <CardContent className={classes.cardContentOpened}>
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
                        </CardContent>
                    </Card>

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