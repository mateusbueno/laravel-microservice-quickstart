// @flow 
import * as React from 'react';
import { Grid, GridProps, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete'

interface GridSelectedItemProps {
    handleClick: () => void;
    GridProps?: GridProps
}
export const GridSelectedItem: React.FC<GridSelectedItemProps> = (props) => {
    return (
        <Grid item {...props.GridProps}>
            <Grid container alignItems={'center'} spacing={3}>
                <Grid item xs={1}>
                    <IconButton size={'small'} color={'inherit'} onClick={props.handleClick}>
                        <DeleteIcon/>
                    </IconButton>
                </Grid>
                <Grid item xs={10} md={11}>
                    {props.children}
                </Grid>
            </Grid>
        </Grid>
    );
};