//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import classNames from "classnames";
import format from "date-fns/format";
import isSameDay from "date-fns/isSameDay";
import { Route } from "react-router-dom";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core";

//------------------------------------------------------------------------------
// Redux Support
//------------------------------------------------------------------------------
import {
    selectCalendar,
    selectEvents,
} from "redux/reducers/calendarReducer";
import {
    selectDrawerIsOpen,
    selectScheduleEndDate,
    selectScheduleStartDate,
} from "redux/reducers/uiReducer";
import {
    fetchEcclesialCalendar,
    fetchEvents,
} from "redux/actions/calendarActions";
import {
    setDrawerIsOpen,
    setScheduleEndDate,
    setScheduleStartDate,
} from "redux/actions/uiActions";

//------------------------------------------------------------------------------
// Components
//------------------------------------------------------------------------------
import IconButton from "@material-ui/core/IconButton";
import Card from "@material-ui/core/Card";
import CircularProgress from "@material-ui/core/CircularProgress";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import { InlineDatePicker } from "material-ui-pickers";

//------------------------------------------------------------------------------
// Assets
//------------------------------------------------------------------------------
import styles from "features/app/components/Schedules/schedules.scss";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import {
    DATE_END_ECCLESIAL_SCHEDULE,
    DATE_START_ECCLESIAL_SCHEDULE,
    DATE_PICKER_THEME,
    EVENT_NAME_BIBLE_CLASS,
    EVENT_NAME_BIBLE_TALK,
    EVENT_NAME_HALL_CLEANING,
    EVENT_NAME_MEMORIAL_MEETING,
    DRAWER_WIDTH,
} from "utils/constants";
import { PAGE_ID_SCHEDULES } from "utils/backendConstants";
import { stringToHslColor } from "utils/generalUtils";
import { CalendarEvents } from "utils/CalendarEvents";
import { Calendar } from "utils/Calendar";
import { buildRelativePath } from "utils/appDataUtils";

//------------------------------------------------------------------------------

/**
 * Renders the schedules content.
 */
