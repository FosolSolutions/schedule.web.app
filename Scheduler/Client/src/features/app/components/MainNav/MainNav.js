//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import classNames from "classnames";

//------------------------------------------------------------------------------
// Redux Support
//------------------------------------------------------------------------------
import { setDrawerIsOpen } from "redux/actions/uiActions";
import { backdoorLogin } from "redux/actions/userActions";
import { selectCalendars } from "redux/reducers/calendarsReducer";
import { selectDrawerIsOpen } from "redux/reducers/uiReducer";
import {
    selectGivenName,
    selectIsAuthenticated,
    selectSurname,
} from "redux/reducers/userReducer";

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
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Toolbar from "@material-ui/core/Toolbar";
import InitialsAvatar from "features/ui/components/InitialsAvatar/InitialsAvatar";

//------------------------------------------------------------------------------
// Assets
//------------------------------------------------------------------------------
import AccountCircle from "@material-ui/icons/AccountCircle";
import ArrowBack from "@material-ui/icons/ArrowBack";
import Assignment from "@material-ui/icons/Assignment";
import Event from "@material-ui/icons/Event";
import Home from "@material-ui/icons/Home";
import MenuIcon from "@material-ui/icons/Menu";
import coEventLogoBl from "assets/images/logos/coEventLogoBl.svg";
import coEventLogoWh from "assets/images/logos/coEventLogoWh.svg";
import styles from "features/app/components/MainNav/mainNav.scss";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import { PAGE_ID_HOME } from "utils/backendConstants";
import {
    PAGE_ID,
    PATH_CALENDAR,
    PATH_DASHBOARD,
    PATH_ROOT,
    PATH_SCHEDULES,
} from "utils/staticBackendData";
import { capitalizeFirstLetterOnly } from "utils/generalUtils";

//------------------------------------------------------------------------------

/**
 * Renders and adds handling for the main application navigation.
 */
