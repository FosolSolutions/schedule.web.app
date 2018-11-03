//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

//------------------------------------------------------------------------------
// Redux Support
//------------------------------------------------------------------------------
import { selectIsAuthenticated } from "redux/reducers/userReducer";
import { selectPageId } from "redux/reducers/uiReducer";
import { setPageId } from "redux/actions/uiActions";
import { backdoorLogin } from "redux/actions/userActions";
import { fetchCalendars } from "redux/actions/calendarsActions";

//------------------------------------------------------------------------------
// Components
//------------------------------------------------------------------------------
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import LinkIcon from "@material-ui/icons/Link";

//------------------------------------------------------------------------------
// Assets
//------------------------------------------------------------------------------
import styles from "features/app/components/Login/login.scss";
import globalStyles from "assets/styles/global.scss";
import coEventLogoWh from "assets/images/logos/coEventLogoWh.svg";

//------------------------------------------------------------------------------

/**
 * Renders the Login page content.
 */
export class Login extends React.Component {
    componentDidMount() {
        // We need to do this for as the login page requires 100% height on the
        // body element, whereas the rest of the app does not. React has no
        // governance over parent elements, and it shouldn't be rendereed into
        // the body element directly.
        document.body.className += ` ${globalStyles.fullHeight}`;
    }

    componentWillUnmount() {
        // Undo what we did in componentDidMount.
        document.body.className = `${globalStyles.appHeight}`;
    }

    /**
     * Handle login button clicks (currently backdoor user login).
     */
    handleLoginClick() {
        this.props.backdoorLogin();
    }

    render() {
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
                            <LinkIcon />
                            <span className={styles.linkInstructionText}>
                            Click the sign-in link in your email
                            </span>
                        </div>
                    </section>
                    <section className={`${styles.panel} ${styles.lowEm}`}>
                        <h2 className={styles.signInHeading}>
                        Or, paste and submit your participant ID:
                        </h2>
                        <Grid
                            container
                            alignItems="center"
                        >
                            <Grid
                                className={styles.fullWidth}
                                item
                            >
                                <TextField
                                    className={styles.textField}
                                    label="Participant ID"
                                    margin="normal"
                                    variant="outlined"
                                    InputProps={{
                                        className: styles.input,
                                        endAdornment: <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => this.handleLoginClick()}
                                            >
                                                <ExitToAppIcon />
                                            </IconButton>
                                        </InputAdornment>,
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </section>
                </Card>
            </section>
        );
    }
}

// Export the redux-connected component
export default connect((state) => ({
    pageId: selectPageId(state),
    userIsAuthenticated: selectIsAuthenticated(state),
}), {
    backdoorLogin,
    fetchCalendars,
    setPageId,
})(Login);

Login.propTypes = {
    // -------------------------------------------------------------------------
    // Data propTypes
    // -------------------------------------------------------------------------
    // Redux -------------------------------------------------------------------
    pageId: PropTypes.string.isRequired,
    userIsAuthenticated: PropTypes.bool.isRequired,

    // -------------------------------------------------------------------------
    // Method propTypes
    // -------------------------------------------------------------------------
    // Redux -------------------------------------------------------------------
    backdoorLogin: PropTypes.func.isRequired,
    setPageId: PropTypes.func.isRequired,
};