export class Schedules extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fixTableHead: false,
        };

        if (props.calendar !== null && props.events === null) {
            this.loadSchedule();
        }

        this.headerRefIntersectionObserver = null;
        this.headerRef = React.createRef();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.calendar === null && this.props.calendar !== null) {
            this.loadSchedule();
        }

        if (
            !isSameDay(prevProps.scheduleEndDate, this.props.scheduleEndDate) ||
            !isSameDay(prevProps.scheduleStartDate, this.props.scheduleStartDate)
        ) {
            this.loadSchedule();
        }

        if (
            this.headerRef.current !== null &&
            this.headerRefIntersectionObserver === null
        ) {
            this.initializeIntersectionObserver();
        } else if (prevProps.location.pathname !== this.props.location.pathname) {
            this.disconnectIntersectionObserver();
            this.initializeIntersectionObserver();
        }
    }

    componentWillUnmount() {
        this.disconnectIntersectionObserver();
    }

    disconnectIntersectionObserver() {
        if (this.headerRefIntersectionObserver) {
            this.headerRefIntersectionObserver.disconnect();
        }
    }

    initializeIntersectionObserver() {
        const callback = (entries) => {
            const entry = entries[0];

            if (!entry.isIntersecting && entry.intersectionRatio === 0) {
                this.setState({ fixTableHead: true });
            } else {
                this.setState({ fixTableHead: false });
            }
        };

        this.headerRefIntersectionObserver = new IntersectionObserver(callback);
        this.headerRefIntersectionObserver.observe(this.headerRef.current);
    }

    loadSchedule() {
        const calendar = new Calendar(this.props.calendar);
        const eventIds = calendar.getEvents().getIdsByRange(
            this.props.scheduleStartDate,
            this.props.scheduleEndDate,
        );

        this.props.fetchEvents(eventIds);
    }

    render() {
        const calendar = (this.props.calendar !== null)
            ? new Calendar(this.props.calendar)
            : null;
        const accountName = (calendar === null)
            ? "Loading..."
            : calendar.getAccountName();
        const accountColor = (calendar === null)
            ? stringToHslColor(accountName)
            : calendar.getAccountColor();
        const fullScreenIcon = (this.props.drawerIsOpen)
            ? <FullscreenIcon />
            : <FullscreenExitIcon color="secondary" />;
        const calendarEvents = (this.props.events === null)
            ? false
            : new CalendarEvents(this.props.events);
        const bibleClassEvents = (this.props.events === null)
            ? []
            : calendarEvents.getBibleClassEvents();
        const bibleTalkEvents = (this.props.events === null)
            ? []
            : calendarEvents.getBibleTalkEvents();
        const hallCleaningEvents = (this.props.events === null)
            ? []
            : calendarEvents.getHallCleaningEvents();
        const memorialMeetingEvents = (this.props.events === null)
            ? []
            : calendarEvents.getMemorialMeetingEvents();
        let tableHeadWidth;

        if (this.state.fixTableHead) {
            if (this.props.drawerIsOpen) {
                tableHeadWidth = `calc(100% - ${DRAWER_WIDTH} - 1em)`;
            } else {
                tableHeadWidth = "calc(100% - 1em)";
            }
        } else {
            tableHeadWidth = "100%";
        }

        const buildPath = (eventType) => buildRelativePath(
            PAGE_ID_SCHEDULES,
            [calendarEvents.getEventPath(eventType)],
        );
        const header = (scheduleName) => (
            <header
                className={styles.header}
                ref={this.headerRef}
            >
                <div className={styles.preWrap}>
                    <IconButton
                        className={styles.fullScreenButton}
                        onClick={
                            () => this.props.setDrawerIsOpen(
                                !this.props.drawerIsOpen,
                            )
                        }
                    >
                        {fullScreenIcon}
                    </IconButton>
                </div>
                <div className={styles.leftWrap}>
                    <span className={styles.allHeading}>
                        {`${scheduleName} schedule`}
                    </span>
                    <div className={styles.accountNameWrap}>
                        <i
                            className={styles.accountDot}
                            style={{ backgroundColor: accountColor }}
                        />
                        <span className={styles.accountName}>{accountName}</span>
                    </div>
                </div>
                <div className={styles.rightWrap}>
                    <MuiThemeProvider theme={createMuiTheme(DATE_PICKER_THEME)}>
                        <InlineDatePicker
                            autoOk
                            className={styles.pickerField}
                            keyboard
                            keyboardIcon={
                                <CalendarTodayIcon className={styles.pickerAdornment} />
                            }
                            format="dd/MM/yyyy"
                            mask={[/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/]}
                            InputAdornmentProps={{
                                className: styles.inputAdornment,
                            }}
                            placeholder={format(this.props.scheduleStartDate, "dd/MM/yyyy")}
                            label="From"
                            maxDate={DATE_END_ECCLESIAL_SCHEDULE}
                            minDate={DATE_START_ECCLESIAL_SCHEDULE}
                            leftArrowIcon={<KeyboardArrowLeftIcon />}
                            rightArrowIcon={<KeyboardArrowRightIcon />}
                            value={this.props.scheduleStartDate}
                            variant="standard"
                            onChange={(date) => this.props.setScheduleStartDate(date)}
                        />
                        <InlineDatePicker
                            autoOk
                            className={styles.pickerField}
                            keyboard
                            keyboardIcon={
                                <CalendarTodayIcon className={styles.pickerAdornment} />
                            }
                            format="dd/MM/yyyy"
                            mask={[/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/]}
                            InputAdornmentProps={{
                                className: styles.inputAdornment,
                            }}
                            placeholder={format(this.props.scheduleStartDate, "dd/MM/yyyy")}
                            label="To"
                            maxDate={DATE_END_ECCLESIAL_SCHEDULE}
                            minDate={this.props.scheduleStartDate}
                            leftArrowIcon={<KeyboardArrowLeftIcon />}
                            rightArrowIcon={<KeyboardArrowRightIcon />}
                            value={this.props.scheduleEndDate}
                            onChange={(date) => this.props.setScheduleEndDate(date)}
                        />
                    </MuiThemeProvider>
                </div>
            </header>
        );
        const tableHeader = (events) => {
            const firstEvent = events[0];
            const activities = [...firstEvent.getActivities().values()];
            const dateCell = <TableCell className={styles.headerCell}>Date</TableCell>;
            const tableHeadClassNames = classNames({
                [styles.tableHead]: true,
                [styles.fixed]: this.state.fixTableHead,
            });
            const activityCells = activities.map((activity) => {
                const name = activity.getName();
                return (
                    <TableCell
                        className={styles.headerCell}
                        key={name}
                    >
                        {name}
                    </TableCell>
                );
            });

            return (
                <TableHead
                    className={tableHeadClassNames}
                    style={{ width: tableHeadWidth }}
                >
                    <TableRow className={styles.headerRow}>
                        {dateCell}
                        {activityCells}
                    </TableRow>
                </TableHead>
            );
        };
        const rows = (events) => events.map((event) => {
            const activities = [...event.getActivities().values()];
            const activityCells = activities.map((activity) => {
                const openings = activity.getOpenings();
                return (
                    <TableCell
                        className={styles.tableCell}
                        key={`activity${activity.getId()}`}
                    >
                        {
                            (openings.length > 1)
                                ? (
                                    openings.map((opening) => (
                                        <div
                                            className={styles.opening}
                                            key={`opening${opening.getId()}`}
                                        >
                                            {opening.getName()}
                                        </div>
                                    ))
                                )
                                : false
                        }
                    </TableCell>
                );
            });
            const dateCell = (
                <TableCell
                    className={styles.tableCell}
                    key={`date${event.getId()}`}
                >
                    {format(event.getStartDate(), "MMM. dd")}
                </TableCell>
            );
            return (
                <TableRow
                    className={styles.tableRow}
                    key={`event${event.getId()}`}
                >
                    {dateCell}
                    {activityCells}
                </TableRow>
            );
        });
        const page = (scheduleName, events) => (
            <div>
                {header(scheduleName)}
                <Card className={styles.card}>
                    <Table className={styles.table}>
                        {<tbody className={styles.tableHeadPlaceholder}></tbody>}
                        {tableHeader(events)}
                        <TableBody>
                            {rows(events)}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        );
        const routedPage = () => {
            const rootSchedulesPath = `/${PAGE_ID_SCHEDULES}`;
            const defaultPath = buildPath(EVENT_NAME_MEMORIAL_MEETING);

            if (this.props.location.pathname === rootSchedulesPath) {
                this.props.history.replace(defaultPath);
            }

            return (
                <div>
                    <Route
                        path={buildPath(EVENT_NAME_BIBLE_CLASS)}
                        render={() => page(EVENT_NAME_BIBLE_CLASS, bibleClassEvents)}
                    />
                    <Route
                        path={buildPath(EVENT_NAME_BIBLE_TALK)}
                        render={() => page(EVENT_NAME_BIBLE_TALK, bibleTalkEvents)}
                    />
                    <Route
                        path={buildPath(EVENT_NAME_HALL_CLEANING)}
                        render={() => page(EVENT_NAME_HALL_CLEANING, hallCleaningEvents)}
                    />
                    <Route
                        path={defaultPath}
                        render={
                            () => page(EVENT_NAME_MEMORIAL_MEETING, memorialMeetingEvents)
                        }
                    />
                    <Route
                        exact
                        path={rootSchedulesPath}
                        render={
                            () => page(EVENT_NAME_MEMORIAL_MEETING, memorialMeetingEvents)
                        }
                    />
                </div>
            );
        };
        const renderPage = () => {
            let returnVal = false;

            if (this.props.events !== null) {
                returnVal = routedPage();
            } else {
                returnVal = (
                    <div className={styles.progressWrap}>
                        <CircularProgress className={styles.circProgress} />
                    </div>
                );
            }

            return returnVal;
        };

        return renderPage();
    }
}

