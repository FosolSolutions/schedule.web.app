//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import addMonths from "date-fns/addMonths";
import format from "date-fns/format";
import addDays from "date-fns/addDays";
import startOfWeek from "date-fns/startOfWeek";
import subMonths from "date-fns/subMonths";
import startOfMonth from "date-fns/startOfMonth";
import endOfMonth from "date-fns/endOfMonth";
import endOfWeek from "date-fns/endOfWeek";
import isBefore from "date-fns/isBefore";
import isSameMonth from "date-fns/isSameMonth";
import isSameDay from "date-fns/isSameDay";
import classNames from "classnames";

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
import {
    selectCurrentCalendarMonth,
    selectDrawerIsOpen,
} from "redux/reducers/uiReducer";
import {
    setCurrentCalendarMonth,
    setDrawerIsOpen,
} from "redux/actions/uiActions";

//------------------------------------------------------------------------------
// Components
//------------------------------------------------------------------------------
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

//------------------------------------------------------------------------------
// Assets
//------------------------------------------------------------------------------
import styles from "features/ui/components/Calendar/calendar.scss";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit";
import FullscreenIcon from "@material-ui/icons/Fullscreen";

//------------------------------------------------------------------------------

/**
 * Renders a calendar.
 */
export class Calendar extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            selectedDate: new Date(),
        };
    }

    onDateClick(day) {
        this.setState({ selectedDate: day });
    }

    nextMonth() {
        this.props.setCurrentCalendarMonth(addMonths(this.props.currentCalendarMonth, 1));
    }

    prevMonth() {
        this.props.setCurrentCalendarMonth(subMonths(this.props.currentCalendarMonth, 1));
    }

    today() {
        this.setState({ selectedDate: new Date() });
        this.props.setCurrentCalendarMonth(new Date());
    }

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
            const activity = this.props.activities.getActivity(
                openingObject.getActivityId(),
            );
            const eventName = this.props.events.getEvent(activity.getEventId()).getName();

            openingObject.getParticipants().forEach((participant) => {
                if (participant.getId() === this.props.user.getId()) {
                    returnVal.push({
                        eventName,
                        openingName,
                    });
                }
            });
        });

        return returnVal;
    }

    getTaskText(myTasks, includeEventName = true) {
        let returnVal = (myTasks.length > 1) ? "My tasks: " : "My task: ";

        myTasks.forEach((task, index) => {
            let separator;
            const eventFragment = `${task.eventName}: `;

            if (index > 0) {
                separator = ", ";
            } else {
                separator = "";
            }

            returnVal += `${separator}`;
            returnVal += (includeEventName) ? eventFragment : "";
            returnVal += `${task.openingName}`;
        });

        return returnVal;
    }

    render() {
        const calendar = this.props.calendars.getAllValues()[0];
        const fullScreenIcon = (this.props.drawerIsOpen)
            ? <FullscreenIcon />
            : <FullscreenExitIcon color="secondary" />;
        const renderHeader = () => {
            const dateFormat = "MMMM yyyy";
            return (
                <div className={styles.header}>
                    <div className={styles.preWrap}>
                        <IconButton onClick={
                            () => this.props.setDrawerIsOpen(!this.props.drawerIsOpen)
                        }>
                            {fullScreenIcon}
                        </IconButton>
                    </div>
                    <div className={styles.leftWrap}>
                        <Button
                            className={styles.today}
                            onClick={() => this.today()}
                            variant={"contained"}
                        >
                            Today
                        </Button>
                    </div>
                    <div className={styles.centerWrap}>
                        <span>
                            {format(this.props.currentCalendarMonth, dateFormat)}
                        </span>
                    </div>
                    <div className={styles.rightWrap}>
                        <IconButton onClick={() => this.prevMonth()}>
                            <KeyboardArrowLeftIcon />
                        </IconButton>
                        <IconButton onClick={() => this.nextMonth()}>
                            <KeyboardArrowRightIcon />
                        </IconButton>
                    </div>
                </div>
            );
        };
        const renderWeekDays = () => {
            const dateFormat = "iii";
            const days = [];
            const startDate = startOfWeek(this.props.currentCalendarMonth);
            let formattedDate;

            for (let i = 0; i < 7; i += 1) {
                formattedDate = format(
                    addDays(startDate, i),
                    dateFormat,
                );
                days.push(
                    <div
                        className={styles.weekDay}
                        key={i}
                    >
                        {formattedDate}
                    </div>,
                );
            }

            return <div className={styles.weekDays}>{days}</div>;
        };

        const renderDays = () => {
            const monthStart = startOfMonth(this.props.currentCalendarMonth);
            const monthEnd = endOfMonth(monthStart);
            const startDate = startOfWeek(monthStart);
            const endDate = endOfWeek(monthEnd);

            const dateFormat = "d";
            const rows = [];

            let days = [];
            let day = startDate;
            let formattedDate = "";
            let dayEvents;
            let dayClassNames;
            let numberClassNames;

            while (day <= endDate) {
                for (let i = 0; i < 7; i += 1) {
                    formattedDate = format(
                        day,
                        dateFormat,
                        { awareOfUnicodeTokens: true },
                    );
                    numberClassNames = classNames({
                        [styles.number]: true,
                        [styles.singleDigit]: formattedDate.length === 1,
                    });
                    dayEvents = this.props.events.getAllByDay(day);
                    dayClassNames = classNames({
                        [styles.day]: true,
                        [styles.disabled]: !isSameMonth(day, monthStart),
                        [styles.selected]: isSameDay(day, this.state.selectedDate),
                    });

                    days.push(
                        <div
                            className={dayClassNames}
                            key={day}
                        >
                            <span className={numberClassNames}>{formattedDate}</span>
                            {renderEvents(dayEvents, day)}
                        </div>,
                    );
                    day = addDays(day, 1);
                }
                rows.push(
                    <div
                        className={styles.dayRow}
                        key={day}
                    >
                        {days}
                    </div>,
                );
                days = [];
            }

            return <div className={styles.days}>{rows}</div>;
        };
        const renderEvents = (eventsToRender, day) => {
            const eventsMarkup = [];
            eventsToRender.forEach((event) => {
                const myTasks = this.getMyTasks([event]);
                const taskText = this.getTaskText(myTasks, false);
                const eventName = event.getName();
                const eventClassNames = classNames({
                    [styles.event]: true,
                    [styles.past]: isBefore(day, this.state.selectedDate),
                    [styles.myEventWrap]: myTasks.length > 0,
                });
                const eventDot = (
                    <i
                        className={styles.accountDot}
                        style={{
                            backgroundColor:
                                calendar.getAccountColor(),
                        }}
                    />
                );
                const eventMarkup = (myTasks.length > 0)
                    ? (
                        <Tooltip
                            classes={{
                                tooltip: styles.taskTooltip,
                            }}
                            placement="top"
                            title={taskText}
                        >
                            <span className={styles.myEvent}>
                                {eventDot}
                                {eventName}
                            </span>
                        </Tooltip>
                    )
                    : (
                        <span>
                            {eventDot}
                            {eventName}
                        </span>
                    );

                // TODO: Render a DialogWithContent here for each event

                if (isSameMonth(this.props.currentCalendarMonth, event.getStartDate())) {
                    eventsMarkup.push(
                        (
                            <div
                                className={eventClassNames}
                                key={eventName}
                            >
                                {eventMarkup}
                            </div>
                        ),
                    );
                }
            });

            return eventsMarkup;
        };

        return (
            <Card>
                {renderHeader()}
                {renderWeekDays()}
                {renderDays()}
            </Card>
        );
    }
}

// Export the redux-connected component
export default connect((state) => ({
    activities: selectActivities(state),
    openings: selectOpenings(state),
    calendars: selectCalendars(state),
    currentCalendarMonth: selectCurrentCalendarMonth(state),
    drawerIsOpen: selectDrawerIsOpen(state),
    events: selectEvents(state),
    user: selectUser(state),
}), {
    setCurrentCalendarMonth,
    setDrawerIsOpen,
})(Calendar);

Calendar.propTypes = {
    // -------------------------------------------------------------------------
    // Data propTypes
    // -------------------------------------------------------------------------
    // Redux -------------------------------------------------------------------
    calendars: PropTypes.object.isRequired,
    currentCalendarMonth: PropTypes.object.isRequired,
    drawerIsOpen: PropTypes.bool.isRequired,
    events: PropTypes.object.isRequired,
    activities: PropTypes.object.isRequired,
    openings: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,

    // -------------------------------------------------------------------------
    // Method propTypes
    // -------------------------------------------------------------------------
    // Redux -------------------------------------------------------------------
    setCurrentCalendarMonth: PropTypes.func.isRequired,
    setDrawerIsOpen: PropTypes.func.isRequired,
};

Calendar.defaultProps = {};
