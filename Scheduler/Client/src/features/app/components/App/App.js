//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

//------------------------------------------------------------------------------
// Redux Support
//------------------------------------------------------------------------------
import { selectPageId } from "redux/reducers/uiReducer";
import {
    selectIsAuthenticated,
    selectFetchIdentityInProgress,
    selectLoginInProgress,
} from "redux/reducers/userReducer";
import { fetchEcclesialCalendar } from "redux/actions/calendarActions";
import { initUserFromCache } from "redux/actions/userActions";
import { setPageId } from "redux/actions/uiActions";
import { selectCalendarError } from "redux/reducers/calendarReducer";

//------------------------------------------------------------------------------
// Components
//------------------------------------------------------------------------------
import MainNav from "features/app/components/MainNav/MainNav";
import MainContent from "features/app/components/MainContent/MainContent";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import {
    HISTORY_REPLACE,
    HISTORY_STATE_KEY_PAGE_ID,
} from "utils/constants";
import {
    PAGE_ID_DASHBOARD,
    PAGE_ID_ROOT,
} from "utils/backendConstants";

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

        window.addEventListener("popstate", this.handlePopState.bind(this));
    }

    componentDidUpdate(prevProps) {
        if (this.props.userIsAuthenticated && !prevProps.userIsAuthenticated) {
            if (this.props.calendarError !== null) {
                this.props.fetchEcclesialCalendar();
            }

            if (this.props.pageId === PAGE_ID_ROOT) {
                this.props.setPageId(PAGE_ID_DASHBOARD, HISTORY_REPLACE);
            }

            this.setState({ loadingState: false });
        } else if (!this.props.userIsAuthenticated) {
            this.setState({ loadingState: false });
        }
    }

    componentWillUnmount() {
        window.removeEventListener("popstate", this.handlePopState);
    }

    /**
     * Handle the popstate event. We use history manipulation in order to speed
     * state transitions where possible. This restores the native behaviour of
     * the back button, by detecting navigation to manually pushed history
     * records and triggering a reload.
     *
     * @param {Event} e The native popstate event.
     */
    handlePopState(e) {
        const pageId = e.state[HISTORY_STATE_KEY_PAGE_ID];

        if (typeof pageId !== "undefined") {
            this.props.setPageId(pageId);
        }
    }

    render() {
        const renderAppContent = () => {
            let returnVal;
            if (
                !this.props.userIsAuthenticated &&
                !this.props.loginInProgress &&
                !this.props.fetchIdentityInProgress
            ) {
                returnVal = (
                    <MainContent />
                );
            } else {
                returnVal = [
                    <MainNav key="mainNav" />,
                    <MainContent key="mainContent" />,
                ];
            }

            return returnVal;
        };

        return renderAppContent();
    }
}

// Export the redux-connected component
export default connect((state) => ({
    calendarError: selectCalendarError(state),
    fetchIdentityInProgress: selectFetchIdentityInProgress(state),
    loginInProgress: selectLoginInProgress(state),
    pageId: selectPageId(state),
    userIsAuthenticated: selectIsAuthenticated(state),
}), {
    fetchEcclesialCalendar,
    initUserFromCache,
    setPageId,
})(App);

App.propTypes = {
    // -------------------------------------------------------------------------
    // Data propTypes
    // -------------------------------------------------------------------------
    calendarError: PropTypes.string,
    fetchIdentityInProgress: PropTypes.bool.isRequired,
    loginInProgress: PropTypes.bool.isRequired,
    pageId: PropTypes.string.isRequired,
    userIsAuthenticated: PropTypes.bool.isRequired,

    // -------------------------------------------------------------------------
    // Method propTypes
    // -------------------------------------------------------------------------
    fetchEcclesialCalendar: PropTypes.func.isRequired,
    initUserFromCache: PropTypes.func.isRequired,
    setPageId: PropTypes.func.isRequired,
};

App.defaultProps = {};
