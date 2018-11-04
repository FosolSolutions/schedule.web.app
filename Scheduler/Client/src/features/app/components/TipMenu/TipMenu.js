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

/**
 * Renders the TipMenu.
 */
export class TipMenu extends React.Component {
    render() {
        const composedMenu = ({ TransitionProps, placement }) => (
            <Grow
                {...TransitionProps}
                style={{
                    transformOrigin: (placement === "bottom")
                        ? "center top"
                        : "center bottom",
                }}
            >
                <Paper>
                    <ClickAwayListener onClickAway={this.props.onClose}>
                        {this.props.children}
                    </ClickAwayListener>
                </Paper>
            </Grow>
        );

        return (
            <Popper
                open={Boolean(this.props.anchorEl)}
                anchorEl={this.props.anchorEl}
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

    // -------------------------------------------------------------------------
    // Method propTypes
    // -------------------------------------------------------------------------
    onClose: PropTypes.func.isRequired,
};
