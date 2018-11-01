//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

//------------------------------------------------------------------------------
// Redux Support
//------------------------------------------------------------------------------
import { fetchCalendars } from "redux/actions/calendarsActions";
import { initUserFromCache } from "redux/actions/userActions";
import { selectIsAuthenticated } from "redux/reducers/userReducer";
import {
    selectCalendarsIsLoading,
    selectCalendarsError,
} from "redux/reducers/calendarsReducer";

//------------------------------------------------------------------------------
// Components
//------------------------------------------------------------------------------
import MainNav from "features/app/components/MainNav/MainNav";
import MainContent from "features/app/components/MainContent/MainContent";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import {
    PATH_DASHBOARD,
    PAGE_ID,
} from "utils/staticBackendData";
import { PAGE_ID_HOME } from "utils/backendConstants";

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
        this.props.fetchCalendars();
        this.props.initUserFromCache();
    }

    componentDidUpdate(prevProps) {
        if (!this.props.calendarsIsLoading && prevProps.calendarsIsLoading) {
            if (this.props.calendarsError) {
                window.setTimeout(() => {
                    this.setState({ loadingState: false });
                }, 250);
            } else if (PAGE_ID === PAGE_ID_HOME) {
                window.location.href = PATH_DASHBOARD;
            } else {
                this.setState({ loadingState: false });
            }
        }

        if (this.props.userIsAuthenticated && !prevProps.userIsAuthenticated) {
            this.setState({ loadingState: false });

            if (!this.props.calendarsIsLoading) {
                this.props.fetchCalendars();
            }
        }
    }

    render() {
        const renderAppContent = () => {
            let returnVal;

            if (this.state.loadingState || this.props.calendarsError) {
                returnVal = (
                    <MainContent
                        authenticationInProgress={this.state.loadingState}
                    />
                );
            } else {
                returnVal = [
                    <MainNav key="mainNav" />,
                    <MainContent
                        authenticationInProgress={this.state.loadingState}
                        key="mainContent"
                    />,
                ];
            }

            return returnVal;
        };

        return renderAppContent();
    }
}

// Export the redux-connected component
export default connect((state) => ({
    calendarsError: selectCalendarsError(state),
    calendarsIsLoading: selectCalendarsIsLoading(state),
    userIsAuthenticated: selectIsAuthenticated(state),
}), {
    fetchCalendars,
    initUserFromCache,
})(App);

App.propTypes = {
    // -------------------------------------------------------------------------
    // Data propTypes
    // -------------------------------------------------------------------------
    // The calendars error
    calendarsError: PropTypes.any.isRequired,

    // Whether the calendars endpoint request is in progress
    calendarsIsLoading: PropTypes.bool.isRequired,

    // Whether the user is authenticated
    userIsAuthenticated: PropTypes.bool.isRequired,

    // -------------------------------------------------------------------------
    // Method propTypes
    // -------------------------------------------------------------------------
    // Set the calendars from the endpoint response
    fetchCalendars: PropTypes.func.isRequired,

    // Initialize anonymouse user properties from the cache
    initUserFromCache: PropTypes.func.isRequired,
};

App.defaultProps = {};
