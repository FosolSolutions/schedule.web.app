//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import PropTypes from "prop-types";
import React from "react";
import { withStyles } from "@material-ui/core/styles";

//------------------------------------------------------------------------------
// Components
//------------------------------------------------------------------------------
import Avatar from "@material-ui/core/Avatar";

//------------------------------------------------------------------------------
// Assets
//------------------------------------------------------------------------------
import styles from "features/ui/components/InitialsAvatar/initialsAvatar.scss";
import { stringToHslColor } from "utils/generalUtils";

//------------------------------------------------------------------------------

/**
 * Renders an avatar using the user's initials.
 */
export default class InitialsAvatar extends React.PureComponent {
    render() {
        const UserAvatar = withStyles({
            colorDefault: {
                backgroundColor: this.props.avatarColor,
            },
        })(Avatar);
        return (
            <UserAvatar className={styles.circle}>
                <span className={styles.initials}>
                    {`${this.props.firstName.charAt(0)}${this.props.lastName.charAt(0)}`}
                </span>
            </UserAvatar>
        );
    }
}

InitialsAvatar.propTypes = {
    // -------------------------------------------------------------------------
    // Data propTypes
    // -------------------------------------------------------------------------
    avatarColor: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
};

InitialsAvatar.defaultProps = {
    avatarColor: stringToHslColor("AnonymousUser", 60, 70),
    firstName: "Anonymous",
    lastName: "User",
};
