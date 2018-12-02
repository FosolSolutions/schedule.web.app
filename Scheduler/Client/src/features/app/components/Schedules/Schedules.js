//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import isEmpty from "lodash/isEmpty";
import isUndefined from "lodash/isUndefined";
import format from "date-fns/format";
import { Route } from "react-router-dom";

//------------------------------------------------------------------------------
// Redux Support
//------------------------------------------------------------------------------
import {
    selectCalendars,
    selectActivities,
    selectOpenings,
    selectOpeningsIsLoading,
    selectEvents,
    selectAnswers,
} from "redux/reducers/calendarReducer";
import {
    selectDrawerIsOpen,
    selectScheduleEndDate,
    selectScheduleStartDate,
} from "redux/reducers/uiReducer";
import {
    selectUser,
    selectUserAttributes,
} from "redux/reducers/userReducer";
import {
    applyToOpening,
    fetchOpening,
    setAnswer,
    unapplyFromOpening,
} from "redux/actions/calendarActions";
import {
    setDrawerIsOpen,
    setScheduleEndDate,
    setScheduleStartDate,
} from "redux/actions/uiActions";

//------------------------------------------------------------------------------
// Components
//------------------------------------------------------------------------------
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Card from "@material-ui/core/Card";
import CircularProgress from "@material-ui/core/CircularProgress";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Tooltip from "@material-ui/core/Tooltip";

import InitialsAvatar from "features/ui/components/InitialsAvatar/InitialsAvatar";
import OpeningQuestions from "features/app/components/OpeningQuestions/OpeningQuestions";
import ScheduleTableHeader from "features/app/components/ScheduleTableHeader/ScheduleTableHeader";
import DialogWithContent from "features/ui/components/DialogWithContent/DialogWithContent";

//------------------------------------------------------------------------------
// Assets
//------------------------------------------------------------------------------
import styles from "features/app/components/Schedules/schedules.scss";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import EditIcon from "@material-ui/icons/Edit";
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit";
import FullscreenIcon from "@material-ui/icons/Fullscreen";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import {
    COLOR_SECONDARY_EXTRA_LIGHT,
    EVENT_NAME_BIBLE_CLASS,
    EVENT_NAME_BIBLE_TALK,
    EVENT_NAME_HALL_CLEANING,
    EVENT_NAME_MEMORIAL_MEETING,
    ACTIVITY_NAME_PRESIDE,
    ACTIVITY_NAME_PRESIDER,
} from "utils/constants";
import { PAGE_ID_SCHEDULES } from "utils/backendConstants";
import { stringToHslColor } from "utils/generalUtils";
import {
    buildRelativePath,
    getEventPath,
    meetsCriteria,
} from "utils/appDataUtils";
import { required } from "utils/validatorRules";

//------------------------------------------------------------------------------

/**
 * Renders the schedules content.
 */
