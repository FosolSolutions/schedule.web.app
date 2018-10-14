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
import isSameMonth from "date-fns/isSameMonth";
import isSameDay from "date-fns/isSameDay";
import toDate from "date-fns/toDate";

//------------------------------------------------------------------------------
// Redux Support
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Components
//------------------------------------------------------------------------------
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";

//------------------------------------------------------------------------------
// Assets
//------------------------------------------------------------------------------
import styles from "features/ui/components/Calendar/calendar.scss";
import EventIcon from "@material-ui/icons/Event";

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

    render() {
        const renderHeader = () => {
            const dateFormat = "MMMM yyyy";
            return (
                <div className={`${styles.header} ${styles.row} ${styles["flex-middle"]}`}>
                    <div className={`${styles.col} ${styles["col-start"]}`}>
                        <div className={styles.icon}
                            onClick={() => this.prevMonth()}>
                    chevron_left
                        </div>
                    </div>
                    <div className={`${styles.col} ${styles["col-center"]}`}>
                        <span>
                            {format(this.state.currentMonth, dateFormat)}
                        </span>
                    </div>
                    <div className={`${styles.col} ${styles["col-end"]}`}
                        onClick={() => this.nextMonth()}>
                        <div className={styles.icon}>chevron_right</div>
                    </div>
                </div>
            );
        };
        const renderDays = () => {
            const dateFormat = "EEE";
            const days = [];
            const startDate = startOfWeek(this.state.currentMonth);
            for (let i = 0; i < 7; i++) {
                days.push(
                    <div className={`${styles.col} ${styles["col-center"]}`}
                        key={i}>
                        {format(addDays(startDate, i), dateFormat, { awareOfUnicodeTokens: true })}
                    </div>,
                );
            }
            return <div className={`${styles.days} ${styles.row}`}>{days}</div>;
        };

        const renderCells = () => {
            const { currentMonth, selectedDate } = this.state;
            const monthStart = startOfMonth(currentMonth);
            const monthEnd = endOfMonth(monthStart);
            const startDate = startOfWeek(monthStart);
            const endDate = endOfWeek(monthEnd);

            const dateFormat = "d";
            const rows = [];

            let days = [];
            let day = startDate;
            let formattedDate = "";

            while (day <= endDate) {
                for (let i = 0; i < 7; i++) {
                    formattedDate = format(day, dateFormat, { awareOfUnicodeTokens: true });
                    const cloneDay = day;
                    days.push(
                        <div
                            className={`${styles.col} ${styles.cell} ${
                                !isSameMonth(day, monthStart)
                                    ? styles.disabled
                                    : isSameDay(day, selectedDate) ? styles.selected : ""
                            }`}
                            key={day}
                            onClick={() => this.onDateClick(toDate(cloneDay))}
                        >
                            <span className={styles.number}>{formattedDate}</span>
                            <span className={styles.bg}>{formattedDate}</span>
                        </div>,
                    );
                    day = addDays(day, 1);
                }
                rows.push(
                    <div className={styles.row}
                        key={day}>
                        {days}
                    </div>,
                );
                days = [];
            }
            return <div className={styles.body}>{rows}</div>;
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
            <div
                className={styles.calendar}
                key="calendar"
            >
                {renderHeader()}
                {renderDays()}
                {renderCells()}
            </div>,
        ];
    }
}

/**
 * Map values from redux store state to props
 *
 * @param  {Object} state Redux store state
 *
 * @return {Object}       Object map of props
 */
function mapStateToProps(state) {
    return {
    };
}

// Export the redux-connected component
export default connect(mapStateToProps, null)(Calendar);

Calendar.propTypes = {
    // -------------------------------------------------------------------------
    // Data propTypes
    // -------------------------------------------------------------------------
};

Calendar.defaultProps = {};
