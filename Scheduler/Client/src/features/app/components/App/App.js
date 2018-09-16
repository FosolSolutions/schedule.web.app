//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import classNames from "classnames";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

//------------------------------------------------------------------------------
// Redux Support
//------------------------------------------------------------------------------
import setCalendars from "redux/actions/calendarsActions";
import { selectCalendars } from "redux/reducers/calendarsReducer";

//------------------------------------------------------------------------------
// Components
//------------------------------------------------------------------------------
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

//------------------------------------------------------------------------------
// Assets
//------------------------------------------------------------------------------
import AccountCircle from "@material-ui/icons/AccountCircle";
import ArrowBack from "@material-ui/icons/ArrowBack";
import Event from "@material-ui/icons/Event";
import Home from "@material-ui/icons/Home";
import Menu from "@material-ui/icons/Menu";
import coEventLogo from "assets/images/logos/coEventLogoWh.svg";
import hands from "assets/images/hands.svg";
import styles from "features/app/components/App/app.scss";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

export class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            drawerIsOpen: false,
            loginRedirect: false
        };

        props.setCalendars();
    }

    /**
     * Handle menu button click
     */
    handleMenuButtonClick() {
        this.setState({ drawerIsOpen: !this.state.drawerIsOpen });
    }

    /**
     * Handle login button click
     */
    handleLoginToggleClick() {
        this.setState({ loginRedirect: !this.state.loginRedirect });
    }

    render() {
        const appBarClassNames = classNames({
            [styles.appBar]: true,
            [styles.drawerIsOpen]: this.state.drawerIsOpen
        });
        const paperClassNames = classNames({
            [styles.paper]: true,
            [styles.paperIsOpen]: this.state.drawerIsOpen
        });
        const menuButton = this.state.drawerIsOpen ? (
            false
        ) : (
            <IconButton
                className={styles.iconButton}
                onClick={() => this.handleMenuButtonClick()}
            >
                <Menu />
            </IconButton>
        );
        const home = () => [
            <AppBar
                className={appBarClassNames}
                position={"fixed"}
                key="mainAppBar"
            >
                <Toolbar className={styles.toolbar}>
                    <div className={styles.leftContainer}>
                        <img className={styles.logo} src={coEventLogo} alt="" />
                    </div>
                    <div className={styles.rightContainer}>
                        <Button
                            className={styles.login}
                            variant={"text"}
                            onClick={() => this.handleLoginToggleClick()}
                        >
                            Login
                        </Button>
                        <Button className={styles.signUp} variant={"contained"}>
                            Sign Up
                        </Button>
                    </div>
                </Toolbar>
            </AppBar>,
            <div className={styles.splashScreen} key="splashScreen">
                <h1 className={styles.valueProp}>
                    Flexible scheduling for teams and organizations.
                </h1>
                <img className={styles.hands} src={hands} alt="" />
            </div>,
            <div className={styles.spacer} key="spacer2" />
        ];
        const user = () => [
            <AppBar
                className={appBarClassNames}
                position={"absolute"}
                key="mainAppBar"
            >
                <Toolbar className={styles.toolbar} disableGutters={true}>
                    <div className={styles.leftContainer}>{menuButton}</div>
                    <div className={styles.rightContainer}>
                        <Button
                            className={styles.login}
                            onClick={() => this.handleLoginToggleClick()}
                        >
                            Logout
                        </Button>
                    </div>
                </Toolbar>
            </AppBar>,
            <Drawer
                className={styles.drawer}
                classes={{
                    paper: paperClassNames
                }}
                key="navDrawer"
                open={this.state.drawerIsOpen}
                onClose={() => this.handleMenuButtonClick()}
                variant="permanent"
            >
                <div className={styles.backHeader}>
                    <div className={styles.backWrap}>
                        {
                            <IconButton
                                onClick={() => this.handleMenuButtonClick()}
                            >
                                <ArrowBack />
                            </IconButton>
                        }
                    </div>
                </div>
                <Divider />
                <List className={styles.list}>
                    <ListItem button className={styles.listItem}>
                        <ListItemIcon>
                            <Home />
                        </ListItemIcon>
                        <ListItemText className={styles.listItemText}>
                            Home
                        </ListItemText>
                    </ListItem>
                    <Divider />
                    <ListItem button className={styles.listItem}>
                        <ListItemIcon>
                            <Event />
                        </ListItemIcon>
                        <ListItemText className={styles.listItemText}>
                            Schedules
                        </ListItemText>
                    </ListItem>
                    <Divider />
                    <ListItem button className={styles.listItem}>
                        <ListItemIcon>
                            <AccountCircle />
                        </ListItemIcon>
                        <ListItemText className={styles.listItemText}>
                            Account
                        </ListItemText>
                    </ListItem>
                </List>
            </Drawer>
        ];

        return (
            <Router>
                <div className={styles.fullHeight}>
                    <Route
                        exact
                        path="/"
                        render={() =>
                            this.state.loginRedirect ? (
                                <Redirect push to="/user" />
                            ) : (
                                home()
                            )
                        }
                    />
                    <Route
                        exact
                        path="/user"
                        render={() =>
                            this.state.loginRedirect ? (
                                user()
                            ) : (
                                <Redirect push to="/" />
                            )
                        }
                    />
                </div>
            </Router>
        );
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
