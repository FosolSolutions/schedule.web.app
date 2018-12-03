//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import {
    Switch,
    withRouter,
} from "react-router";
import { Route } from "react-router-dom";
import classNames from "classnames";

//------------------------------------------------------------------------------
// Redux Support
//------------------------------------------------------------------------------
import {
    selectDrawerIsOpen,
    selectScreenWidth,
} from "redux/reducers/uiReducer";
import {
    selectFetchIdentityInProgress,
    selectIsAuthenticated,
    selectIosCors,
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
import EventBusyIcon from "@material-ui/icons/EventBusy";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import {
    PAGE_ID_CALENDAR,
    PAGE_ID_SCHEDULES,
    PAGE_ID_DASHBOARD,
} from "utils/backendConstants";
import {
    PATH_EMAIL_SIGNIN,
    WINDOW_WIDTH_DRAWER_PERSISTENT,
} from "utils/constants";

//------------------------------------------------------------------------------

/**
 * Renders the main application content area.
 */
export class MainContent extends React.Component {
    render() {
        const appPageStyles = classNames({
            [styles.appPage]: true,
            [styles.narrow]: (
                this.props.drawerIsOpen &&
                this.props.screenWidth > WINDOW_WIDTH_DRAWER_PERSISTENT
            ),
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
        const renderNotFound = () => {
            const message = (this.props.iosCors)
                ? `To use this application, either turn off the "Prevent Cross-Site Tracking" option in Settings > Safari (then reload the page), or try using Chrome for iOS.`
                : "Hmm, something went wrong. Try logging in again.";
            const notFound = (
                <div className={styles.errorWrap}>
                    <EventBusyIcon className={styles.errorIcon}/>
                    <h1>
                        {message}
                    </h1>
                </div>
            );

            return (this.props.userIsAuthenticated)
                ? renderAppContent(notFound)
                : renderAuthContent(notFound);
        };
        const renderPageContent = () => {
            const dashboardPath = `/${PAGE_ID_DASHBOARD}`;
            const emailSigninPath = `/${PATH_EMAIL_SIGNIN}/:participantKey`;
            const rootPath = "/";
            let returnVal = false;
            let pathMatches;

            if (this.props.userIsAuthenticated) {
                pathMatches = this.props.location.pathname.match(PATH_EMAIL_SIGNIN);

                if (
                    this.props.location.pathname === rootPath ||
                    pathMatches !== null
                ) {
                    this.props.history.replace(dashboardPath);
                }

                returnVal = (
                    <Switch>
                        <Route
                            path={`/${PAGE_ID_CALENDAR}`}
                            render={() => renderAppContent(<Calendar />)}
                        />
                        <Route
                            path={`/${PAGE_ID_SCHEDULES}`}
                            render={() => renderAppContent(<Schedules />)}
                        />
                        <Route
                            exact
                            path={dashboardPath}
                            render={() => renderAppContent(<Dashboard />)}
                        />
                        <Route
                            exact
                            path={rootPath}
                            render={() => renderAppContent(<Dashboard />)}
                        />
                        <Route render={() => renderNotFound()} />
                    </Switch>

                );
            } else if (this.props.fetchIdentityInProgress) {
                returnVal = renderAppContent();
            } else {
                returnVal = (
                    <Switch>
                        <Route
                            exact
                            path={rootPath}
                            render={() => renderAuthContent(<Authentication />)}
                        />
                        <Route
                            exact
                            path={emailSigninPath}
                            render={
                                (props) => renderAuthContent(
                                    <Authentication {...props}/>,
                                )
                            }
                        />
                        <Route render={() => renderNotFound()} />
                    </Switch>

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
    screenWidth: selectScreenWidth(state),
    userIsAuthenticated: selectIsAuthenticated(state),
    iosCors: selectIosCors(state),
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
    screenWidth: PropTypes.any,
    userIsAuthenticated: PropTypes.bool.isRequired,
    iosCors: PropTypes.bool.isRequired,

    // React Router ------------------------------------------------------------
    history: PropTypes.object,
    location: PropTypes.object,

    // -------------------------------------------------------------------------
    // Method propTypes
    // -------------------------------------------------------------------------
    // Redux -------------------------------------------------------------------
    setDrawerIsOpen: PropTypes.func.isRequired,
};
