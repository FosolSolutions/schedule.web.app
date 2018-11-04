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
import {
    selectGivenName,
    selectSurname,
} from "redux/reducers/userReducer";

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
        const fullName = `${this.props.givenName} ${this.props.surname}`;
        const UserAvatar = withStyles({
            colorDefault: {
                backgroundColor: stringToHslColor(fullName, 60, 58),
                borderColor: `${stringToHslColor(fullName, 60, 62)} !important`,
            },
        })(Avatar);
        return (
            <UserAvatar className={styles.circle}>
                <span className={styles.initials}>
                    {`${this.props.givenName.charAt(0)}${this.props.surname.charAt(0)}`}
                </span>
            </UserAvatar>
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
        givenName: selectGivenName(state),
        surname: selectSurname(state),
    };
}

// Export the redux-connected component
export default connect(mapStateToProps, null)(InitialsAvatar);

InitialsAvatar.propTypes = {
    // -------------------------------------------------------------------------
    // Data propTypes
    // -------------------------------------------------------------------------
    // Redux -------------------------------------------------------------------
    givenName: PropTypes.string.isRequired,
    surname: PropTypes.string.isRequired,
};
