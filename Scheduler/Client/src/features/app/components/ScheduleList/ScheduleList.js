//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import classNames from "classnames";

//------------------------------------------------------------------------------
// Redux Support
//------------------------------------------------------------------------------
import { selectCalendar } from "redux/reducers/calendarReducer";
import { selectPageId } from "redux/reducers/uiReducer";
import { setPageId } from "redux/actions/uiActions";

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
import { HISTORY_PUSH } from "utils/constants";
import { PAGE_ID_SCHEDULES } from "utils/backendConstants";
import { stringToHslColor } from "utils/generalUtils";

//------------------------------------------------------------------------------

/**
 * Renders and adds handling for the main application navigation.
 */
export class ScheduleList extends React.PureComponent {
    render() {
        const schedulesNavListClassNames = classNames({
            [styles.listItem]: true,
            [styles.active]: this.props.pageId === PAGE_ID_SCHEDULES,
        });

        const accountName = (this.props.calendar !== null)
            ? this.props.calendar.getAccountName()
            : "Loading...";
        const accountColor = (this.props.calendar !== null)
            ? this.props.calendar.getAccountColor()
            : stringToHslColor(accountName);
        const renderEventTypes = () => {
            const eventTypes = (this.props.calendar !== null)
                ? this.props.calendar.getEvents().getEventTypes()
                : [];
            const eventTypeMarkup = [];

            eventTypes.forEach((eventType) => {
                eventTypeMarkup.push(
                    <ListItem
                        button
                        className={styles.expansionListItem}
                        key={`${eventType}ListItem`}
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
                        <ListItem
                            button
                            className={schedulesNavListClassNames}
                            onClick={
                                () => this.props.setPageId(
                                    PAGE_ID_SCHEDULES,
                                    HISTORY_PUSH,
                                )
                            }
                        >
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
export default connect((state) => ({
    calendar: selectCalendar(state),
    pageId: selectPageId(state),
}), {
    setPageId,
})(ScheduleList);

ScheduleList.propTypes = {
    // -------------------------------------------------------------------------
    // Data propTypes
    // -------------------------------------------------------------------------
    // Redux -------------------------------------------------------------------
    calendar: PropTypes.object,
    pageId: PropTypes.string.isRequired,

    // -------------------------------------------------------------------------
    // Method propTypes
    // -------------------------------------------------------------------------
    // Redux -------------------------------------------------------------------
    setPageId: PropTypes.func.isRequired,
};
