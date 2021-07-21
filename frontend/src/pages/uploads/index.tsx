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
import { useSelector } from 'react-redux';
import { VideoFileFieldsMap } from '../../util/models';

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