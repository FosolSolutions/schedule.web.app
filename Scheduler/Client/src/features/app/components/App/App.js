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

//------------------------------------------------------------------------------
// Redux Support
//------------------------------------------------------------------------------
import {
    selectIsAuthenticated,
    selectFetchIdentityInProgress,
    selectLoginInProgress,
} from "redux/reducers/userReducer";
import { fetchEcclesialCalendar } from "redux/actions/calendarActions";
import { initUserFromCache } from "redux/actions/userActions";
import { selectCalendarsError } from "redux/reducers/calendarReducer";

//------------------------------------------------------------------------------
// Components
//------------------------------------------------------------------------------
import MainNav from "features/app/components/MainNav/MainNav";
import MainContent from "features/app/components/MainContent/MainContent";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import { PATH_ADMIN } from "utils/constants";

//------------------------------------------------------------------------------

/**
 * Top-level application component. Triggers any runtime data fetching and
 * renders the application.
 */
export class App extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            loadingState: !props.userIsAuthenticated,
        };
    }

    componentDidMount() {
        this.props.fetchEcclesialCalendar();
        this.props.initUserFromCache();
    }

    componentDidUpdate(prevProps) {
        if (this.props.userIsAuthenticated && !prevProps.userIsAuthenticated) {
            if (this.props.calendarsError !== null) {
                this.props.fetchEcclesialCalendar();
            }

            this.setState({ loadingState: false });
        } else if (!this.props.userIsAuthenticated) {
            this.setState({ loadingState: false });
        }
    }

    render() {
        const renderAppContent = () => {
            let appContent;
            if (
                !this.props.userIsAuthenticated &&
                !this.props.loginInProgress &&
                !this.props.fetchIdentityInProgress
            ) {
                appContent = (
                    <MainContent />
                );
            } else {
                appContent = [
                    <MainNav key="mainNav" />,
                    <MainContent key="mainContent" />,
                ];
            }

            return (
                <Switch>
                    <Route
                        path={`/${PATH_ADMIN}`}
                        render={() => false}
                    />
                    <Route
                        render={() => appContent}
                    />
                </Switch>
            );
        };

        return renderAppContent();
    }
}

// Export the redux-connected component
export default withRouter(connect((state) => ({
    calendarsError: selectCalendarsError(state),
    fetchIdentityInProgress: selectFetchIdentityInProgress(state),
    loginInProgress: selectLoginInProgress(state),
    userIsAuthenticated: selectIsAuthenticated(state),
}), {
    fetchEcclesialCalendar,
    initUserFromCache,
})(App));

App.propTypes = {
    // -------------------------------------------------------------------------
    // Data propTypes
    // -------------------------------------------------------------------------
    calendarsError: PropTypes.string,
    fetchIdentityInProgress: PropTypes.bool.isRequired,
    loginInProgress: PropTypes.bool.isRequired,
    userIsAuthenticated: PropTypes.bool.isRequired,

    // -------------------------------------------------------------------------
    // Method propTypes
    // -------------------------------------------------------------------------
    fetchEcclesialCalendar: PropTypes.func.isRequired,
    initUserFromCache: PropTypes.func.isRequired,
};

App.defaultProps = {};
