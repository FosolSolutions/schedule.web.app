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
import { selectCalendar } from "redux/reducers/calendarReducer";
import { selectDrawerIsOpen } from "redux/reducers/uiReducer";
import { setDrawerIsOpen } from "redux/actions/uiActions";

//------------------------------------------------------------------------------
// Components
//------------------------------------------------------------------------------
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import IconButton from "@material-ui/core/IconButton";

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
 * Renders an avatar using the user's initials.
 */
export class Calendar extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            currentMonth: new Date(),
            selectedDate: new Date(),
        };
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
            const dateFormat = "iii";
            const days = [];
            const startDate = startOfWeek(this.state.currentMonth);
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
                    dayEvents = (!isEmpty(this.props.calendar))
                        ? this.props.calendar.getEvents().getAllByDay(day)
                        : [];
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
        const renderEvents = (events, day) => {
            const eventsMarkup = [];
            events.forEach((event) => {
                const eventName = event.getName();
                const eventClassNames = classNames({
                    [styles.event]: true,
                    [styles.past]: isBefore(day, this.state.selectedDate),
                });

                if (isSameMonth(this.state.currentMonth, event.getStartDate())) {
                    eventsMarkup.push(
                        (
                            <div
                                className={eventClassNames}
                                key={eventName}
                            >
                                <i
                                    className={styles.accountDot}
                                    style={{
                                        backgroundColor:
                                            this.props.calendar.getAccountColor(),
                                    }}
                                />
                                {eventName}
                            </div>
                        ),
                    );
                }
            });

            return eventsMarkup;
        };

        return (
            <Card >
                {renderHeader()}
                {renderWeekDays()}
                {renderDays()}
            </Card>
        );
    }
}

// Export the redux-connected component
export default connect((state) => ({
    calendar: selectCalendar(state),
    drawerIsOpen: selectDrawerIsOpen(state),
}), {
    setDrawerIsOpen,
})(Calendar);

Calendar.propTypes = {
    // -------------------------------------------------------------------------
    // Data propTypes
    // -------------------------------------------------------------------------
    // Redux -------------------------------------------------------------------
    calendar: PropTypes.object,
    drawerIsOpen: PropTypes.bool.isRequired,

    // -------------------------------------------------------------------------
    // Method propTypes
    // -------------------------------------------------------------------------
    // Redux -------------------------------------------------------------------
    setDrawerIsOpen: PropTypes.func.isRequired,
};

Calendar.defaultProps = {};