// Export the redux-connected component
export default withRouter(connect((state) => ({
    calendar: selectCalendar(state),
    events: selectEvents(state),
    drawerIsOpen: selectDrawerIsOpen(state),
    scheduleEndDate: selectScheduleEndDate(state),
    scheduleStartDate: selectScheduleStartDate(state),
}), {
    fetchEcclesialCalendar,
    fetchEvents,
    setDrawerIsOpen,
    setScheduleEndDate,
    setScheduleStartDate,
})(Schedules));

Schedules.propTypes = {
    // -------------------------------------------------------------------------
    // Data propTypes
    // -------------------------------------------------------------------------
    // Redux -------------------------------------------------------------------
    calendar: PropTypes.object,
    drawerIsOpen: PropTypes.bool.isRequired,
    events: PropTypes.array,
    scheduleEndDate: PropTypes.object.isRequired,
    scheduleStartDate: PropTypes.object.isRequired,

    // React Router ------------------------------------------------------------
    history: PropTypes.object,
    location: PropTypes.object,

    // -------------------------------------------------------------------------
    // Method propTypes
    // -------------------------------------------------------------------------
    // Redux -------------------------------------------------------------------
    fetchEcclesialCalendar: PropTypes.func.isRequired,
    fetchEvents: PropTypes.func.isRequired,
    setDrawerIsOpen: PropTypes.func.isRequired,
    setScheduleEndDate: PropTypes.func.isRequired,
    setScheduleStartDate: PropTypes.func.isRequired,
};

Schedules.defaultProps = {};
