//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

//------------------------------------------------------------------------------
// Redux Support
//------------------------------------------------------------------------------
import {
    selectCalendars,
    selectCalendarsError,
    selectCalendarsIsLoading,
} from "redux/reducers/calendarReducer";

//------------------------------------------------------------------------------
// Components
//------------------------------------------------------------------------------
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";

//------------------------------------------------------------------------------
// Assets
//------------------------------------------------------------------------------
import styles from "features/app/components/Dashboard/dashboard.scss";
import MoreVertIcon from "@material-ui/icons/MoreVert";

//------------------------------------------------------------------------------

/**
 * Renders the dashboard content.
 */
export class Dashboard extends React.PureComponent {
    render() {
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
            </Grid>
        );
    }
}

// Export the redux-connected component
export default connect((state) => ({
    calendars: selectCalendars(state),
    calendarsError: selectCalendarsError(state),
    calendarsIsLoading: selectCalendarsIsLoading(state),
}),
null)(Dashboard);

Dashboard.propTypes = {
    // -------------------------------------------------------------------------
    // Data propTypes
    // -------------------------------------------------------------------------
    // Redux -------------------------------------------------------------------
    calendars: PropTypes.object,
    calendarsError: PropTypes.string,
    calendarsIsLoading: PropTypes.bool.isRequired,
};

Dashboard.defaultProps = {};