export class MainNav extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            userMenuAnchorEl: null,
        };
    }

    /**
     * Handle menu button click.
     */
    handleMenuButtonClick() {
        this.props.setDrawerIsOpen(!this.props.drawerIsOpen);
    }

    /**
     * Handle user menu logout button click.
     */
    handleLogoutClick() {
        window.location.href = PATH_ROOT;
    }

    handleLoginClick() {
        this.props.backdoorLogin();
    }

    /**
     * Handle user menu button click.
     *
     * @param {Object} e React synthetic event object
     */
    handleUserMenuClick(e) {
        this.setState({ userMenuAnchorEl: e.currentTarget });
    }

    /**
     * Handle closing of user menu.
     */
    handleUserMenuClose() {
        this.setState({ userMenuAnchorEl: null });
    }

    render() {
        const fullName = `${capitalizeFirstLetterOnly(this.props.givenName)} ${capitalizeFirstLetterOnly(this.props.surname)}`;
        const appBarClassNames = classNames({
            [styles.appBar]: true,
            [styles.drawerIsOpen]: this.props.drawerIsOpen,
        });
        const appLogoClassNames = classNames({
            [styles.appLogo]: true,
            [styles.hide]: this.props.drawerIsOpen,
        });
        const drawerPaperClassNames = classNames({
            [styles.paper]: true,
            [styles.paperIsOpen]: this.props.drawerIsOpen,
        });
        const menuButton = this.props.drawerIsOpen ? (
            false
        ) : (
            <IconButton
                className={styles.iconButton}
                onClick={() => this.handleMenuButtonClick()}
            >
                <MenuIcon />
            </IconButton>
        );
        const authenticatedRightNav = (
            <div className={styles.rightContainer}>
                <IconButton
                    className={styles.login}
                    onClick={(e) => this.handleUserMenuClick(e)}
                >
                    <InitialsAvatar />
                </IconButton>
                <Menu
                    id="userMenu"
                    anchorEl={this.state.userMenuAnchorEl}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    disableAutoFocusItem={true}
                    open={Boolean(this.state.userMenuAnchorEl)}
                    onClose={() => this.handleUserMenuClose()}
                >
                    <MenuItem
                        className={styles.name}
                        disableRipple={true}
                    >
                        {`Hi, ${fullName}`}
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={() => this.handleUserMenuClose()}>
                        My account
                    </MenuItem>
                    <MenuItem onClick={() => this.handleLogoutClick()}>
                        Logout
                    </MenuItem>
                </Menu>
            </div>
        );
        const unauthenticatedRightNav = (
            <div className={styles.rightContainer}>
                <Button
                    className={styles.login}
                    href={PATH_DASHBOARD}
                    variant={"text"}
                >
                    Login
                </Button>
                <Button
                    className={styles.signUp}
                    variant={"contained"}
                >
                    Sign Up
                </Button>
            </div>
        );
        /**
         * Render the main app navigation.
         *
         * @return {ReactElement[]} Array of navigation elements.
         */
        const appNav = () => [
            <AppBar
                className={appBarClassNames}
                position={"fixed"}
                key="mainAppBar"
            >
                <Toolbar
                    className={styles.toolbar}
                    disableGutters={true}>
                    <div className={styles.leftContainer}>
                        {menuButton}
                        <img
                            className={appLogoClassNames}
                            src={coEventLogoWh}
                            alt=""
                        />
                    </div>
                    {
                        (PAGE_ID !== PAGE_ID_HOME)
                            ? authenticatedRightNav
                            : unauthenticatedRightNav
                    }
                </Toolbar>
            </AppBar>,
            <Drawer
                className={styles.drawer}
                classes={{
                    paper: drawerPaperClassNames,
                }}
                key="navDrawer"
                open={this.props.drawerIsOpen}
                onClose={() => this.handleMenuButtonClick()}
                variant="permanent"
            >
                <div className={styles.backHeader}>
                    <div className={styles.backWrap}>
                        <img
                            className={styles.logo}
                            src={coEventLogoBl}
                            alt=""
                        />
                        <IconButton
                            onClick={() => this.handleMenuButtonClick()}
                        >
                            <ArrowBack />
                        </IconButton>
                    </div>
                </div>
                <Divider />
                <List className={styles.list}>
                    <ListItem
                        button
                        className={styles.listItem}
                        onClick={() => { window.location.href = PATH_DASHBOARD; }}
                    >
                        <ListItemIcon color="primary">
                            <Home />
                        </ListItemIcon>
                        <ListItemText className={styles.listItemText}>
                            Dashboard
                        </ListItemText>
                    </ListItem>
                    <Divider />
                    <ListItem
                        button
                        className={styles.listItem}
                        onClick={() => { window.location.href = PATH_SCHEDULES; }}
                    >
                        <ListItemIcon color="primary">
                            <Assignment />
                        </ListItemIcon>
                        <ListItemText className={styles.listItemText}>
                            Schedules
                        </ListItemText>
                    </ListItem>
                    <Divider />
                    <ListItem
                        button
                        className={styles.listItem}
                        onClick={() => { window.location.href = PATH_CALENDAR; }}
                    >
                        <ListItemIcon color="primary">
                            <Event />
                        </ListItemIcon>
                        <ListItemText className={styles.listItemText}>
                            Calendar
                        </ListItemText>
                    </ListItem>
                    <Divider />
                    <ListItem
                        button
                        className={styles.listItem}
                    >
                        <ListItemIcon color="primary">
                            <AccountCircle />
                        </ListItemIcon>
                        <ListItemText className={styles.listItemText}>
                            Account
                        </ListItemText>
                    </ListItem>
                </List>
            </Drawer>,
        ];
        /**
         * Render the main homepage navigation.
         *
         * @return {ReactElement[]} Array of navigation elements.
         */
        const homeNav = () => [
            <AppBar
                className={appBarClassNames}
                position={"fixed"}
                key="mainAppBar"
            >
                <Toolbar className={styles.toolbar}>
                    <div className={styles.leftContainer}>
                        <img
                            className={styles.homeLogo}
                            src={coEventLogoWh}
                            alt=""
                        />
                    </div>
                    {
                        (PAGE_ID !== PAGE_ID_HOME)
                            ? authenticatedRightNav
                            : unauthenticatedRightNav
                    }
                </Toolbar>
            </AppBar>,
        ];
        /**
         * Conditionally render the appropriate main navigation for the current
         * page.
         *
         * @return {ReactElement[]} Array of navigation elements.
         */
        const renderMainNav = () => {
            let returnVal = false;

            switch (PAGE_ID) {
                case PAGE_ID_HOME:
                    returnVal = homeNav();
                    break;
                default:
                    returnVal = appNav();
            }

            return returnVal;
        };

        return renderMainNav();
    }
}

// Export the redux-connected component
export default connect((state) => ({
    calendars: selectCalendars(state),
    drawerIsOpen: selectDrawerIsOpen(state),
    givenName: selectGivenName(state),
    isAuthenticated: selectIsAuthenticated(state),
    surname: selectSurname(state),
}), {
    backdoorLogin,
    setDrawerIsOpen,
})(MainNav);

MainNav.propTypes = {
    // -------------------------------------------------------------------------
    // Data propTypes
    // -------------------------------------------------------------------------
    // Whether the drawer is open
    drawerIsOpen: PropTypes.bool.isRequired,

    // User's given name
    givenName: PropTypes.string.isRequired,

    // Whether the user is authenticated
    isAuthenticated: PropTypes.bool.isRequired,

    // User's surname
    surname: PropTypes.string.isRequired,

    // -------------------------------------------------------------------------
    // Method propTypes
    // -------------------------------------------------------------------------
    // Login
    backdoorLogin: PropTypes.func.isRequired,

    // Set the open state of the drawer
    setDrawerIsOpen: PropTypes.func.isRequired,
};

MainNav.defaultProps = {};
