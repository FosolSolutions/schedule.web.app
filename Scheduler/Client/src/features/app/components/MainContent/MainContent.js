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
import { setDrawerIsOpen } from "redux/actions/uiActions";
import {
    selectCalendars,
    selectCalendarsError,
} from "redux/reducers/calendarsReducer";
import { selectDrawerIsOpen } from "redux/reducers/uiReducer";
import {
    selectGivenName,
    selectSurname,
    selectIsAuthenticated,
} from "redux/reducers/userReducer";

//------------------------------------------------------------------------------
// Components
//------------------------------------------------------------------------------
import Calendar from "features/ui/components/Calendar/Calendar";
import Dashboard from "features/app/components/Dashboard/Dashboard";
import Login from "features/app/components/Login/Login";
import Schedules from "features/app/components/Schedules/Schedules";

//------------------------------------------------------------------------------
// Assets
//------------------------------------------------------------------------------
import styles from "features/app/components/MainContent/mainContent.scss";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import {
    PAGE_ID_CALENDAR,
    PAGE_ID_SCHEDULES,
} from "utils/backendConstants";
import { PAGE_ID } from "utils/staticBackendData";

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
                </div>
            </div>
        );
        /**
         * Render the main login content.
         *
         * @param  {ReactElement[]} child Login page content
         * @return {ReactElement[]}       Array of content elements.
         */
        const renderLoginContent = (child) => (
            <div className={styles.fullHeight}>
                {child}
            </div>
        );
        const renderPageContent = () => {
            let returnVal = false;

            if (
                (!this.props.authenticationInProgress && !this.props.calendarsError) ||
                this.props.userIsAuthenticated
            ) {
                switch (PAGE_ID) {
                    case PAGE_ID_CALENDAR:
                        returnVal = (renderAppContent(<Calendar />));
                        break;
                    case PAGE_ID_SCHEDULES:
                        returnVal = (renderAppContent(<Schedules />));
                        break;
                    default:
                        returnVal = (renderAppContent(<Dashboard />));
                }
            } else {
                returnVal = renderLoginContent(
                    <Login
                        authenticationInProgress={this.props.authenticationInProgress}
                    />,
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
    calendarsError: selectCalendarsError(state),
    drawerIsOpen: selectDrawerIsOpen(state),
    givenName: selectGivenName(state),
    surname: selectSurname(state),
    userIsAuthenticated: selectIsAuthenticated(state),
}), {
    setDrawerIsOpen,
})(MainContent);

MainContent.propTypes = {
    // -------------------------------------------------------------------------
    // Data propTypes
    // -------------------------------------------------------------------------
    // Whether authentication is in progress
    authenticationInProgress: PropTypes.bool.isRequired,

    calendarsError: PropTypes.bool.isRequired,
    // Whether the drawer is open
    drawerIsOpen: PropTypes.bool.isRequired,

    // User's given name
    givenName: PropTypes.string.isRequired,

    // User's surname
    surname: PropTypes.string.isRequired,

    // Whether the user is authenticated
    userIsAuthenticated: PropTypes.bool.isRequired,

    // -------------------------------------------------------------------------
    // Method propTypes
    // -------------------------------------------------------------------------
    // Set the open state of the drawer
    setDrawerIsOpen: PropTypes.func.isRequired,
};

MainContent.defaultProps = {
    authenticationInProgress: true,
};