export class Schedules extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            openOpeningDialogId: null,
        };

        this.questionValidatorRules = [
            required("Response"),
        ];
    }

    shouldComponentUpdate(nextProps) {
        let returnVal = true;

        if (
            this.state.openOpeningDialogId !== null &&
            !this.props.openingsIsLoading &&
            !nextProps.openingsIsLoading
        ) {
            returnVal = false;
        }

        return returnVal;
    }

    componentDidUpdate(prevProps) {
        const openOpening = this.state.openOpeningDialogId;

        if (
            this.state.openOpeningDialogId !== null &&
            prevProps.openingsIsLoading &&
            !this.props.openingsIsLoading
        ) {
            const opening = this.props.openings.getOpening(openOpening);
            const openingId = opening.getId();
            const applications = opening.getApplications();
            const userApplication = applications.filter(
                (application) => (
                    application.getParticipant().getId() === this.props.user.getId()
                ),
            );

            if (userApplication.length > 0) {
                userApplication[0].getAnswers().forEach((answer) => {
                    const questionId = answer.getQuestionId();
                    const answerText = answer.getText();

                    if (this.props.answers[openingId][questionId] !== answerText) {
                        this.props.setAnswer(openingId, questionId, answerText);
                    }
                });
            }
        }
    }

    buildPath(eventType) {
        return buildRelativePath(
            PAGE_ID_SCHEDULES,
            [getEventPath(eventType)],
        );
    }

    handleApplyButtonClick(openingId, rowVersion) {
        const answers = (
            this.props.openings.getOpening(openingId).getQuestions().length > 0
        )
            ? Object.keys(this.props.answers[openingId]).map((key) => ({
                openingId,
                questionId: key,
                text: this.props.answers[openingId][key],
                options: [],
            }))
            : [];

        this.props.applyToOpening(answers, openingId, rowVersion);
    }

    handleUnapplyButtonClick(openingId, rowVersion, onSuccess) {
        this.props.unapplyFromOpening(openingId, rowVersion, onSuccess);
    }

    handleOpenQuestionDialog(opening) {
        const openingId = opening.getId();

        this.setState({ openOpeningDialogId: openingId });
        this.props.fetchOpening(openingId);
    }

    handleQuestionDialogSubmit(opening) {
        const openingId = opening.getId();
        const rowVersion = opening.getRowVersion();
        const applications = opening.getApplications();
        const userApplication = applications.filter(
            (application) => (
                application.getParticipant().getId() === this.props.user.getId()
            ),
        );

        if (userApplication.length > 0) {
            this.handleUnapplyButtonClick(
                openingId,
                rowVersion,
                () => this.handleApplyButtonClick(openingId, rowVersion),
            );
        } else {
            this.handleApplyButtonClick(openingId, rowVersion);
        }
    }

    render() {
        const calendar = this.props.calendars.getAllValues()[0];
        const allActivities = this.props.activities.getAll();
        const calendarIsUndefined = isUndefined(calendar);
        const accountName = calendarIsUndefined ? "Loading..." : calendar.getAccountName();
        const accountColor = calendarIsUndefined
            ? stringToHslColor(accountName)
            : calendar.getAccountColor();
        const fullScreenIcon = (this.props.drawerIsOpen)
            ? <FullscreenIcon />
            : <FullscreenExitIcon color="secondary" />;
        const firstColumnStyle = {
            width: "86px",
        };
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
            </header>
        );
        const rows = (events) => events.map((event) => {
            const activities = event.getActivities().map(
                (activityId) => allActivities.get(activityId),
            );

            const activityCells = activities.map((activity) => {
                let returnVal;
                const name = activity.getName();
                const openings = activity.getOpenings().map(
                    (openingId) => this.props.openings.getAll().get(openingId),
                );

                if (
                    event.getName() !== EVENT_NAME_MEMORIAL_MEETING &&
                (
                    name === ACTIVITY_NAME_PRESIDE ||
                    name === ACTIVITY_NAME_PRESIDER
                )
                ) {
                    returnVal = false;
                } else {
                    returnVal = (
                        <TableCell
                            data-heading={activity.getName()}
                            className={styles.tableCell}
                            key={`activity${activity.getId()}`}
                        >
                            {renderOpenings(openings, activity)}
                        </TableCell>
                    );
                }

                return returnVal;
            });
            const dateCell = (
                <TableCell
                    data-heading="Date"
                    className={`${styles.tableCell} ${styles.mobileHeading}`}
                    key={`date${event.getId()}`}
                >
                    <span>{format(event.getStartDate(), "MMM. dd")}</span>
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
        const renderOpenings = (openings, activity) => {
            const criteria = activity.getCriteria();
            let openingsMarkup;

            if (openings.length > 1) {
                openingsMarkup = openings.map(
                    (opening) => renderOpening(opening, criteria, true),
                );
            } else if (openings.length === 1) {
                openingsMarkup = renderOpening(openings[0], criteria, false);
            } else {
                openingsMarkup = false;
            }

            return openingsMarkup;
        };
        const renderOpening = (opening, activityCriteria, withName) => {
            const openingId = opening.getId();
            const openingRequestInProgress = this.props.openingsIsLoading === openingId;
            const applyText = "Apply";
            const openingButtonText = withName ? opening.getName() : applyText;
            const isOpeningName = openingButtonText !== applyText;
            const userMeetsCriteria = meetsCriteria(
                activityCriteria,
                this.props.userAttributes,
            );
            const applications = opening.getApplications();
            const isFilled = applications.length === opening.getMaxParticipants();
            const questions = opening.getQuestions();
            const dialogApplyButtonProps = {
                className: styles.applyButton,
                disabled: openingRequestInProgress,
            };
            const buttonProps = {
                ...dialogApplyButtonProps,
                onClick: () => this.handleApplyButtonClick(
                    openingId,
                    opening.getRowVersion(),
                ),
            };
            const applyButtonContent = (
                <span className={styles.applyButtonContent}>
                    <AddCircleIcon className={styles.applyButtonIcon} />
                    {openingButtonText}
                </span>
            );
            const applyButtonMarkup = userMeetsCriteria
                ? (
                    <div className={styles.progressWrapper}>
                        <Button {...buttonProps} >
                            {applyButtonContent}
                        </Button>
                        {
                            (this.props.openingsIsLoading === openingId)
                                ? renderOpeningProgress(styles.openingProgressTextButton)
                                : false
                        }
                    </div>
                )
                : false;
            const dialogButtonMarkup = userMeetsCriteria
                ? renderQuestionsDialog(
                    opening,
                    questions,
                    dialogApplyButtonProps,
                    null,
                    applyButtonContent,
                )
                : false;
            const control = (opening.getHasQuestions())
                ? dialogButtonMarkup
                : applyButtonMarkup;
            const nameArg = (isOpeningName) ? openingButtonText : false;

            return (
                <div
                    className={styles.opening}
                    key={`opening${opening.getId()}`}
                >
                    {
                        renderOpeningParticipants(
                            applications,
                            opening,
                            nameArg,
                        )
                    }
                    {(!isFilled) ? control : false}
                </div>
            );
        };
        const renderOpeningProgress = (className) => (
            <CircularProgress
                className={className || styles.openingProgressIconButton}
                thickness={6}
                size={22}
            />
        );
        const renderQuestionsDialog = (
            opening,
            questions,
            launchButtonProps,
            icon = null,
            content = null,
        ) => {
            const openingId = opening.getId();
            const progress = (opening.getTitle() !== null)
                ? false
                : renderOpeningProgress(styles.openingProgressTextButton);
            const questionMarkup = (questions.length > 0)
                ? (
                    <OpeningQuestions
                        openingId={openingId}
                        questions={questions}
                    />
                )
                : (
                    <div className={styles.progressWrap}>
                        <CircularProgress
                            thickness={4}
                            size={22}
                        />
                    </div>
                );
            const buttonContent = (icon === null) ? content : icon;
            const launchButton = (icon === null) ? Button : IconButton;

            return (
                <DialogWithContent
                    launchButton={launchButton}
                    buttonContent={buttonContent}
                    launchButtonProps={launchButtonProps}
                    progress={progress}
                    handleClose={() => this.setState({ openOpeningDialogId: null })}
                    handleOpen={() => this.handleOpenQuestionDialog(opening)}
                    handleSubmit={() => this.handleQuestionDialogSubmit(opening)}
                    withProgress={this.props.openingsIsLoading === openingId}
                >
                    {questionMarkup}
                </DialogWithContent>
            );
        };
        const renderOpeningParticipants = (
            applications,
            opening,
            openingName,
        ) => applications.map(
            (application) => {
                const participant = application.getParticipant();
                const openingId = application.getOpeningId();
                const openingRequestInProgress = (
                    this.props.openingsIsLoading === openingId
                );
                const questions = opening.getQuestions();
                const firstName = participant.getFirstName();
                const lastName = participant.getLastName();
                const isMe = participant.getId() === this.props.user.getId();
                const avatarProps = {
                    firstName,
                    lastName,
                    avatarColor: isMe ? null : COLOR_SECONDARY_EXTRA_LIGHT,
                };
                const title = opening.getTitle();
                const wrappedAvatar = (
                    <span className={styles.avatarWrap}>
                        {
                            isMe
                                ? (
                                    <div className={styles.progressWrapper}>
                                        <IconButton
                                            className={styles.unapplyButton}
                                            disabled={openingRequestInProgress}
                                            onClick={
                                                () => this.handleUnapplyButtonClick(
                                                    openingId,
                                                    this.props.openings
                                                        .getOpening(openingId)
                                                        .getRowVersion(),
                                                )
                                            }
                                        >
                                            <CancelIcon className={styles.unapplyIcon} />
                                        </IconButton>
                                        {
                                            (this.props.openingsIsLoading === openingId)
                                                ? renderOpeningProgress(
                                                    styles.openingProgressUnapplyButton,
                                                )
                                                : false
                                        }
                                    </div>
                                )
                                : false
                        }
                        <InitialsAvatar {...avatarProps} />
                    </span>
                );
                const titleButtonContent = (
                    <span className={styles.editableTitleWrap}>
                        <EditIcon className={styles.editableTitleIcon} />
                        <span className={styles.editableTitle}>{title}</span>
                    </span>
                );
                const launchButtonProps = {
                    className: styles.titleButton,
                    disableRipple: true,
                };
                const titleMarkup = (title !== null)
                    ? (
                        <span
                            className={styles.openingTitle}
                            key={`${openingId}_title`}
                        >
                            {
                                (isMe)
                                    ? renderQuestionsDialog(
                                        opening,
                                        questions,
                                        launchButtonProps,
                                        null,
                                        titleButtonContent,
                                    )
                                    : title
                            }
                        </span>
                    )
                    : false;
                const openingNameMarkup = openingName !== false
                    ? <span
                        key={`opening${openingId}_name`}
                        className={styles.nameWithAvatar}
                    >
                        {openingName}
                    </span>
                    : false;

                return [
                    <Tooltip
                        key={`${openingId}_${participant.getId()}_opening_participant`}
                        classes={{
                            tooltip: styles.avatarTooltip,
                        }}
                        placement="top"
                        title={`${participant.getDisplayName()}`}
                    >
                        {wrappedAvatar}
                    </Tooltip>,
                    openingNameMarkup,
                    titleMarkup,
                ];
            },
        );
        const page = (scheduleName, events) => (
            <div>
                {header(scheduleName)}
                <Card className={styles.card}>
                    <Table className={styles.table}>
                        <colgroup>
                            <col style={firstColumnStyle} />
                        </colgroup>
                        {
                            !isEmpty(events)
                                ? (
                                    <ScheduleTableHeader
                                        event={events[0]}
                                        firstColumnStyle={firstColumnStyle}
                                    />
                                )
                                : false
                        }
                        <TableBody>
                            {rows(events)}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        );
        const routedPage = () => {
            const rootSchedulesPath = `/${PAGE_ID_SCHEDULES}`;
            const defaultPath = this.buildPath(EVENT_NAME_MEMORIAL_MEETING);
            const memorialMeetingEvents = this.props.events.getMemorialMeetingEvents();

            if (this.props.location.pathname === rootSchedulesPath) {
                this.props.history.replace(defaultPath);
            }

            return (
                <div>
                    <Route
                        path={this.buildPath(EVENT_NAME_BIBLE_CLASS)}
                        render={
                            () => page(
                                EVENT_NAME_BIBLE_CLASS,
                                this.props.events.getBibleClassEvents(),
                            )
                        }
                    />
                    <Route
                        path={this.buildPath(EVENT_NAME_BIBLE_TALK)}
                        render={
                            () => page(
                                EVENT_NAME_BIBLE_TALK,
                                this.props.events.getBibleTalkEvents(),
                            )
                        }
                    />
                    <Route
                        path={this.buildPath(EVENT_NAME_HALL_CLEANING)}
                        render={
                            () => page(
                                EVENT_NAME_HALL_CLEANING,
                                this.props.events.getHallCleaningEvents(),
                            )
                        }
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

            if (this.props.activities.getAllValues().length > 0) {
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
    answers: selectAnswers(state),
    calendars: selectCalendars(state),
    activities: selectActivities(state),
    openings: selectOpenings(state),
    openingsIsLoading: selectOpeningsIsLoading(state),
    events: selectEvents(state),
    drawerIsOpen: selectDrawerIsOpen(state),
    scheduleEndDate: selectScheduleEndDate(state),
    scheduleStartDate: selectScheduleStartDate(state),
    user: selectUser(state),
    userAttributes: selectUserAttributes(state),
}), {
    applyToOpening,
    fetchOpening,
    setAnswer,
    setDrawerIsOpen,
    setScheduleEndDate,
    setScheduleStartDate,
    unapplyFromOpening,
})(Schedules));

Schedules.propTypes = {
    // -------------------------------------------------------------------------
    // Data propTypes
    // -------------------------------------------------------------------------
    // Redux -------------------------------------------------------------------
    answers: PropTypes.object.isRequired,
    calendars: PropTypes.object.isRequired,
    activities: PropTypes.object.isRequired,
    openings: PropTypes.object.isRequired,
    openingsIsLoading: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]).isRequired,
    drawerIsOpen: PropTypes.bool.isRequired,
    events: PropTypes.object.isRequired,
    scheduleEndDate: PropTypes.object.isRequired,
    scheduleStartDate: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    userAttributes: PropTypes.array.isRequired,

    // React Router ------------------------------------------------------------
    history: PropTypes.object,
    location: PropTypes.object,

    // -------------------------------------------------------------------------
    // Method propTypes
    // -------------------------------------------------------------------------
    // Redux -------------------------------------------------------------------
    applyToOpening: PropTypes.func.isRequired,
    fetchOpening: PropTypes.func.isRequired,
    setAnswer: PropTypes.func.isRequired,
    setDrawerIsOpen: PropTypes.func.isRequired,
    setScheduleEndDate: PropTypes.func.isRequired,
    setScheduleStartDate: PropTypes.func.isRequired,
    unapplyFromOpening: PropTypes.func.isRequired,
};

Schedules.defaultProps = {};
