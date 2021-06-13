// @flow 
import {
    FormControl,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    Radio,
    RadioGroup,
    TextField,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from '../../util/vendor/yup';
import { useSnackbar } from 'notistack';
import { useHistory, useParams } from 'react-router';
import { IUserRouteParams } from '../../util/models/interfaces';
import castMemberHttp from '../../util/http/cast-member-http';
import { CastMember } from '../../util/models';
import SubmitActions from '../../components/SubmitActions';
import DefaultForm from '../../components/DafaultForm';

const validationSchema = yup.object().shape({
    name: yup.string()
        .label('Nome')
        .required()
        .max(255),
    type: yup.number()
        .label('Tipo')
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
    });

    const snackbar = useSnackbar();
    const history = useHistory();
    const { id } = useParams<IUserRouteParams>();
    const [castMember, setCastMember] = useState<CastMember | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!id) {
            return;
        }
        async function getCastMember() {
            setLoading(true);
            try {
                const { data } = await castMemberHttp.get(id)
                setCastMember(data.data);
                reset(data.data);
            } catch (error) {
                console.error(error);
                snackbar.enqueueSnackbar(
                    'Não foi possível carregar as informações',
                    { variant: 'error' }
                )
            } finally {
                setLoading(false)
            }
        }
        getCastMember();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        register({ name: "type" })
    }, [register]);

    async function onSubmit(formData, event) {
        setLoading(true);
        try {
            const http = !castMember
                ? castMemberHttp.create(formData)
                : castMemberHttp.update(castMember.id, formData);
            const { data } = await http;
            snackbar.enqueueSnackbar(
                'Membro de elenco salvo com sucesso!',
                { variant: 'success' }
            );
            setTimeout(() => {
                event
                    ? (
                        id
                            ? history.replace(`/cast-members/${data.data.id}/edit`)
                            : history.push(`/cast-members/${data.data.id}/edit`)
                    )
                    : history.push('/cast-members')
            });
        } catch (error) {
            console.error(error);
            snackbar.enqueueSnackbar(
                'Nao foi possivel salvar o membro de elenco',
                { variant: 'error' }
            )
        } finally {
            setLoading(false);
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
                error={errors.name !== undefined}
                helperText={errors.name && errors.name.message}
                InputLabelProps={{ shrink: true }}
            />
            <FormControl
                margin={"normal"}
                error={errors.type !== undefined}
                disabled={loading}
            >
                <FormLabel component={"legend"}>Tipo</FormLabel>
                <RadioGroup
                    name="type"
                    onChange={(e) => {
                        setValue('type', parseInt(e.target.value));
                    }}
                    value={watch('type') + ""}
                >
                    <FormControlLabel value="1" control={<Radio color={'primary'} />} label="Diretor" />
                    <FormControlLabel value="2" control={<Radio color={'primary'} />} label="Ator" />
                </RadioGroup>
                {
                    errors.type &&
                    <FormHelperText id="type-helper-text">{errors.type.message}</FormHelperText>
                }
            </FormControl>
            <SubmitActions
                disabledButtons={loading}
                handleSave={() => trigger().then(isValid => {
                    isValid && onSubmit(getValues(), null)
                })} />
        </DefaultForm>
    );
};