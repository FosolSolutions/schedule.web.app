//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import classNames from "classnames";
import format from "date-fns/format";

//------------------------------------------------------------------------------
// Redux Support
//------------------------------------------------------------------------------
import { signOff } from "redux/actions/userActions";
import { selectCalendars } from "redux/reducers/calendarReducer";
import {
    selectDrawerIsOpen,
    selectScreenWidth,
} from "redux/reducers/uiReducer";
import {
    selectFetchIdentityInProgress,
    selectIsAuthenticated,
    selectSignOffInProgress,
    selectUser,
} from "redux/reducers/userReducer";
import { setDrawerIsOpen } from "redux/actions/uiActions";

//------------------------------------------------------------------------------
// Components
//------------------------------------------------------------------------------
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import ScheduleList from "features/app/components/ScheduleList/ScheduleList";
import TipMenu from "features/ui/components/TipMenu/TipMenu";
import InitialsAvatar from "features/ui/components/InitialsAvatar/InitialsAvatar";

//------------------------------------------------------------------------------
// Assets
//------------------------------------------------------------------------------
import CircularProgress from "@material-ui/core/CircularProgress";
import LinearProgress from "@material-ui/core/LinearProgress";
import Event from "@material-ui/icons/EventOutlined";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Home from "@material-ui/icons/HomeOutlined";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import MenuIcon from "@material-ui/icons/Menu";
import coEventLogoWh from "assets/images/logos/coEventLogoWh.svg";
import styles from "features/app/components/MainNav/mainNav.scss";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import {
    PAGE_ID_CALENDAR,
    PAGE_ID_DASHBOARD,
} from "utils/backendConstants";
import { WINDOW_WIDTH_DRAWER_PERSISTENT } from "utils/constants";
import { stringToHslColor } from "utils/generalUtils";

//------------------------------------------------------------------------------

/**
 * Renders and adds handling for the main application navigation.
 */
