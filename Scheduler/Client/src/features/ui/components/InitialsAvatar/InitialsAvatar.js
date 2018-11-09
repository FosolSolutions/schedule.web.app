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
        const fullName = `${this.props.firstName} ${this.props.lastName}`;
        const UserAvatar = withStyles({
            colorDefault: {
                backgroundColor: stringToHslColor(fullName, 60, 60),
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
    firstName: PropTypes.string,
    lastName: PropTypes.string,
};

InitialsAvatar.defaultProps = {
    firstName: "Anonymous",
    lastName: "User",
};
