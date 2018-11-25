//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Route } from "react-router-dom";
import classNames from "classnames";

//------------------------------------------------------------------------------
// Redux Support
//------------------------------------------------------------------------------
import { selectDrawerIsOpen } from "redux/reducers/uiReducer";
import {
    selectFetchIdentityInProgress,
    selectIsAuthenticated,
} from "redux/reducers/userReducer";
import { setDrawerIsOpen } from "redux/actions/uiActions";

//------------------------------------------------------------------------------
// Components
//------------------------------------------------------------------------------
import Calendar from "features/ui/components/Calendar/Calendar";
import Dashboard from "features/app/components/Dashboard/Dashboard";
import Authentication from "features/app/components/Authentication/Authentication";
import Schedules from "features/app/components/Schedules/Schedules";
import ConsecutiveSnackbars from "features/ui/components/ConsecutiveSnackbars/ConsecutiveSnackbars";

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
    PAGE_ID_DASHBOARD,
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
                    <ConsecutiveSnackbars />
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
                <ConsecutiveSnackbars />
            </div>
        );
        const renderPageContent = () => {
            const dashboardPath = `/${PAGE_ID_DASHBOARD}`;
            const rootPath = "/";
            let returnVal = false;

            if (this.props.userIsAuthenticated) {
                if (this.props.location.pathname === rootPath) {
                    this.props.history.replace(dashboardPath);
                }

                returnVal = [
                    <Route
                        key={"calendarView"}
                        path={`/${PAGE_ID_CALENDAR}`}
                        render={() => renderAppContent(<Calendar />)}
                    />,
                    <Route
                        key={"schedulesView"}
                        path={`/${PAGE_ID_SCHEDULES}`}
                        render={() => renderAppContent(<Schedules />)}
                    />,
                    <Route
                        exact
                        key={"dashboardView"}
                        path={dashboardPath}
                        render={() => renderAppContent(<Dashboard />)}
                    />,
                    <Route
                        exact
                        key={"rootView"}
                        path={rootPath}
                        render={() => renderAppContent(<Dashboard />)}
                    />,
                ];
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
export default withRouter(connect((state) => ({
    drawerIsOpen: selectDrawerIsOpen(state),
    fetchIdentityInProgress: selectFetchIdentityInProgress(state),
    userIsAuthenticated: selectIsAuthenticated(state),
}), {
    setDrawerIsOpen,
})(MainContent));

MainContent.propTypes = {
    // -------------------------------------------------------------------------
    // Data propTypes
    // -------------------------------------------------------------------------
    // Redux -------------------------------------------------------------------
    drawerIsOpen: PropTypes.bool.isRequired,
    fetchIdentityInProgress: PropTypes.bool.isRequired,
    userIsAuthenticated: PropTypes.bool.isRequired,

    // React Router ------------------------------------------------------------
    history: PropTypes.object,
    location: PropTypes.object,

    // -------------------------------------------------------------------------
    // Method propTypes
    // -------------------------------------------------------------------------
    // Redux -------------------------------------------------------------------
    setDrawerIsOpen: PropTypes.func.isRequired,
};
