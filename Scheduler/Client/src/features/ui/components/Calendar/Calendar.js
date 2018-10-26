//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import isEmpty from "lodash/isEmpty";
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
import { fetchCalendarInRange } from "redux/actions/calendarsActions";
import { selectCalendar } from "redux/reducers/calendarsReducer";

//------------------------------------------------------------------------------
// Components
//------------------------------------------------------------------------------
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import Chip from "@material-ui/core/Chip";
import IconButton from "@material-ui/core/IconButton";

//------------------------------------------------------------------------------
// Assets
//------------------------------------------------------------------------------
import styles from "features/ui/components/Calendar/calendar.scss";
import EventIcon from "@material-ui/icons/Event";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";

//------------------------------------------------------------------------------

/**
 * Renders an avatar using the user's initials.
 */
export class Calendar extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            currentMonth: new Date(),
            selectedDate: new Date(),
        };

        props.fetchCalendarInRange(
            startOfMonth(this.state.currentMonth),
            endOfMonth(this.state.currentMonth),
        );
    }

    componentDidUpdate(prevProps, prevState) {
        if (!isSameMonth(this.state.currentMonth, prevState.currentMonth)) {
            this.props.fetchCalendarInRange(
                startOfMonth(this.state.currentMonth),
                endOfMonth(this.state.currentMonth),
            );
        }
    }

    onDateClick(day) {
        this.setState({
            selectedDate: day,
        });
    }

    nextMonth() {
        this.setState({
            currentMonth: addMonths(this.state.currentMonth, 1),
        });
    }

    prevMonth() {
        this.setState({
            currentMonth: subMonths(this.state.currentMonth, 1),
        });
    }

    today() {
        this.setState({
            currentMonth: new Date(),
            selectedDate: new Date(),
        });
    }

    render() {
        const renderHeader = () => {
            const dateFormat = "MMMM yyyy";
            return (
                <div className={styles.header}>
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
                            {format(this.state.currentMonth, dateFormat)}
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
            const dateFormat = "EEE";
            const days = [];
            const startDate = startOfWeek(this.state.currentMonth);
            let formattedDate;

            for (let i = 0; i < 7; i += 1) {
                formattedDate = format(
                    addDays(startDate, i),
                    dateFormat,
                    { awareOfUnicodeTokens: true },
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
            const monthStart = startOfMonth(this.state.currentMonth);
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

            while (day <= endDate) {
                for (let i = 0; i < 7; i += 1) {
                    dayEvents = (!isEmpty(this.props.calendar))
                        ? this.props.calendar.getEvents().getByDay(day)
                        : [];
                    dayClassNames = classNames({
                        [styles.day]: true,
                        [styles.disabled]: !isSameMonth(day, monthStart),
                        [styles.selected]: isSameDay(day, this.state.selectedDate),
                    });
                    formattedDate = format(
                        day,
                        dateFormat,
                        { awareOfUnicodeTokens: true },
                    );
                    days.push(
                        <div
                            className={dayClassNames}
                            key={day}
                        >
                            <span className={styles.number}>{formattedDate}</span>
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
        const renderEvents = (events, day) => {
            const eventsMarkup = [];
            events.forEach((event) => {
                const eventName = event.getName();
                const eventClassNames = classNames({
                    [styles.event]: true,
                    [styles.past]: isBefore(day, this.state.selectedDate),
                });

                eventsMarkup.push(
                    (
                        <div
                            className={eventClassNames}
                            key={eventName}
                        >
                            {eventName}
                        </div>
                    ),
                );
            });

            return eventsMarkup;
        };

        return [
            <Chip
                className={styles.chip}
                avatar={
                    <Avatar className={styles.chipAvatar}><EventIcon /></Avatar>
                }
                key="dashboardChip"
                label="Calendar"
            />,
            <Card key="calendar">
                {renderHeader()}
                {renderWeekDays()}
                {renderDays()}
            </Card>,
        ];
    }
}

// Export the redux-connected component
export default connect((state) => ({
    calendar: selectCalendar(state),
}), {
    fetchCalendarInRange,
})(Calendar);

Calendar.propTypes = {
    // -------------------------------------------------------------------------
    // Data propTypes
    // -------------------------------------------------------------------------
    calendar: PropTypes.object.isRequired,

    // -------------------------------------------------------------------------
    // Method propTypes
    // -------------------------------------------------------------------------
    fetchCalendarInRange: PropTypes.func.isRequired,
};

Calendar.defaultProps = {};
