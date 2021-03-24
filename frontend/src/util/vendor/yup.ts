import { setLocale } from "yup";

const ptBR = {
    mixed: {
        // eslint-disable-next-line 
        required: '${path} e requerido'
    },
    string: {
        // eslint-disable-next-line 
        max: '${path} precisa ter no maximo ${max}'
    },
    number: {
        // eslint-disable-next-line 
        min: '${path} precisa ser no minimo ${min}'
    }
}

setLocale(ptBR);

export * from 'yup';