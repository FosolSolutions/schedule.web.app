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
import { setCalendars } from "redux/actions/calendarsActions";
import { setDrawerIsOpen } from "redux/actions/uiActions";
import { selectCalendars } from "redux/reducers/calendarsReducer";
import { selectDrawerIsOpen } from "redux/reducers/uiReducer";
import {
    selectGivenName,
    selectSurname,
} from "redux/reducers/userReducer";

//------------------------------------------------------------------------------
// Components
//------------------------------------------------------------------------------
import Calendar from "features/ui/components/Calendar/Calendar";
import Dashboard from "features/app/components/Dashboard/Dashboard";
import Home from "features/app/components/Home/Home";
import Schedules from "features/app/components/Schedules/Schedules";

//------------------------------------------------------------------------------
// Assets
//------------------------------------------------------------------------------
import styles from "features/app/components/MainContent/mainContent.scss";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import {
    PAGE_ID_HOME,
    PAGE_ID_CALENDAR,
    PAGE_ID_DASHBOARD,
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
         * Render the main app navigation.
         *
         * @return {ReactElement[]} Array of navigation elements.
         */
        const appContent = () => (
            <div className={appPageStyles}>
                <div className={styles.appContent}>
                    {renderPageContent()}
                </div>
            </div>
        );
        /**
         * Render the main homepage navigation.
         *
         * @return {ReactElement[]} Array of navigation elements.
         */
        const homeContent = () => (
            <div>
                {renderPageContent()}
            </div>
        );
        const renderPageContent = () => {
            let returnVal = false;

            switch (PAGE_ID) {
                case PAGE_ID_HOME:
                    returnVal = (<Home />);
                    break;
                case PAGE_ID_CALENDAR:
                    returnVal = (<Calendar />);
                    break;
                case PAGE_ID_DASHBOARD:
                    returnVal = (<Dashboard />);
                    break;
                case PAGE_ID_SCHEDULES:
                    returnVal = (<Schedules />);
                    break;
                default:
                    returnVal = (<Home />);
            }

            return returnVal;
        };
        /**
         * Conditionally render the appropriate main navigation for the current
         * page.
         *
         * @return {ReactElement[]} Array of navigation elements.
         */
        const renderMainNav = () => {
            let returnVal = false;

            switch (PAGE_ID) {
                case PAGE_ID_HOME:
                    returnVal = homeContent();
                    break;
                default:
                    returnVal = appContent();
            }

            return returnVal;
        };

        return renderMainNav();
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
        calendars: selectCalendars(state),
        drawerIsOpen: selectDrawerIsOpen(state),
        givenName: selectGivenName(state),
        surname: selectSurname(state),
    };
}

/**
 * Map action creators to props. Export for testing.
 *
 * @private
 *
 * @param  {Function} dispatch Redux dispatch method
 *
 * @return {Object}            Object map of action creators
 */
export function mapDispatchToProps(dispatch) {
    return {
        setCalendars: (...args) => {
            dispatch(setCalendars(...args));
        },
        setDrawerIsOpen: (...args) => {
            dispatch(setDrawerIsOpen(...args));
        },
    };
}

// Export the redux-connected component
export default connect(mapStateToProps, mapDispatchToProps)(MainContent);

MainContent.propTypes = {
    // -------------------------------------------------------------------------
    // Data propTypes
    // -------------------------------------------------------------------------
    // Whether the drawer is open
    drawerIsOpen: PropTypes.bool.isRequired,

    // User's given name
    givenName: PropTypes.string.isRequired,

    // User's surname
    surname: PropTypes.string.isRequired,

    // -------------------------------------------------------------------------
    // Method propTypes
    // -------------------------------------------------------------------------
    // Set the calendars from the endpoint response
    setCalendars: PropTypes.func.isRequired,

    // Set the open state of the drawer
    setDrawerIsOpen: PropTypes.func.isRequired,
};

MainContent.defaultProps = {};
