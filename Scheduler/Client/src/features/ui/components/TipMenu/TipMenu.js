//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import PropTypes from "prop-types";
import React from "react";

//------------------------------------------------------------------------------
// Components
//------------------------------------------------------------------------------
import Popper from "@material-ui/core/Popper";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";

//------------------------------------------------------------------------------
// Assets
//------------------------------------------------------------------------------
import styles from "features/ui/components/TipMenu/tipMenu.scss";

//------------------------------------------------------------------------------

/**
 * Renders the TipMenu.
 */
export default class TipMenu extends React.Component {
    render() {
        const composedMenu = ({ TransitionProps, placement }) => {
            const placementCompare = (this.props.placement === null)
                ? "bottom"
                : this.props.placement;

            return (
                <Grow
                    {...TransitionProps}
                    style={{
                        transformOrigin: (placement === placementCompare)
                            ? "left top"
                            : "left bottom",
                    }}
                >
                    <Paper className={styles.paper}>
                        <ClickAwayListener onClickAway={this.props.onClose}>
                            {this.props.children}
                        </ClickAwayListener>
                    </Paper>
                </Grow>
            );
        };

        return (
            <Popper
                open={Boolean(this.props.anchorEl)}
                anchorEl={this.props.anchorEl}
                placement={this.props.placement}
                transition
                disablePortal
            >
                {composedMenu}
            </Popper>
        );
    }
}

TipMenu.propTypes = {
    // -------------------------------------------------------------------------
    // Data propTypes
    // -------------------------------------------------------------------------
    anchorEl: PropTypes.instanceOf(Element),
    open: PropTypes.bool.isRequired,
    placement: PropTypes.string,

    // -------------------------------------------------------------------------
    // Method propTypes
    // -------------------------------------------------------------------------
    onClose: PropTypes.func.isRequired,
};

TipMenu.defaultProps = {
    placement: null,
};
