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
import {
    selectCalendars,
    selectCalendarsError,
} from "redux/reducers/calendarsReducer";
import {
    selectDrawerIsOpen,
    selectPageId,
} from "redux/reducers/uiReducer";
import {
    selectGivenName,
    selectSurname,
    selectIsAuthenticated,
} from "redux/reducers/userReducer";
import { setDrawerIsOpen } from "redux/actions/uiActions";

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
            } else {
                returnVal = renderLoginContent(
                    <Login />,
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
    pageId: selectPageId(state),
    surname: selectSurname(state),
    userIsAuthenticated: selectIsAuthenticated(state),
}), {
    setDrawerIsOpen,
})(MainContent);

MainContent.propTypes = {
    // -------------------------------------------------------------------------
    // Data propTypes
    // -------------------------------------------------------------------------
    // Redux -------------------------------------------------------------------
    calendarsError: PropTypes.bool.isRequired,
    drawerIsOpen: PropTypes.bool.isRequired,
    givenName: PropTypes.string.isRequired,
    pageId: PropTypes.string.isRequired,
    surname: PropTypes.string.isRequired,
    userIsAuthenticated: PropTypes.bool.isRequired,

    // -------------------------------------------------------------------------
    // Method propTypes
    // -------------------------------------------------------------------------
    // Redux -------------------------------------------------------------------
    setDrawerIsOpen: PropTypes.func.isRequired,
};