export class MainNav extends React.Component {
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
    handleSignOutClick() {
        this.props.signOff();
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

    handleNavItemClick(path) {
        this.props.history.push(path);

        if (this.props.screenWidth < WINDOW_WIDTH_DRAWER_PERSISTENT) {
            this.props.setDrawerIsOpen(false);
        }
    }

    render() {
        const user = this.props.user;
        const userIsNull = (this.props.user.getId() === null);
        const firstName = (userIsNull) ? "." : user.getFirstName();
        const lastName = (userIsNull) ? "." : user.getLastName();
        const fullName = (userIsNull) ? "Loading..." : user.getFullName();
        const displayName = (userIsNull) ? "Loading..." : user.getDisplayName();

        const nameColor = (userIsNull)
            ? stringToHslColor(fullName, 60, 70)
            : user.getAvatarColor();
        const homeNavListClassNames = classNames({
            [styles.listItem]: true,
            [styles.active]: this.props.location.pathname === `/${PAGE_ID_DASHBOARD}`,
        });
        const calendarNavListClassNames = classNames({
            [styles.listItem]: true,
            [styles.active]: this.props.location.pathname === `/${PAGE_ID_CALENDAR}`,
        });
        const drawerVariant = (this.props.screenWidth < WINDOW_WIDTH_DRAWER_PERSISTENT)
            ? "temporary"
            : "persistent";
        /**
         * Render the main app navigation.
         *
         * @return {ReactElement[]} Array of navigation elements.
         */
        const appNav = () => (
            <div>
                <Drawer
                    className={styles.drawer}
                    classes={{
                        paper: styles.paper,
                    }}
                    key="navDrawer"
                    open={this.props.drawerIsOpen}
                    variant={drawerVariant}
                >
                    <div className={styles.backHeader}>
                        <Button
                            className={styles.account}
                            disableRipple
                            fullWidth={true}
                            onClick={(e) => this.handleUserMenuClick(e)}
                        >
                            <InitialsAvatar
                                avatarColor={nameColor}
                                firstName={firstName}
                                lastName={lastName}
                            />
                            <span className={styles.displayName}>
                                {displayName}
                                <ExpandMoreIcon fontSize="small"/>
                            </span>
                        </Button>
                        <TipMenu
                            anchorEl={this.state.userMenuAnchorEl}
                            open={Boolean(this.state.userMenuAnchorEl)}
                            onClose={() => this.handleUserMenuClose()}
                            placement="bottom-start"
                        >
                            <MenuList className={styles.menuList}>
                                <MenuItem
                                    className={styles.name}
                                    disableRipple={true}
                                    style={{ backgroundColor: nameColor }}
                                >
                                    {`Hi, ${fullName}`}
                                </MenuItem>
                                <MenuItem
                                    className={styles.menuListItem}
                                    onClick={() => this.handleSignOutClick()}
                                >
                                Sign Out
                                    {
                                        (this.props.signOffInProgress)
                                            ? (
                                                <CircularProgress
                                                    className={styles.progress}
                                                    color="primary"
                                                    size={12}
                                                    thickness={6}
                                                />
                                            ) : false
                                    }
                                </MenuItem>
                            </MenuList>
                        </TipMenu>
                        <IconButton
                            className={styles.menu}
                            onClick={(e) => this.handleMenuButtonClick(e)}
                        >
                            <ChevronLeftIcon />
                        </IconButton>
                    </div>
                    <List className={styles.list}>
                        <ListItem
                            button
                            className={homeNavListClassNames}
                            onClick={() => this.handleNavItemClick(`/${PAGE_ID_DASHBOARD}`)}
                        >
                            <ListItemIcon className={styles.listItemIcon}>
                                <Home />
                            </ListItemIcon>
                            <ListItemText
                                className={styles.listItemText}
                                disableTypography={true}
                            >
                                Dashboard
                            </ListItemText>
                        </ListItem>
                        <ListItem
                            button
                            className={calendarNavListClassNames}
                            onClick={() => this.handleNavItemClick(`/${PAGE_ID_CALENDAR}`)}
                        >
                            <ListItemIcon className={styles.listItemIcon}>
                                <Event />
                            </ListItemIcon>
                            <ListItemText
                                className={styles.listItemText}
                                disableTypography={true}
                            >
                                Calendar
                            </ListItemText>
                        </ListItem>
                        <ScheduleList />
                    </List>
                    <div className={styles.logoWrap}>
                        <img
                            className={styles.logo}
                            src={coEventLogoWh}
                            alt="CoEvent"
                        />
                        <span className={styles.copy}>{`© ${format(new Date(), "yyyy")}`}</span>
                    </div>
                </Drawer>
                {
                    (this.props.drawerIsOpen)
                        ? false
                        : (
                            <Button
                                key="fab"
                                className={styles.floatingMenuButton}
                                color="secondary"
                                variant="fab"
                                onClick={(e) => this.handleMenuButtonClick(e)}
                            >
                                <MenuIcon />
                            </Button>
                        )
                }
            </div>
        );
        /**
         * Render the main app navigation.
         *
         * @return {ReactElement[]} Array of navigation elements.
         */
        const appNavEmpty = () => [
            <Drawer
                className={styles.drawer}
                classes={{
                    paper: classNames(styles.paper, styles.noOverflowVert),
                }}
                key="navDrawer"
                open={this.props.drawerIsOpen}
                variant="permanent"
            >
                <div className={styles.backHeader}>
                    <Button
                        className={styles.account}
                        disableRipple
                        fullWidth={true}
                    >
                        <InitialsAvatar
                            avatarColor={nameColor}
                            firstName={firstName}
                            lastName={lastName}
                        />
                        <span className={styles.displayName}>
                            {displayName}
                            <ExpandMoreIcon fontSize="small"/>
                        </span>
                    </Button>
                </div>
                <List className={styles.list}>
                    {emptyListItem()}
                    {emptyListItem()}
                    {emptyListItem()}
                    {emptyListItem()}
                </List>
                <div className={styles.logoWrap}>
                    <img
                        className={styles.logo}
                        src={coEventLogoWh}
                        alt="CoEvent"
                    />
                    <span className={styles.copy}>{`© ${format(new Date(), "yyyy")}`}</span>
                </div>
            </Drawer>,
        ];
        const emptyListItem = () => (
            <ListItem
                button
                className={styles.emptyListItem}
            >
                <div className={styles.emptyListItemContent}>
                    <LinearProgress
                        className={styles.emptyProgress}
                        classes={{
                            barColorPrimary: styles.emptyProgressBar,
                        }}
                    />
                </div>
            </ListItem>
        );
        /**
         * Conditionally render the appropriate main navigation for the current
         * page.
         *
         * @return {ReactElement[]} Array of navigation elements.
         */
        const renderMainNav = () => {
            let returnVal = false;

            if (this.props.fetchIdentityInProgress) {
                returnVal = appNavEmpty();
            } else if (this.props.location.pathname === "/" || !this.props.isAuthenticated) {
                returnVal = false;
            } else {
                returnVal = appNav();
            }

            return returnVal;
        };

        return renderMainNav();
    }
}

// Export the redux-connected component
export default withRouter(connect((state) => ({
    calendars: selectCalendars(state),
    drawerIsOpen: selectDrawerIsOpen(state),
    fetchIdentityInProgress: selectFetchIdentityInProgress(state),
    isAuthenticated: selectIsAuthenticated(state),
    screenWidth: selectScreenWidth(state),
    signOffInProgress: selectSignOffInProgress(state),
    user: selectUser(state),
}), {
    setDrawerIsOpen,
    signOff,
})(MainNav));

MainNav.propTypes = {
    // -------------------------------------------------------------------------
    // Data propTypes
    // -------------------------------------------------------------------------
    // Redux -------------------------------------------------------------------
    drawerIsOpen: PropTypes.bool.isRequired,
    fetchIdentityInProgress: PropTypes.bool.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    screenWidth: PropTypes.any,
    signOffInProgress: PropTypes.bool.isRequired,
    user: PropTypes.object,

    // React Router ------------------------------------------------------------
    history: PropTypes.object,
    location: PropTypes.object,

    // -------------------------------------------------------------------------
    // Method propTypes
    // -------------------------------------------------------------------------
    // Redux -------------------------------------------------------------------
    setDrawerIsOpen: PropTypes.func.isRequired,
    signOff: PropTypes.func.isRequired,
};

MainNav.defaultProps = {};
