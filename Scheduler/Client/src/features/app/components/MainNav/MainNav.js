//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import classNames from "classnames";
import format from "date-fns/format";

//------------------------------------------------------------------------------
// Redux Support
//------------------------------------------------------------------------------
import {
    backdoorLogin,
    signOff,
} from "redux/actions/userActions";
import { selectCalendars } from "redux/reducers/calendarReducer";
import {
    selectDrawerIsOpen,
    selectPageId,
} from "redux/reducers/uiReducer";
import {
    selectIsAuthenticated,
    selectUser,
} from "redux/reducers/userReducer";
import {
    setDrawerIsOpen,
    setPageId,
} from "redux/actions/uiActions";

//------------------------------------------------------------------------------
// Components
//------------------------------------------------------------------------------
import Drawer from "@material-ui/core/Drawer";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import TipMenu from "features/ui/components/TipMenu/TipMenu";
import InitialsAvatar from "features/ui/components/InitialsAvatar/InitialsAvatar";

//------------------------------------------------------------------------------
// Assets
//------------------------------------------------------------------------------
import Assignment from "@material-ui/icons/AssignmentOutlined";
import AssignmentFilled from "@material-ui/icons/Assignment";
import Event from "@material-ui/icons/EventOutlined";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Home from "@material-ui/icons/HomeOutlined";
import coEventLogoWh from "assets/images/logos/coEventLogoWh.svg";
import styles from "features/app/components/MainNav/mainNav.scss";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import { HISTORY_PUSH } from "utils/constants";
import {
    PAGE_ID_CALENDAR,
    PAGE_ID_DASHBOARD,
    PAGE_ID_ROOT,
    PAGE_ID_SCHEDULES,
} from "utils/backendConstants";
import { stringToHslColor } from "utils/generalUtils";

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

    render() {
        const user = this.props.user;
        const firstName = (user === null) ? "." : user.getFirstName();
        const lastName = (user === null) ? "." : user.getLastName();
        const fullName = (user === null) ? "Loading..." : user.getFullName();
        const displayName = (user === null) ? "Loading..." : user.getDisplayName();
        const nameColor = stringToHslColor(fullName, 60, 60);
        const drawerPaperClassNames = classNames({
            [styles.paper]: true,
            [styles.noOverflowVert]: true,
            [styles.paperIsOpen]: this.props.drawerIsOpen,
        });
        const homeNavListClassNames = classNames({
            [styles.listItem]: true,
            [styles.active]: this.props.pageId === PAGE_ID_DASHBOARD,
        });
        const schedulesNavListClassNames = classNames({
            [styles.listItem]: true,
            [styles.active]: this.props.pageId === PAGE_ID_SCHEDULES,
        });
        const calendarNavListClassNames = classNames({
            [styles.listItem]: true,
            [styles.active]: this.props.pageId === PAGE_ID_CALENDAR,
        });
        /**
         * Render the main app navigation.
         *
         * @return {ReactElement[]} Array of navigation elements.
         */
        const appNav = () => [
            <Drawer
                className={styles.drawer}
                classes={{
                    paper: drawerPaperClassNames,
                }}
                key="navDrawer"
                open={this.props.drawerIsOpen}

                variant="permanent"
                onClose={() => this.handleMenuButtonClick()}
            >
                <div className={styles.backHeader}>
                    <Button
                        className={styles.account}
                        disableRipple
                        fullWidth={true}
                        onClick={(e) => this.handleUserMenuClick(e)}
                    >
                        <InitialsAvatar
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
                            </MenuItem>
                        </MenuList>
                    </TipMenu>
                </div>
                <List className={styles.list}>
                    <ListItem
                        button
                        className={homeNavListClassNames}
                        onClick={
                            () => this.props.setPageId(PAGE_ID_DASHBOARD, HISTORY_PUSH)
                        }
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
                        onClick={
                            () => this.props.setPageId(PAGE_ID_CALENDAR, HISTORY_PUSH)
                        }
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
                    <h4 className={styles.orgHeading}>Victoria Christadelphians</h4>
                    <ExpansionPanel
                        className={styles.expansionPanel}
                        expanded={true}
                    >
                        <ExpansionPanelSummary
                            classes={{ expanded: styles.expanded }}
                            className={styles.expansionPanelSummary}
                        >
                            <ListItem
                                button
                                className={schedulesNavListClassNames}
                                onClick={
                                    () => this.props.setPageId(
                                        PAGE_ID_SCHEDULES,
                                        HISTORY_PUSH,
                                    )
                                }
                            >
                                <ListItemIcon className={styles.listItemIcon}>
                                    <Assignment />
                                </ListItemIcon>
                                <ListItemText
                                    className={styles.listItemText}
                                    disableTypography={true}
                                >
                                Ecclesial Schedule
                                </ListItemText>
                            </ListItem>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails className={styles.expansionPanelDetails}>
                            <ListItem
                                button
                                className={styles.expansionListItem}
                            >
                                <ListItemIcon className={styles.listItemIcon}>
                                    <AssignmentFilled fontSize="small"/>
                                </ListItemIcon>
                                <ListItemText
                                    className={styles.listItemText}
                                    disableTypography={true}
                                >
                                    Bible Talk
                                </ListItemText>
                            </ListItem>
                            <ListItem
                                button
                                className={styles.expansionListItem}
                            >
                                <ListItemIcon className={styles.listItemIcon}>
                                    <AssignmentFilled fontSize="small"/>
                                </ListItemIcon>
                                <ListItemText
                                    className={styles.listItemText}
                                    disableTypography={true}
                                >
                                    Bible Class
                                </ListItemText>
                            </ListItem>
                            <ListItem
                                button
                                className={styles.expansionListItem}
                            >
                                <ListItemIcon className={styles.listItemIcon}>
                                    <AssignmentFilled fontSize="small"/>
                                </ListItemIcon>
                                <ListItemText
                                    className={styles.listItemText}
                                    disableTypography={true}
                                >
                                    Memorial Meeting
                                </ListItemText>
                            </ListItem>
                            <ListItem
                                button
                                className={styles.expansionListItem}
                            >
                                <ListItemIcon className={styles.listItemIcon}>
                                    <AssignmentFilled fontSize="small"/>
                                </ListItemIcon>
                                <ListItemText
                                    className={styles.listItemText}
                                    disableTypography={true}
                                >
                                    Hall Cleaning
                                </ListItemText>
                            </ListItem>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
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
        /**
         * Conditionally render the appropriate main navigation for the current
         * page.
         *
         * @return {ReactElement[]} Array of navigation elements.
         */
        const renderMainNav = () => {
            let returnVal = false;

            switch (this.props.pageId) {
                case PAGE_ID_ROOT:
                    returnVal = false;
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
    isAuthenticated: selectIsAuthenticated(state),
    pageId: selectPageId(state),
    user: selectUser(state),
}), {
    backdoorLogin,
    setDrawerIsOpen,
    setPageId,
    signOff,
})(MainNav);

MainNav.propTypes = {
    // -------------------------------------------------------------------------
    // Data propTypes
    // -------------------------------------------------------------------------
    // Redux -------------------------------------------------------------------
    drawerIsOpen: PropTypes.bool.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    pageId: PropTypes.string.isRequired,
    user: PropTypes.object,

    // -------------------------------------------------------------------------
    // Method propTypes
    // -------------------------------------------------------------------------
    // Redux -------------------------------------------------------------------
    backdoorLogin: PropTypes.func.isRequired,
    setDrawerIsOpen: PropTypes.func.isRequired,
    setPageId: PropTypes.func.isRequired,
    signOff: PropTypes.func.isRequired,
};

MainNav.defaultProps = {};
