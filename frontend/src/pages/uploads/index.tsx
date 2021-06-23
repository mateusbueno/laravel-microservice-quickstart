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

    return (
        <Page title={'Uploads'}>
            <Card elevation={5}>
                <CardContent>
                    <UploadItem>
                        Video - E o vento levou
                    </UploadItem>
                    <ExpansionPanel style={{margin: '0px'}}>
                        <ExpansionPanelSummary
                            className={classes.panelSummary}
                            expandIcon={<ExpandMoreIcon className={classes.expandedIcon}/>}
                        >
                            <Typography>Ver detalhes</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{padding: '0px'}}>
                            <Grid item xs={12}>
                                <List style={{padding: '0px'}}>
                                    <Divider/>
                                    <UploadItem>
                                        Principal - nomedoarquivo.mp4
                                    </UploadItem>
                                </List>
                            </Grid>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                </CardContent>
            </Card>
        </Page>
    );
};


export default Uploads;