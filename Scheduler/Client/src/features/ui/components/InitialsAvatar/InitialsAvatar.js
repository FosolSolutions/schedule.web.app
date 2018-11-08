//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";

//------------------------------------------------------------------------------
// Redux Support
//------------------------------------------------------------------------------
import { selectUser } from "redux/reducers/userReducer";

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
export class InitialsAvatar extends React.PureComponent {
    render() {
        const user = this.props.user;
        const firstName = (user === null) ? "" : user.getFirstName();
        const lastName = (user === null) ? "" : user.getLastName();
        const fullName = `${firstName} ${lastName}`;
        const UserAvatar = withStyles({
            colorDefault: {
                backgroundColor: stringToHslColor(fullName, 60, 58),
                borderColor: `${stringToHslColor(fullName, 60, 62)} !important`,
            },
        })(Avatar);
        return (
            <UserAvatar className={styles.circle}>
                <span className={styles.initials}>
                    {`${firstName.charAt(0)}${lastName.charAt(0)}`}
                </span>
            </UserAvatar>
        );
    }
}

// Export the redux-connected component
export default connect((state) => ({
    user: selectUser(state),
}),
null)(InitialsAvatar);

InitialsAvatar.propTypes = {
    // -------------------------------------------------------------------------
    // Data propTypes
    // -------------------------------------------------------------------------
    // Redux -------------------------------------------------------------------
    user: PropTypes.object,
};
