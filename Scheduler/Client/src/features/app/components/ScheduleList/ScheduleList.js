//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import classNames from "classnames";

//------------------------------------------------------------------------------
// Redux Support
//------------------------------------------------------------------------------
import {
    selectCalendars,
    selectEvents,
} from "redux/reducers/calendarReducer";

//------------------------------------------------------------------------------
// Components
//------------------------------------------------------------------------------
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

//------------------------------------------------------------------------------
// Assets
//------------------------------------------------------------------------------
import styles from "features/app/components/ScheduleList/scheduleList.scss";
import AssignmentIcon from "@material-ui/icons/AssignmentOutlined";
import AssignmentIconFilled from "@material-ui/icons/Assignment";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import { PAGE_ID_SCHEDULES } from "utils/backendConstants";
import { stringToHslColor } from "utils/generalUtils";
import {
    buildRelativePath,
    getEventPath,
} from "utils/appDataUtils";

//------------------------------------------------------------------------------

/**
 * Renders and adds handling for the main application navigation.
 */
export class ScheduleList extends React.Component {
    render() {
        const calendar = this.props.calendars.getAllValues()[0];
        const calendarIsUndefined = typeof calendar === "undefined";
        const accountName = (!calendarIsUndefined)
            ? calendar.getAccountName()
            : "Loading...";
        const accountColor = (!calendarIsUndefined)
            ? calendar.getAccountColor()
            : stringToHslColor(accountName);
        const renderEventTypes = () => {
            const eventTypeMarkup = [];

            this.props.events.getEventTypes().forEach((eventType) => {
                const routePath = buildRelativePath(
                    PAGE_ID_SCHEDULES,
                    [getEventPath(eventType)],
                );
                const listItemClassNames = classNames({
                    [styles.expansionListItem]: true,
                    [styles.active]: this.props.location.pathname === routePath,
                });
                eventTypeMarkup.push(
                    <ListItem
                        button
                        className={listItemClassNames}
                        key={`${eventType}ListItem`}
                        onClick={() => this.props.history.push(routePath)}
                    >
                        <ListItemIcon className={styles.listItemIcon}>
                            <AssignmentIconFilled fontSize="small"/>
                        </ListItemIcon>
                        <ListItemText
                            className={styles.listItemText}
                            disableTypography={true}
                        >
                            {eventType}
                        </ListItemText>
                    </ListItem>,
                );
            });

            return eventTypeMarkup;
        };

        return (
            <div>
                <h4 className={styles.orgHeading}>
                    <i
                        className={styles.accountDot}
                        style={{ backgroundColor: accountColor }}
                    />
                    {accountName}
                </h4>
                <ExpansionPanel
                    className={styles.expansionPanel}
                    expanded={true}
                >
                    <ExpansionPanelSummary
                        classes={{ expanded: styles.expanded }}
                        className={styles.expansionPanelSummary}
                    >
                        <ListItem className={styles.listItem}>
                            <ListItemIcon className={styles.listItemIcon}>
                                <AssignmentIcon />
                            </ListItemIcon>
                            <ListItemText
                                className={styles.listItemText}
                                disableTypography={true}
                            >
                                Ecclesial Schedule
                            </ListItemText>
                        </ListItem>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails className={styles.expansionPanelDetails}>
                        {renderEventTypes()}
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </div>
        );
    }
}

// Export the redux-connected component
export default withRouter(connect((state) => ({
    calendars: selectCalendars(state),
    events: selectEvents(state),
}),
null)(ScheduleList));

ScheduleList.propTypes = {
    // -------------------------------------------------------------------------
    // Data propTypes
    // -------------------------------------------------------------------------
    // Redux -------------------------------------------------------------------
    calendars: PropTypes.object.isRequired,
    events: PropTypes.object.isRequired,

    // React Router ------------------------------------------------------------
    history: PropTypes.object,
    location: PropTypes.object,

    // -------------------------------------------------------------------------
    // Method propTypes
    // -------------------------------------------------------------------------
    // Redux -------------------------------------------------------------------
};
