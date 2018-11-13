//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import PropTypes from "prop-types";
import React from "react";
import isEmpty from "lodash/isEmpty";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";

//------------------------------------------------------------------------------
// Redux Support
//------------------------------------------------------------------------------
import {
    selectCalendar,
    selectCalendarError,
} from "redux/reducers/calendarReducer";
import { fetchCalendarInRange } from "redux/actions/calendarActions";

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

import EmptyItem from "features/ui/components/EmptyItem/EmptyItem";

//------------------------------------------------------------------------------
// Assets
//------------------------------------------------------------------------------
import styles from "features/app/components/Schedules/schedules.scss";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import OpenInBrowserIcon from "@material-ui/icons/OpenInBrowser";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import { stringToHslColor } from "utils/generalUtils";

//------------------------------------------------------------------------------

/**
 * Renders the schedules content.
 */
export class Schedules extends React.PureComponent {
    constructor(props) {
        super(props);

        if (isEmpty(props.calendar)) {
            props.fetchCalendarInRange(
                new Date(2019, 0, 1),
                new Date(2019, 5, 30),
            );
        }
    }

    render() {
        const vcName = "Victoria Christadelphians";
        const VcAvatar = withStyles({
            colorDefault: {
                backgroundColor: stringToHslColor(vcName),
            },
        })(Avatar);
        const renderEventTypes = () => {
            const eventTypes = (!isEmpty(this.props.calendar))
                ? this.props.calendar.getEvents().getEventTypes()
                : [];
            const eventTypeMarkup = [];
            const emptyText = (this.props.calendarError !== null)
                ? "We're having trouble loading these schedules."
                : "No schedules to show.";
            let index = 0;

            eventTypes.forEach((eventType) => {
                const divider = ((index + 1) === eventTypes.size)
                    ? <React.Fragment key={`${eventType}Divider`} />
                    : <Divider key={`${eventType}Divider`} />;
                eventTypeMarkup.push(
                    <ListItem
                        className={styles.listItem}
                        key={eventType}
                    >
                        <ListItemText className={styles.listItemText}>
                            {eventType}
                        </ListItemText>
                        <ListItemSecondaryAction>
                            <IconButton>
                                <OpenInBrowserIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>,
                    divider,
                );
                index += 1;
            });

            if (eventTypeMarkup.length === 0) {
                eventTypeMarkup.push(
                    <EmptyItem
                        key="emptyCalendarsListItem"
                        text={emptyText}
                        isError={this.props.calendarError !== null}
                        isListItem={true}
                    />,
                );
            }

            return eventTypeMarkup;
        };
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
                        <Divider style={{ backgroundColor: stringToHslColor(vcName) }} />
                        <List>
                            {renderEventTypes()}
                        </List>
                    </Card>
                </Grid>
            </Grid>
        );
    }
}

// Export the redux-connected component
export default connect((state) => ({
    calendar: selectCalendar(state),
    calendarError: selectCalendarError(state),
}), {
    fetchCalendarInRange,
})(Schedules);

Schedules.propTypes = {
    // -------------------------------------------------------------------------
    // Data propTypes
    // -------------------------------------------------------------------------
    // Redux -------------------------------------------------------------------
    calendar: PropTypes.object,
    calendarError: PropTypes.string,

    // -------------------------------------------------------------------------
    // Method propTypes
    // -------------------------------------------------------------------------
    // Redux -------------------------------------------------------------------
    fetchCalendarInRange: PropTypes.func.isRequired,
};

Schedules.defaultProps = {};
