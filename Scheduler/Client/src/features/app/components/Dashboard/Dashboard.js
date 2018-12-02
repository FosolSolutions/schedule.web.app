//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import format from "date-fns/format";
import addMonths from "date-fns/addMonths";

//------------------------------------------------------------------------------
// Redux Support
//------------------------------------------------------------------------------
import {
    selectCalendars,
    selectEvents,
    selectActivities,
    selectOpenings,
} from "redux/reducers/calendarReducer";
import { selectUser } from "redux/reducers/userReducer";

//------------------------------------------------------------------------------
// Components
//------------------------------------------------------------------------------
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

//------------------------------------------------------------------------------
// Assets
//------------------------------------------------------------------------------
import styles from "features/app/components/Dashboard/dashboard.scss";

//------------------------------------------------------------------------------

/**
 * Renders the dashboard content.
 */
export class Dashboard extends React.PureComponent {
    getMyTasks(events) {
        const returnVal = [];
        let activities = [];
        let openings = [];
        let openingObjects = [];

        events.forEach((event) => {
            const newActivities = event.getActivities();
            activities = activities.slice().concat(newActivities);
        });

        activities.forEach((activity) => {
            const newOpenings = this.props.activities.getActivity(activity).getOpenings();
            openings = openings.slice().concat(newOpenings);
        });
        openingObjects = openings.map(
            (opening) => this.props.openings.getOpening(opening),
        );
        openingObjects.forEach((openingObject) => {
            const openingName = openingObject.getName();
            const openingTitle = openingObject.getTitle();
            const activity = this.props.activities.getActivity(
                openingObject.getActivityId(),
            );
            const date = format(activity.getStartDate(), "MMM. dd");
            const eventName = this.props.events.getEvent(activity.getEventId()).getName();

            openingObject.getParticipants().forEach((participant) => {
                if (participant.getId() === this.props.user.getId()) {
                    returnVal.push({
                        date,
                        eventName,
                        openingName,
                        openingTitle: (openingTitle === null) ? "" : ` - ${openingTitle}`,
                    });
                }
            });
        });

        return returnVal;
    }

    render() {
        const now = new Date();
        const endDate = addMonths(now, 2);
        const myTasks = this.getMyTasks(
            this.props.events.getAllByRange(now, endDate),
        );
        const renderUpcomingTasks = () => myTasks.map((task) => {
            const listText = (
                <span>
                    <span className={styles.listTextOpeningName}>
                        {task.openingName}
                    </span>
                    <span className={styles.listTextEventName}>
                        &nbsp;({task.eventName})
                    </span>
                    <span className={styles.listTextOpeningTitle}>
                        {task.openingTitle}
                    </span>
                </span>
            );

            return (
                <ListItem key={`${task.date}${task.eventName}${task.openingName}`}>
                    <ListItemText
                        primary={listText}
                        secondary={task.date}
                    />
                </ListItem>
            );
        });
        const upcomingTasksMarkup = (myTasks.length > 0)
            ? (
                <List>
                    {renderUpcomingTasks()}
                </List>
            )
            : <span>No upcoming tasks.</span>;
        return (
            <Grid
                container
                spacing={8}
            >
                <Grid
                    item
                    xs={12}
                >
                    <Card className={styles.noticeCard}>
                        <CardHeader
                            className={styles.cardHeader}
                            title={
                                <header className={styles.cardHeaderHeader}>
                                    <span className={styles.cardHeaderPrimary}>
                                        Welcome
                                    </span>
                                </header>
                            }
                            disableTypography
                        />
                        <CardContent>
                            <h3 className={styles.contentHeading}>
                                Victoria Ecclesial Schedule Sign-up for Winter/Spring 2019
                            </h3>
                            <ul>
                                <li>{`To view the schedule and volunteer for openings, use left sidebar "Ecclesial Schedule" navigation.`}</li>
                                <li>{`Any of your tasks coming up soon will be shown below.`}</li>
                                <li>{`Use the "Calendar" sidebar navigation to view all the scheduled events, with your tasks highlighted.`}</li>
                            </ul>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid
                    item
                    xs={12}
                >
                    <Card>
                        <CardHeader
                            className={styles.cardHeader}
                            disableTypography
                            title={
                                <header className={styles.cardHeaderHeader}>
                                    <span className={styles.cardHeaderPrimary}>{`At a glance`}</span>
                                    <span className={styles.cardHeaderSecondary}>{`My tasks (${format(now, "MMMM")} - ${format(endDate, "MMMM")})`}</span>
                                </header>
                            }
                        />
                        <CardContent className={styles.cardContent}>
                            {upcomingTasksMarkup}
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
    activities: selectActivities(state),
    openings: selectOpenings(state),
    events: selectEvents(state),
    user: selectUser(state),
}),
null)(Dashboard);

Dashboard.propTypes = {
    // -------------------------------------------------------------------------
    // Data propTypes
    // -------------------------------------------------------------------------
    // Redux -------------------------------------------------------------------
    calendars: PropTypes.object.isRequired,
    activities: PropTypes.object.isRequired,
    openings: PropTypes.object.isRequired,
    events: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
};

Dashboard.defaultProps = {};
