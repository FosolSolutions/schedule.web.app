//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";

//------------------------------------------------------------------------------
// Redux Support
//------------------------------------------------------------------------------
import { selectCalendars } from "redux/reducers/calendarsReducer";
import {
    selectGivenName,
    selectSurname,
} from "redux/reducers/userReducer";

//------------------------------------------------------------------------------
// Components
//------------------------------------------------------------------------------
import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import Divider from "@material-ui/core/Divider";
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

//------------------------------------------------------------------------------
// Assets
//------------------------------------------------------------------------------
import styles from "features/app/components/Schedules/schedules.scss";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import OpenInBrowserIcon from "@material-ui/icons/OpenInBrowser";
import { stringToHslColor } from "../../../../__utils__/generalUtils";

//------------------------------------------------------------------------------

/**
 * Renders the schedules content.
 */
export class Schedules extends React.PureComponent {
    render() {
        const vcName = "Victoria Christadelphians";
        const VcAvatar = withStyles({
            colorDefault: {
                backgroundColor: stringToHslColor(vcName),
            },
        })(Avatar);

        return (
            <Grid
                container
                spacing={8}
            >
                <Grid
                    item
                    xs={12}
                    md={6}
                    xl={4}
                >
                    <Card>
                        <CardHeader
                            avatar={
                                <VcAvatar>
                                    VC
                                </VcAvatar>
                            }
                            action={
                                <IconButton>
                                    <MoreVertIcon />
                                </IconButton>
                            }
                            className={styles.cardHeader}
                            title={vcName}
                            subheader="My Schedules"
                        />
                        <Divider />
                        <List>
                            <ListItem
                                className={styles.listItem}
                            >
                                <ListItemText className={styles.listItemText}>
                                        Memorial Meeting
                                </ListItemText>
                                <ListItemSecondaryAction>
                                    <IconButton>
                                        <OpenInBrowserIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                            <ListItem
                                className={styles.listItem}
                            >
                                <ListItemText className={styles.listItemText}>
                                        Lecture
                                </ListItemText>
                                <ListItemSecondaryAction>
                                    <IconButton>
                                        <OpenInBrowserIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                            <ListItem
                                className={styles.listItem}
                            >
                                <ListItemText className={styles.listItemText}>
                                        Bible Class
                                </ListItemText>
                                <ListItemSecondaryAction>
                                    <IconButton>
                                        <OpenInBrowserIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                            <ListItem
                                className={styles.listItem}
                            >
                                <ListItemText className={styles.listItemText}>
                                        Hall Cleaning
                                </ListItemText>
                                <ListItemSecondaryAction>
                                    <IconButton>
                                        <OpenInBrowserIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        </List>
                    </Card>
                </Grid>
            </Grid>
        );
    }
}

// Export the redux-connected component
export default connect((state) => ({
    calendars: selectCalendars(state),
    givenName: selectGivenName(state),
    surname: selectSurname(state),
}),
null)(Schedules);

Schedules.propTypes = {
    // -------------------------------------------------------------------------
    // Data propTypes
    // -------------------------------------------------------------------------
    // Redux -------------------------------------------------------------------
    calendars: PropTypes.array.isRequired,
    givenName: PropTypes.string.isRequired,
    surname: PropTypes.string.isRequired,
};

Schedules.defaultProps = {};
