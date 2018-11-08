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
import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import CircularProgress from "@material-ui/core/CircularProgress";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { withStyles } from "@material-ui/core/styles";

import EmptyItem from "features/ui/components/EmptyItem/EmptyItem";

//------------------------------------------------------------------------------
// Assets
//------------------------------------------------------------------------------
import styles from "features/app/components/Dashboard/dashboard.scss";
import ErrorIcon from "@material-ui/icons/Error";
import MoreVertIcon from "@material-ui/icons/MoreVert";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import { stringToHslColor } from "utils/generalUtils";

//------------------------------------------------------------------------------

/**
 * Renders the dashboard content.
 */
export class Dashboard extends React.PureComponent {
    render() {
        const renderAccountGrids = () => {
            const accountsMarkup = [];

            this.props.calendars.getAccounts().forEach((account) => {
                const accountName = account.getName();
                const accountWords = accountName.split(" ", accountName);
                const accountColor = stringToHslColor(accountName);
                const AccountAvatar = withStyles({
                    colorDefault: {
                        backgroundColor: accountColor,
                    },
                })(Avatar);
                let accountInitials;

                if (accountWords.length > 1) {
                    accountInitials = `${accountWords[0].charAt(0).toUpperCase()}${accountWords[1].charAt(0).toUpperCase()}`;
                } else {
                    accountInitials = accountWords.substring(0, 2).toUpperCase();
                }

                accountsMarkup.push(
                    <Grid
                        item
                        xs={12}
                        md={6}
                        xl={4}
                    >
                        <Card>
                            <CardHeader
                                avatar={
                                    <AccountAvatar>
                                        {accountInitials}
                                    </AccountAvatar>
                                }
                                action={
                                    <IconButton>
                                        <MoreVertIcon />
                                    </IconButton>
                                }
                                className={styles.cardHeader}
                                title={account.getName()}
                                subheader="My Calendars"
                            />
                            <Divider
                                className={styles.divider}
                                style={{ color: accountColor }}
                            />
                            <List className={styles.list}>
                                {renderCalendars()}
                            </List>
                        </Card>
                    </Grid>,
                );
            });

            if (accountsMarkup.length === 0) {
                accountsMarkup.push(
                    <EmptyItem
                        key="emptyCalendarsListItem"
                        text="No calendars to show."
                        isError={this.props.calendarsError !== null}
                    />,
                );
            }

            return accountsMarkup;
        };
        const renderCalendars = () => {
            const calendarsMarkup = [];

            this.props.calendars.getAll().forEach((calendar) => {
                const calendarName = calendar.getName();

                calendarsMarkup.push(
                    <ListItem key={calendarName}>
                        {calendarName}
                    </ListItem>,
                );
            });

            if (calendarsMarkup.length === 0) {
                calendarsMarkup.push(
                    <EmptyItem
                        key="emptyCalendarsListItem"
                        text="No calendars to show."
                        isError={this.props.calendarsError !== null}
                        isListItem={true}
                    />,
                );
            }

            return calendarsMarkup;
        };
        const renderCalendarsError = () => (
            <ListItem className={styles.error}>
                <ErrorIcon /> Hmm, something's not working.
            </ListItem>
        );
        const renderCalendarsLoader = () => (
            <ListItem className={styles.error}>
                <CircularProgress />
            </ListItem>
        );
        const renderAccounts = () => {
            let returnVal;

            if (this.props.calendarsError) {
                returnVal = renderCalendarsError();
            } else if (this.props.calendarsIsLoading) {
                returnVal = renderCalendarsLoader();
            } else {
                returnVal = renderAccountGrids();
            }

            return returnVal;
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
                {renderAccounts()}
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
