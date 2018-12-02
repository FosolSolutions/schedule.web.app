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
    selectIsAuthenticated,
    selectFetchIdentityInProgress,
    selectLoginInProgress,
    selectParticipantKey,
} from "redux/reducers/userReducer";
import {
    participantLogin,
    setParticipantKey,
} from "redux/actions/userActions";
import { fetchCalendars } from "redux/actions/calendarActions";

//------------------------------------------------------------------------------
// Components
//------------------------------------------------------------------------------
// OAuth login
// import Button from "@material-ui/core/Button";
// import SvgIcon from "@material-ui/core/SvgIcon";

import Card from "@material-ui/core/Card";
import LinearProgress from "@material-ui/core/LinearProgress";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ValidatedTextField from "features/ui/components/ValidatedTextField/ValidatedTextField";


//------------------------------------------------------------------------------
// Assets
//------------------------------------------------------------------------------
import styles from "features/app/components/Authentication/authentication.scss";
import coEventLogoWh from "assets/images/logos/coEventLogoWh.svg";
import LinkIcon from "@material-ui/icons/Link";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import { participantKeyValid } from "utils/validatorRules";
// OAuth login
// import {
//     SVG_PATH_GOOGLE,
//     SVG_PATH_MICROSOFT,
// } from "utils/constants";
// import {
//     PATH_AUTH_GOOGLE,
//     PATH_AUTH_MICROSOFT,
// } from "utils/backendConstants";

//------------------------------------------------------------------------------

/**
 * Renders the Authentication page content.
 */
export class Authentication extends React.PureComponent {
    constructor(props) {
        super(props);

        this.loginAttempted = false;

        const participantKeyInputName = "Participant ID";

        this.participantKeyValidatorRules = [
            participantKeyValid(participantKeyInputName),
        ];
    }

    componentDidMount() {
        if (
            this.props.match &&
            this.props.match.isExact &&
            this.props.match.params.participantKey
        ) {
            this.props.setParticipantKey(this.props.match.params.participantKey);
            this.props.participantLogin();
        }
    }

    render() {
        const renderLoginProgress = () => {
            let returnVal = false;

            if (this.props.loginInProgress) {
                returnVal = (
                    <LinearProgress
                        className={styles.loginProgress}
                        classes={{
                            barColorPrimary: styles.loginProgressBar,
                        }}
                    />
                );
            } else {
                returnVal = <span className={styles.progressPlaceholder} />;
            }

            return returnVal;
        };

        return (
            <section
                className={styles.background}
                key="splashScreen"
            >
                <div>
                    <img
                        className={styles.logo}
                        src={coEventLogoWh}
                        alt=""
                    />
                    <h1 className={styles.valueProp}>
                        Flexible scheduling for teams and organizations.
                    </h1>
                    <Card className={styles.loginWindow}>
                        <section className={styles.panel}>
                            <h2 className={styles.signInHeading}>To sign in:</h2>
                            <div className={styles.linkInstructionWrap}>
                                <LinkIcon />
                                <span className={styles.linkInstructionText}>
                                    Click the sign-in link in your email
                                </span>
                            </div>
                        </section>
                        <section className={`${styles.panel} ${styles.lowEm}`}>
                            <h2 className={styles.signInHeading}>
                                Or, paste and submit your participant ID:
                                {/* Or use another service: */}
                            </h2>
                            <ValidatedTextField
                                adornmentIcon={<ExitToAppIcon />}
                                adornmentPosition="end"
                                adornmentIsButton={true}
                                label="Participant ID"
                                syncValidatorRules={this.participantKeyValidatorRules}
                                value={this.props.participantKey}
                                onEnter={this.props.participantLogin}
                                storeValueSetter={this.props.setParticipantKey}
                            />
                            {/* <Button
                                className={`${styles.loginButton} ${styles.google}`}
                                href={PATH_AUTH_GOOGLE}
                            >
                                <SvgIcon className={styles.socialIcon}>
                                    <path d={SVG_PATH_GOOGLE} />
                                </SvgIcon>
                                Sign in with Google
                            </Button>
                            <Button
                                className={`${styles.loginButton} ${styles.microsoft}`}
                                href={PATH_AUTH_MICROSOFT}
                            >
                                <SvgIcon className={styles.socialIcon}>
                                    <path d={SVG_PATH_MICROSOFT} />
                                </SvgIcon>
                                Sign in with Microsoft
                            </Button> */}
                        </section>
                        {renderLoginProgress()}
                    </Card>
                </div>
            </section>
        );
    }
}

// Export the redux-connected component
export default connect((state) => ({
    fetchIdentityInProgress: selectFetchIdentityInProgress(state),
    loginInProgress: selectLoginInProgress(state),
    participantKey: selectParticipantKey(state),
    userIsAuthenticated: selectIsAuthenticated(state),
}), {
    fetchCalendars,
    participantLogin,
    setParticipantKey,
})(Authentication);

Authentication.propTypes = {
    // -------------------------------------------------------------------------
    // Data propTypes
    // -------------------------------------------------------------------------
    // Redux -------------------------------------------------------------------
    fetchIdentityInProgress: PropTypes.bool.isRequired,
    loginInProgress: PropTypes.bool.isRequired,
    participantKey: PropTypes.string.isRequired,
    userIsAuthenticated: PropTypes.bool.isRequired,

    // React Router ------------------------------------------------------------
    match: PropTypes.object,

    // -------------------------------------------------------------------------
    // Method propTypes
    // -------------------------------------------------------------------------
    // Redux -------------------------------------------------------------------
    participantLogin: PropTypes.func.isRequired,
    setParticipantKey: PropTypes.func.isRequired,
};

Authentication.defaultProps = {
    match: null,
};
