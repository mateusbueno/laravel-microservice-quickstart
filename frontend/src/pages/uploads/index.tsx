// @flow 
import {
    Theme,
    makeStyles,
    CardContent,
    Card,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    Typography,
    Grid,
    Divider,
    List
} from '@material-ui/core';
import * as React from 'react';
import { Page } from '../../components/Page';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { UploadItem } from './UploadItem';
import { Upload, UploadModule } from '../../store/upload/types';
import { useDispatch, useSelector } from 'react-redux';
import { VideoFileFieldsMap } from '../../util/models';
import { Creators } from '../../store/upload';

const useStyles = makeStyles((theme: Theme) => {
    return ({
        panelSummary: {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText
        },
        expandedIcon: {
            color: theme.palette.primary.contrastText
        }
    })
})

const Uploads = () => {
    const classes = useStyles();
    const uploads = useSelector<UploadModule, Upload[]>((state) => state.upload.uploads);

    const dispatch = useDispatch();

    React.useMemo (() => {
        setTimeout(() => {
            const obj: any = {
                video: {
                    id: '1',
                    title: ' e o vento levou'
                },
                files: [
                    {
                        file: new File([''], 'teste1.mp4'),
                        fileFields: 'trailer_file'
                    },
                    {
                        file: new File([''], 'teste2.mp4'),
                        fileFields: 'video_file'
                    }
                ]
            }
            dispatch(Creators.addUpload(obj));
            const progress1 = {
                fileField: 'trailer_file',
                progress: 10,
                video: {id: '1'}
            } as any;
            dispatch(Creators.updateProgress(progress1));
            const progress2 = {
                fileField: 'video_file',
                progress: 20,
                video: {id: '2'}
            } as any;
            dispatch(Creators.updateProgress(progress2));
        }, 1000)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [true]);

    return (
        <Page title={'Uploads'}>
            {uploads.map((upload, key) => (
                <Card elevation={5} key={key}>
                    <CardContent>
                        <UploadItem uploadOrFile={upload}>
                            {upload.video.title}
                        </UploadItem>
                        <ExpansionPanel style={{ margin: '0px' }}>
                            <ExpansionPanelSummary
                                className={classes.panelSummary}
                                expandIcon={<ExpandMoreIcon className={classes.expandedIcon} />}
                            >
                                <Typography>Ver detalhes</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails style={{ padding: '0px' }}>
                                <Grid item xs={12}>
                                    <List style={{ padding: '0px' }}>
                                        {
                                            upload.files.map((file, key) => (
                                                <React.Fragment key={key}>
                                                    <Divider />
                                                    <UploadItem uploadOrFile={file}>
                                                        {`${VideoFileFieldsMap[file.fileField]} - ${file.filename}`}
                                                    </UploadItem>
                                                </React.Fragment>
                                            ))
                                        }

                                    </List>
                                </Grid>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    </CardContent>
                </Card>
            ))}

        </Page>
    );
};


export default Uploads;