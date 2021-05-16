import axios from "axios";
import { useSnackbar } from "notistack";

const useHttpHandled = () => {
    const snackbar = useSnackbar();
    return async (request: Promise<any>) => {
        try {
            const { data } = await request;
            return data;
        } catch (error) {
            console.log(error);
            if (!axios.isCancel(error)) {
                snackbar.enqueueSnackbar(
                    'Nao foi possivel carregar as informacoes', { variant: 'error' }
                );
            }
            throw error;
        }
    }
}

export default useHttpHandled;