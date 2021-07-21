/* eslint-disable no-template-curly-in-string */
import { addMethod, NumberSchema, number } from "yup";
import { setLocale } from "yup";

const ptBR = {
    mixed: {
        required: '${path} e requerido',
        notType: '${path} e invalido'
    },
    string: {
        max: '${path} precisa ter no máximo ${max}'
    },
    number: {
        min: '${path} precisa ser no mínimo ${min}'
    }
}

setLocale(ptBR);

addMethod<NumberSchema>(number, 'xpto', function() {
    return this.test({
        message: 'message de error',
        test: (value) => {
            return true
        }
    })
})

export * from 'yup';