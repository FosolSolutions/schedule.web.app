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
    selectLoginInProgress,
} from "redux/reducers/userReducer";
import { selectPageId } from "redux/reducers/uiReducer";
import { setPageId } from "redux/actions/uiActions";
import {
    backdoorLogin,
    googleLogin,
    microsoftLogin,
} from "redux/actions/userActions";
import { fetchCalendars } from "redux/actions/calendarsActions";

//------------------------------------------------------------------------------
// Components
//------------------------------------------------------------------------------
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import LinearProgress from "@material-ui/core/LinearProgress";
import SvgIcon from "@material-ui/core/SvgIcon";

//------------------------------------------------------------------------------
// Assets
//------------------------------------------------------------------------------
import styles from "features/app/components/Login/login.scss";
import coEventLogoWh from "assets/images/logos/coEventLogoWh.svg";
import LinkIcon from "@material-ui/icons/Link";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import {
    SVG_PATH_GOOGLE,
    SVG_PATH_MICROSOFT,
} from "utils/constants";

//------------------------------------------------------------------------------

/**
 * Renders the Login page content.
 */
export class Login extends React.Component {
    render() {
        const renderProgress = () => {
            let returnVal = false;

            if (this.props.loginInProgress) {
                returnVal = (
                    <LinearProgress
                        className={styles.progress}
                        color="secondary"
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
                            <LinkIcon onClick={() => this.props.backdoorLogin()}/>
                            <span className={styles.linkInstructionText}>
                                Click the sign-in link in your email
                            </span>
                        </div>
                    </section>
                    <section className={`${styles.panel} ${styles.lowEm}`}>
                        <h2 className={styles.signInHeading}>Or use another service:</h2>
                        <Button
                            className={`${styles.loginButton} ${styles.google}`}
                            onClick={() => this.props.googleLogin()}
                        >
                            <SvgIcon className={styles.socialIcon}>
                                <path d={SVG_PATH_GOOGLE} />
                            </SvgIcon>
                            Sign in with Google
                        </Button>
                        <Button
                            className={`${styles.loginButton} ${styles.microsoft}`}
                            onClick={() => this.props.microsoftLogin()}
                        >
                            <SvgIcon className={styles.socialIcon}>
                                <path d={SVG_PATH_MICROSOFT} />
                            </SvgIcon>
                            Sign in with Microsoft
                        </Button>
                    </section>
                    {renderProgress()}
                </Card>
            </section>
        );
    }
}

// Export the redux-connected component
export default connect((state) => ({
    loginInProgress: selectLoginInProgress(state),
    pageId: selectPageId(state),
    userIsAuthenticated: selectIsAuthenticated(state),
}), {
    backdoorLogin,
    fetchCalendars,
    googleLogin,
    microsoftLogin,
    setPageId,
})(Login);

Login.propTypes = {
    // -------------------------------------------------------------------------
    // Data propTypes
    // -------------------------------------------------------------------------
    // Redux -------------------------------------------------------------------
    loginInProgress: PropTypes.bool.isRequired,
    pageId: PropTypes.string.isRequired,
    userIsAuthenticated: PropTypes.bool.isRequired,

    // -------------------------------------------------------------------------
    // Method propTypes
    // -------------------------------------------------------------------------
    // Redux -------------------------------------------------------------------
    backdoorLogin: PropTypes.func.isRequired,
    googleLogin: PropTypes.func.isRequired,
    setPageId: PropTypes.func.isRequired,
    microsoftLogin: PropTypes.func.isRequired,
};
