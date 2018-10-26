//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
// import PropTypes from "prop-types";
import React from "react";

//------------------------------------------------------------------------------
// Assets
//------------------------------------------------------------------------------
import styles from "features/app/components/Home/home.scss";
import hands from "assets/images/hands.svg";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

/**
 * Renders the homepage content.
 */
export default class Home extends React.Component {
    render() {
        return [
            <section
                className={styles.splashScreen}
                key="splashScreen"
            >
                <h1 className={styles.valueProp}>
                    Flexible scheduling for teams and organizations.
                </h1>
                <img
                    className={styles.hands}
                    src={hands}
                    alt=""
                />
            </section>,
            <section
                className={styles.spacer}
                key="spacer2"
            />,
        ];
    }
}

Home.propTypes = {
    // -------------------------------------------------------------------------
    // Data propTypes
    // -------------------------------------------------------------------------

    // -------------------------------------------------------------------------
    // Method propTypes
    // -------------------------------------------------------------------------
};

Home.defaultProps = {};
