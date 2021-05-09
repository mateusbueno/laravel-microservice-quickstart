import { setLocale } from "yup";

const ptBR = {
    mixed: {
        // eslint-disable-next-line 
        required: '${path} e requerido',
        // eslint-disable-next-line 
        notType: '${path} e invalido'
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