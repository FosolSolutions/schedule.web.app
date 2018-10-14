//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

//------------------------------------------------------------------------------
// Redux Support
//------------------------------------------------------------------------------
import { setCalendars } from "redux/actions/calendarsActions";

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
    constructor(props) {
        super(props);

        props.setCalendars();
    }

    render() {
        return [
            <MainNav key="mainNav" />,
            <MainContent key="mainContent" />,
        ];
    }
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
    };
}

// Export the redux-connected component
export default connect(null, mapDispatchToProps)(App);

App.propTypes = {
    // -------------------------------------------------------------------------
    // Method propTypes
    // -------------------------------------------------------------------------
    // Set the calendars from the endpoint response
    setCalendars: PropTypes.func.isRequired,
};

App.defaultProps = {};
