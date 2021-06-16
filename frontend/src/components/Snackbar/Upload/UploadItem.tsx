// @flow 
import { Divider, makeStyles, Theme, Tooltip, Typography } from '@material-ui/core';
import * as React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import MovieIcon from '@material-ui/icons/Movie';
import ListItemText from '@material-ui/core/ListItemText';
import UploadProgress from '../../UploadProgress';

const useStyles = makeStyles((theme: Theme) => ({
    listItem: {
        paddingTop: '7px',
        paddingBottom: '7px',
        height: '53px'
    },
    listItemText: {
        marginLeft: '6px',
        marginRight: '24px',
        color: theme.palette.text.secondary
    },
    movieIcon: {
        color: theme.palette.error.main,
        minWidth: '40px'
    },
}));

interface UploadItemProps {

};
const UploadItem: React.FC<UploadItemProps> = (props) => {
    const classes = useStyles();

    return (
        <>
            <Tooltip
                title={'Nao foi possível fazer o upload'}
                placement={'left'}
            >
                <ListItem
                    className={classes.listItem}
                    button
                >
                    <ListItemIcon className={classes.movieIcon}>
                        <MovieIcon />
                    </ListItemIcon>
                    <ListItemText
                        className={classes.listItemText}
                        primary={
                            <Typography noWrap={true} variant={'subtitle2'} color={'inherit'}>
                                E o vento levou!!!
                            </Typography>
                        }
                    />
                    <UploadProgress size={30}/>
                </ListItem>
            </Tooltip>
            <Divider component="li" />
        </>
    );
};

export default UploadItem;