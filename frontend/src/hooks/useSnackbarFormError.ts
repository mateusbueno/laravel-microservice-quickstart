import { useSnackbar } from "notistack"
import { useEffect } from "react";

const useSnackbarFormError = (submitCount, errors) => {
    const {enqueueSnackbar} = useSnackbar();
    useEffect(() => {
        const hasError = Object.keys(errors).length !== 0;
        if (submitCount > 0 && hasError) {
            enqueueSnackbar(
                'Formulário invalido. Reveja os campos marcados de vermelhos',
                { variant: 'error'}
            )
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [submitCount, errors, enqueueSnackbar])
};

export default useSnackbarFormError;