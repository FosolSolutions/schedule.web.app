//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import classNames from "classnames";
import isEmpty from "lodash/isEmpty";

//------------------------------------------------------------------------------
// Redux Support
//------------------------------------------------------------------------------
import { selectCalendars } from "redux/reducers/calendarReducer";
import {
    selectDrawerIsOpen,
    selectPageId,
    selectSnackbarContentKey,
} from "redux/reducers/uiReducer";
import {
    selectUserError,
    selectFetchIdentityInProgress,
    selectIsAuthenticated,
} from "redux/reducers/userReducer";
import {
    setDrawerIsOpen,
    setSnackbarContentKey,
} from "redux/actions/uiActions";

//------------------------------------------------------------------------------
// Components
//------------------------------------------------------------------------------
import Calendar from "features/ui/components/Calendar/Calendar";
import Dashboard from "features/app/components/Dashboard/Dashboard";
import Authentication from "features/app/components/Authentication/Authentication";
import Schedules from "features/app/components/Schedules/Schedules";
import Snackbar from "@material-ui/core/Snackbar";

//------------------------------------------------------------------------------
// Assets
//------------------------------------------------------------------------------
import styles from "features/app/components/MainContent/mainContent.scss";
import ErrorIcon from "@material-ui/icons/Error";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import {
    PAGE_ID_CALENDAR,
    PAGE_ID_SCHEDULES,
} from "utils/backendConstants";
import {
    SNACKBAR_NETWORK_ERROR,
    SNACKBAR_DYNAMIC_USER_ERROR,
} from "utils/constants";

//------------------------------------------------------------------------------

/**
 * Renders the main application content area.
 */
export class MainContent extends React.Component {
    render() {
        const appPageStyles = classNames({
            [styles.appPage]: true,
            [styles.narrow]: this.props.drawerIsOpen,
        });
        /**
         * Render the main app content.
         *
         * @param  {ReactElement[]} child App page content
         *
         * @return {ReactElement[]}       Array of content elements.
         */
        const renderAppContent = (child) => (
            <div className={appPageStyles}>
                <div className={styles.appContent}>
                    {child}
                    {renderSnackbar()}
                </div>
            </div>
        );
        /**
         * Render the main authentication content.
         *
         * @param  {ReactElement[]} child Authentication page content
         *
         * @return {ReactElement[]}       Array of content elements.
         */
        const renderAuthContent = (child) => (
            <div className={styles.fullHeight}>
                {child}
                {renderSnackbar()}
            </div>
        );
        const renderSnackbar = () => {
            let snackbarText;
            let snackbarClassNames;
            let snackbarMarkup = false;

            if (!isEmpty(this.props.snackbarContentKey)) {
                switch (this.props.snackbarContentKey) {
                    case SNACKBAR_NETWORK_ERROR:
                        snackbarClassNames = `${styles.errorSnack}`;
                        snackbarText = "Sorry, we're having network problems.";
                        break;
                    case SNACKBAR_DYNAMIC_USER_ERROR:
                        snackbarClassNames = `${styles.errorSnack}`;
                        snackbarText = this.props.userError;
                        break;
                    default:
                }

                snackbarMarkup = (
                    <Snackbar
                        anchorOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                        open={true}
                        autoHideDuration={12000}
                        onClose={() => this.props.setSnackbarContentKey()}
                        ContentProps={{
                            "aria-describedby": "message-id",
                            className: snackbarClassNames,
                        }}
                        message={
                            <div className={styles.snackbarContent}>
                                <ErrorIcon className={styles.snackbarIcon} />
                                <span id="message-id">{snackbarText}</span>
                            </div>
                        }
                    />
                );
            }

            return snackbarMarkup;
        };
        const renderPageContent = () => {
            let returnVal = false;

            if (this.props.userIsAuthenticated) {
                switch (this.props.pageId) {
                    case PAGE_ID_CALENDAR:
                        returnVal = (renderAppContent(<Calendar />));
                        break;
                    case PAGE_ID_SCHEDULES:
                        returnVal = (renderAppContent(<Schedules />));
                        break;
                    default:
                        returnVal = (renderAppContent(<Dashboard />));
                }
            } else if (this.props.fetchIdentityInProgress) {
                returnVal = renderAppContent();
            } else {
                returnVal = renderAuthContent(
                    <Authentication />,
                );
            }

            return returnVal;
        };

        return renderPageContent();
    }
}

// Export the redux-connected component
export default connect((state) => ({
    calendars: selectCalendars(state),
    drawerIsOpen: selectDrawerIsOpen(state),
    fetchIdentityInProgress: selectFetchIdentityInProgress(state),
    pageId: selectPageId(state),
    userError: selectUserError(state),
    snackbarContentKey: selectSnackbarContentKey(state),
    userIsAuthenticated: selectIsAuthenticated(state),
}), {
    setDrawerIsOpen,
    setSnackbarContentKey,
})(MainContent);

MainContent.propTypes = {
    // -------------------------------------------------------------------------
    // Data propTypes
    // -------------------------------------------------------------------------
    // Redux -------------------------------------------------------------------
    drawerIsOpen: PropTypes.bool.isRequired,
    fetchIdentityInProgress: PropTypes.bool.isRequired,
    pageId: PropTypes.string.isRequired,
    snackbarContentKey: PropTypes.string.isRequired,
    userError: PropTypes.string,
    userIsAuthenticated: PropTypes.bool.isRequired,

    // -------------------------------------------------------------------------
    // Method propTypes
    // -------------------------------------------------------------------------
    // Redux -------------------------------------------------------------------
    setDrawerIsOpen: PropTypes.func.isRequired,
    setSnackbarContentKey: PropTypes.func.isRequired,
};
