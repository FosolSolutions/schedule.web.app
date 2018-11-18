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
 * Renders the homepage content. Not currently in use, but keeping for now.
 */
export default class Home extends React.PureComponent {
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
};

Home.defaultProps = {};
