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

//------------------------------------------------------------------------------
// Components
//------------------------------------------------------------------------------
import MainNav from "features/app/components/MainNav/MainNav";
import MainContent from "features/app/components/MainContent/MainContent";

//------------------------------------------------------------------------------

/**
 * Top-level application component. Triggers any runtime data fetching and
 * renders the application.
 */
export class App extends React.PureComponent {
    componentDidMount() {
        this.props.fetchCalendars();
    }

    render() {
        return [
            <MainNav key="mainNav" />,
            <MainContent key="mainContent" />,
        ];
    }
}

// Export the redux-connected component
export default connect(null, {
    fetchCalendars,
})(App);

App.propTypes = {
    // -------------------------------------------------------------------------
    // Method propTypes
    // -------------------------------------------------------------------------
    // Set the calendars from the endpoint response
    fetchCalendars: PropTypes.func.isRequired,
};

App.defaultProps = {};
