//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

//------------------------------------------------------------------------------
// Redux Support
//------------------------------------------------------------------------------
import {
    selectCalendarsError,
    selectEventsError,
    selectOpeningsError,
} from "redux/reducers/calendarReducer";
import { selectUserError } from "redux/reducers/userReducer";
import { selectSnackbars } from "redux/reducers/uiReducer";
import { setSnackbarContent } from "redux/actions/uiActions";

//------------------------------------------------------------------------------
// Components
//------------------------------------------------------------------------------
import Snackbar from "@material-ui/core/Snackbar";
import ErrorIcon from "@material-ui/icons/Error";

//------------------------------------------------------------------------------
// Assets
//------------------------------------------------------------------------------
import styles from "features/ui/components/ConsecutiveSnackbars/consecutiveSnackbars.scss";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import {
    ARRAY_COMMAND_SHIFT,
    SNACKBAR_NETWORK_ERROR,
    SNACKBAR_DYNAMIC_CALENDAR_ERROR,
    SNACKBAR_DYNAMIC_OPENING_ERROR,
    SNACKBAR_DYNAMIC_EVENTS_ERROR,
    SNACKBAR_DYNAMIC_USER_ERROR,
} from "utils/constants";

//------------------------------------------------------------------------------

export class ConsecutiveSnackbars extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            message: "",
        };
    }

    componentDidUpdate(prevProps) {
        if (
            this.props.snackbars.size !== prevProps.snackbars.size &&
            this.props.snackbars.size > 0
        ) {
            this.setState({ open: true });
        }
    }

    handleClose(event, reason) {
        if (reason === "clickaway") {
            return;
        }
        this.setState({ open: false });
    }

    handleExited() {
        this.props.setSnackbarContent(ARRAY_COMMAND_SHIFT);
    }

    render() {
        const currentSnackbar = this.props.snackbars.values().next().value;
        let snackbarClassNames;

        if (typeof currentSnackbar === "undefined") {
            return false;
        }

        switch (currentSnackbar.key) {
            case SNACKBAR_NETWORK_ERROR:
            case SNACKBAR_DYNAMIC_CALENDAR_ERROR:
            case SNACKBAR_DYNAMIC_OPENING_ERROR:
            case SNACKBAR_DYNAMIC_EVENTS_ERROR:
            case SNACKBAR_DYNAMIC_USER_ERROR:
                snackbarClassNames = `${styles.errorSnack}`;
                break;
            default:
                snackbarClassNames = `${styles.errorSnack}`;
        }

        return (
            <Snackbar
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                open={this.state.open}
                autoHideDuration={7000}
                onClose={() => this.handleClose()}
                onExited={() => this.handleExited()}
                ContentProps={{
                    className: snackbarClassNames,
                }}
                message={
                    <div className={styles.snackbarContent}>
                        <ErrorIcon className={styles.snackbarIcon} />
                        <span id="message-id">{currentSnackbar.text}</span>
                    </div>
                }
            />
        );
    }
}

// Export the redux-connected component
export default connect((state) => ({
    calendarsError: selectCalendarsError(state),
    eventsError: selectEventsError(state),
    openingsError: selectOpeningsError(state),
    userError: selectUserError(state),
    snackbars: selectSnackbars(state),
}), {
    setSnackbarContent,
})(ConsecutiveSnackbars);

ConsecutiveSnackbars.propTypes = {
    // -------------------------------------------------------------------------
    // Data propTypes
    // -------------------------------------------------------------------------
    // Redux -------------------------------------------------------------------
    calendarsError: PropTypes.string,
    eventsError: PropTypes.string,
    openingsError: PropTypes.string,
    userError: PropTypes.string,
    snackbars: PropTypes.object,

    // -------------------------------------------------------------------------
    // Method propTypes
    // -------------------------------------------------------------------------
    // Redux -------------------------------------------------------------------
    setSnackbarContent: PropTypes.func.isRequired,
};
