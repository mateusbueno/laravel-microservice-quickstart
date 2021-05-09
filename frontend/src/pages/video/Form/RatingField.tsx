// @flow 
import {
    Box,
    FormControl,
    FormControlLabel,
    FormControlLabelProps,
    FormControlProps,
    FormHelperText,
    FormLabel,
    Radio,
    RadioGroup,
} from '@material-ui/core';

import * as React from 'react';
import Rating from '../../../components/Rating';

interface RatingFieldProps {
   value: string | null;
   setValue: (value) => void;
   disabled?: boolean;
   errors: any;
   formControlProps: FormControlProps
};

const ratings: FormControlLabelProps[] = [
    {value: 'L', control: <Radio color="primary"/>, label: <Rating rating={'L'}/>, labelPlacement: 'top'},
    {value: '10', control: <Radio color="primary"/>, label: <Rating rating={'10'}/>, labelPlacement: 'top'},
    {value: '12', control: <Radio color="primary"/>, label: <Rating rating={'12'}/>, labelPlacement: 'top'},
    {value: '14', control: <Radio color="primary"/>, label: <Rating rating={'14'}/>, labelPlacement: 'top'},
    {value: '16', control: <Radio color="primary"/>, label: <Rating rating={'16'}/>, labelPlacement: 'top'},
    {value: '18', control: <Radio color="primary"/>, label: <Rating rating={'18'}/>, labelPlacement: 'top'},
];

const RatingField: React.FC<RatingFieldProps> = (props) => {
    const { value, setValue, disabled, errors } = props;

    return (
        <FormControl
                error={errors !== undefined}
                disabled={disabled === true}
                {...props.formControlProps}
            >
                <FormLabel component={"legend"}>Classificacao</FormLabel>
                <Box paddingTop={1}>
                    <RadioGroup
                        name="rating"
                        onChange={(e) => {
                            setValue(e.target.value);
                        }}
                        value={value}
                        row
                    >
                        {
                            ratings.map(
                                (props, key) => <FormControlLabel key={key} {...props}/>
                            )
                        }
                    </RadioGroup>
                </Box>
                
                {
                    errors &&
                    <FormHelperText>{errors.message}</FormHelperText>
                }
            </FormControl>
    );
};

export default RatingField;