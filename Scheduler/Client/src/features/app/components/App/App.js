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
import { setPageId } from "redux/actions/uiActions";
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
    PAGE_ID_DASHBOARD,
    PAGE_ID_ROOT,
} from "utils/backendConstants";
import { selectPageId } from "../../../../redux/reducers/uiReducer";

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
        if (this.props.userIsAuthenticated && !prevProps.userIsAuthenticated) {
            if (this.props.calendarsError) {
                this.props.fetchCalendars();
            }

            if (this.props.pageId === PAGE_ID_ROOT) {
                this.props.setPageId(PAGE_ID_DASHBOARD, false);
            }

            this.setState({ loadingState: false });
        } else if (!this.props.userIsAuthenticated) {
            this.setState({ loadingState: false });
        }
    }

    render() {
        const renderAppContent = () => {
            let returnVal;
            if (!this.props.userIsAuthenticated) {
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
    calendarsError: selectCalendarsError(state),
    calendarsIsLoading: selectCalendarsIsLoading(state),
    pageId: selectPageId(state),
    userIsAuthenticated: selectIsAuthenticated(state),
}), {
    fetchCalendars,
    initUserFromCache,
    setPageId,
})(App);

App.propTypes = {
    // -------------------------------------------------------------------------
    // Data propTypes
    // -------------------------------------------------------------------------
    calendarsError: PropTypes.any.isRequired,
    calendarsIsLoading: PropTypes.bool.isRequired,
    pageId: PropTypes.string.isRequired,
    userIsAuthenticated: PropTypes.bool.isRequired,

    // -------------------------------------------------------------------------
    // Method propTypes
    // -------------------------------------------------------------------------
    fetchCalendars: PropTypes.func.isRequired,
    initUserFromCache: PropTypes.func.isRequired,
    setPageId: PropTypes.func.isRequired,
};

App.defaultProps = {};
