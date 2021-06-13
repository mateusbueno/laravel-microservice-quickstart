// @flow 
import React, { RefAttributes, useImperativeHandle, useState } from 'react';
import { InputAdornment, TextField, TextFieldProps } from '@material-ui/core';

export interface InputFileProps extends RefAttributes<InputFileComponent>{
    ButtonFile: React.ReactNode;
    InputFileProps?: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
    TextFieldProps?: TextFieldProps;
};

export interface InputFileComponent {
    openWindow: () => void;
    clear: () => void;
}

const InputFile = React.forwardRef<InputFileComponent, InputFileProps>((props, ref) => {
    const fileRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;
    const [filename, setFilename] = useState('');

    const textFieldProps: TextFieldProps = {
        variant: "outlined",
        ...props.TextFieldProps,
        InputProps: {
            ...(
                props.TextFieldProps && props.TextFieldProps.InputProps &&
                {...props.TextFieldProps.InputProps}
            ),
            readOnly: true,
            endAdornment: (
                <InputAdornment position="start">
                    {props.ButtonFile}
                </InputAdornment>
            ),
        },
        value: filename,
    };

    const inputFileProps = {

        hidden: true,
        ref: fileRef,
        onChange(event) {
            const files = event.target.files;
            if (files.length) {
                console.log(files);
                setFilename(Array.from(files).map((file: any) => file.name).join(', '));
            }
            if (props.InputFileProps && props.InputFileProps.onChange) {
                props.InputFileProps.onChange(event);
            }
        },
    };

    useImperativeHandle(ref, () => ({
        openWindow: () => fileRef.current.click(),
        clear: () => setFilename("")
    }));

    return (
        <>
            <input type="file" {...inputFileProps} />
            <TextField {...textFieldProps} />
        </>
    );
});

export default InputFile;