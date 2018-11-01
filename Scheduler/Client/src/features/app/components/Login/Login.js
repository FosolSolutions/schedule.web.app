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
import { backdoorLogin } from "redux/actions/userActions";
import { fetchCalendars } from "redux/actions/calendarsActions";

//------------------------------------------------------------------------------
// Components
//------------------------------------------------------------------------------
import Card from "@material-ui/core/Card";
import CircularProgress from "@material-ui/core/CircularProgress";
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
// Helpers
//------------------------------------------------------------------------------
import {
    PAGE_ID,
    PATH_DASHBOARD,
} from "utils/staticBackendData";
import { PAGE_ID_HOME } from "utils/backendConstants";

//------------------------------------------------------------------------------

/**
 * Renders the Login page content.
 */
export class Login extends React.Component {
    componentDidMount() {
        document.body.className += ` ${globalStyles.fullHeight}`;
    }

    componentWillUnmount() {
        document.body.className = `${globalStyles.appHeight}`;
    }

    handleLoginClick() {
        this.props.backdoorLogin()
            .then(() => {
                if (this.props.userIsAuthenticated && PAGE_ID === PAGE_ID_HOME) {
                    window.location.href = PATH_DASHBOARD;
                }
            });
    }

    render() {
        const loginWindow = () => (
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
        );
        const loader = () => (
            <div className={styles.progressWrap}>
                <CircularProgress className={styles.progress} />
            </div>
        );
        const pageContent = (this.props.authenticationInProgress)
            ? loader()
            : loginWindow();
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
                {pageContent}
            </section>
        );
    }
}

// Export the redux-connected component
export default connect((state) => ({
    userIsAuthenticated: selectIsAuthenticated(state),
}), {
    backdoorLogin,
    fetchCalendars,
})(Login);

Login.propTypes = {
    // -------------------------------------------------------------------------
    // Data propTypes
    // -------------------------------------------------------------------------
    // Whether authentication is in progress
    authenticationInProgress: PropTypes.bool.isRequired,

    // Whether the user is authenticated
    userIsAuthenticated: PropTypes.bool.isRequired,

    // -------------------------------------------------------------------------
    // Method propTypes
    // -------------------------------------------------------------------------
    // Login
    backdoorLogin: PropTypes.func.isRequired,
};

Login.defaultProps = {
    authenticationInProgress: true,
};
