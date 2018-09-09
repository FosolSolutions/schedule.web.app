//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

//------------------------------------------------------------------------------
// Redux Support
//------------------------------------------------------------------------------
import setCalendars from "redux/actions/calendarsActions";
import { selectCalendars } from "redux/reducers/calendarsReducer";

//------------------------------------------------------------------------------
// Components
//------------------------------------------------------------------------------
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import AppBar from "@material-ui/core/AppBar";

//------------------------------------------------------------------------------
// Assets
//------------------------------------------------------------------------------
import AccountCircle from "@material-ui/icons/AccountCircle";
import Event from "@material-ui/icons/Event";
import MoreVert from "@material-ui/icons/MoreVert";
import styles from "features/app/components/App/app.scss";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

export class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            drawerIsOpen: false
        };

        props.setCalendars();
    }

    /**
     * Handle menu button clicks
     */
    handleMenuButtonClick() {
        this.setState({ drawerIsOpen: !this.state.drawerIsOpen });
    }

    render() {
        return [
            <AppBar
                className={styles.appBar}
                position={"static"}
                key="mainAppBar"
            >
                <div className={styles.leftContainer}>
                    <Event />
                    <h1 className={styles.appTitle}>EventStack</h1>
                </div>
                <IconButton
                    className={styles.iconButton}
                    onClick={() => this.handleMenuButtonClick()}
                >
                    <MoreVert />
                </IconButton>
            </AppBar>,
            <Drawer
                anchor="right"
                key="navDrawer"
                open={this.state.drawerIsOpen}
                onClose={() => this.handleMenuButtonClick()}
            >
                <Button>
                    <span className={styles.buttonLabel}>Account</span>
                    <AccountCircle />
                </Button>
            </Drawer>
        ];
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
        calendars: selectCalendars(state)
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
        }
    };
}

// Export the redux-connected component
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);

App.propTypes = {
    // -------------------------------------------------------------------------
    // Data propTypes
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // Method propTypes
    // -------------------------------------------------------------------------
    setCalendars: PropTypes.func.isRequired
};

App.defaultProps = {};
