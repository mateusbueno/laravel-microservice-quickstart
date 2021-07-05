// @flow 
import { Divider, Fade, IconButton, makeStyles, Theme } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import { FileUpload, Upload } from '../../store/upload/types';
import { useDispatch } from 'react-redux';
import { Creators } from '../../store/upload';
import { hasError, isFinished, isUploadType } from '../../store/upload/getters';
import { useDebounce } from 'use-debounce/lib';

const useStyles = makeStyles((theme: Theme) => {
    return ({
        successIcon: {
            color: theme.palette.success.main,
            marginLeft: theme.spacing(1)
        },
        errorIcon: {
            color: theme.palette.error.main,
            marginLeft: theme.spacing(1)
        },
        divider: {
            height: '20px',
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1)
        }
    })
});

interface UploadActionProps {
    uploadOrFile: Upload | FileUpload;
};
const UploadAction: React.FC<UploadActionProps> = (props) => {
    const classes = useStyles();
    const { uploadOrFile } = props;
    const dispatch = useDispatch();
    const error = hasError(uploadOrFile);
    const videoId = (uploadOrFile as any)?.video?.id;
    const [show, setShow] = useState(false);
    const activeActions = isUploadType(uploadOrFile);
    const [debouncedShow] = useDebounce(show, 2500);

    useEffect(() => {
        setShow(isFinished(uploadOrFile))
    }, [uploadOrFile]);


    return (
        debouncedShow ? (
            <Fade in={true} timeout={{ enter: 1000 }}>
                <>
                    {
                        uploadOrFile.progress === 1 && !error && <CheckCircleIcon className={classes.successIcon} />
                    }
                    {error && <ErrorIcon className={classes.errorIcon} />}

                    {
                        activeActions && (
                            <>
                                <Divider className={classes.divider} orientation={'vertical'} />
                                <IconButton
                                    onClick={() => dispatch(Creators.removeUpload({ id: videoId }))}
                                >
                                    <DeleteIcon color={'primary'} />
                                </IconButton>
                                <IconButton
                                    component={Link}
                                    to={`/videos/${videoId}/edit`}
                                >
                                    <EditIcon color={'primary'} />
                                </IconButton>
                            </>
                        )
                    }
                </>
            </Fade>
        ) : null
    );
};

export default UploadAction;