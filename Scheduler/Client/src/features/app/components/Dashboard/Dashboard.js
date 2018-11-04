//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

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
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { withStyles } from "@material-ui/core/styles";

//------------------------------------------------------------------------------
// Assets
//------------------------------------------------------------------------------
import styles from "features/app/components/Dashboard/dashboard.scss";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { stringToHslColor } from "../../../../__utils__/generalUtils";

//------------------------------------------------------------------------------

/**
 * Renders the dashboard content.
 */
export class Dashboard extends React.PureComponent {
    render() {
        const vcName = "Victoria Christadelphians";
        const VcAvatar = withStyles({
            colorDefault: {
                backgroundColor: stringToHslColor(vcName),
            },
        })(Avatar);
        const renderCalendars = () => {
            const calendarsMarkup = [];

            this.props.calendars.forEach((calendar) => {
                const calendarName = calendar.getName();

                calendarsMarkup.push(
                    <ListItem key={calendarName}>
                        {calendarName}
                    </ListItem>,
                );
            });

            return calendarsMarkup;
        };

        return (
            <Grid
                container
                spacing={8}
            >
                <Grid
                    item
                    xs={12}
                >
                    <Card>
                        <CardHeader
                            action={
                                <IconButton>
                                    <MoreVertIcon />
                                </IconButton>
                            }
                            className={styles.cardHeader}
                            title="At a glance"
                            subheader="My activities"
                        />
                        <CardContent>
                        </CardContent>
                    </Card>
                </Grid>
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
                            subheader="My Calendars"
                        />
                        <Divider />
                        <List className={styles.list}>
                            {renderCalendars()}
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
null)(Dashboard);

Dashboard.propTypes = {
    // -------------------------------------------------------------------------
    // Data propTypes
    // -------------------------------------------------------------------------
    // Redux -------------------------------------------------------------------
    calendars: PropTypes.array.isRequired,
    givenName: PropTypes.string.isRequired,
    surname: PropTypes.string.isRequired,
};

Dashboard.defaultProps = {};
