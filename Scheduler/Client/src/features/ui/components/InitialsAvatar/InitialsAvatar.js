//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

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

//------------------------------------------------------------------------------

/**
 * Renders an avatar using the user's initials.
 */
export class InitialsAvatar extends React.PureComponent {
    render() {
        return (
            <Avatar className={styles.circle}>
                <span className={styles.initials}>{`${this.props.givenName.charAt(0)}${this.props.surname.charAt(0)}`}</span>
            </Avatar>
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
    // User's given name
    givenName: PropTypes.string.isRequired,

    // User's surname
    surname: PropTypes.string.isRequired,
};

InitialsAvatar.defaultProps = {};
