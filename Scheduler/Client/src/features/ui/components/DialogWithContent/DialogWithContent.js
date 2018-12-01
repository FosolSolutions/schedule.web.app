//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import PropTypes from "prop-types";
import React from "react";

//------------------------------------------------------------------------------
// Components
//------------------------------------------------------------------------------
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

//------------------------------------------------------------------------------
// Assets
//------------------------------------------------------------------------------
import styles from "features/ui/components/DialogWithContent/dialogWithContent.scss";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import { noOp } from "utils/generalUtils";

//------------------------------------------------------------------------------

export default class DialogWithContent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
        };
    }

    handleClickOpen() {
        this.props.handleOpen();
        this.setState({ open: true });
    }

    handleClose() {
        this.props.handleClose();
        this.setState({ open: false });
    }

    handleCancel() {
        this.props.handleCancel();
        this.setState({ open: false });
    }

    handleSubmit() {
        this.props.handleSubmit();
        this.setState({ open: false });
    }

    render() {
        const launchButton = () => {
            const launchButtonProps = {
                ...this.props.launchButtonProps,
                onClick: () => this.handleClickOpen(),
                onClose: () => this.handleClose(),
            };
            const ButtonConstructor = this.props.launchButton;
            const noProgressButton = (
                <ButtonConstructor {...launchButtonProps}>
                    {this.props.buttonContent}
                </ButtonConstructor>
            );
            return (this.props.withProgress && this.props.progress)
                ? (
                    <div className={styles.progressWrap}>
                        {noProgressButton}
                        {this.props.progress}
                    </div>
                )
                : noProgressButton;
        };

        return (
            <div className={styles.wrap}>
                {launchButton()}
                <Dialog
                    open={this.state.open}
                    onClose={() => this.handleClose()}
                    aria-labelledby="formDialogTitle"
                >
                    <DialogTitle id="formDialogTitle">{this.props.dialogTitle}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {this.props.dialogBodyText}
                        </DialogContentText>
                        {this.props.children}
                    </DialogContent>
                    <DialogActions>
                        <Button
                            className={styles.dialogButton}
                            onClick={() => this.handleCancel()}
                            color="secondary"
                        >
                            {this.props.cancelText}
                        </Button>
                        <Button
                            className={styles.dialogButton}
                            onClick={() => this.handleSubmit()}
                            color="secondary"
                        >
                            {this.props.submitText}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

DialogWithContent.propTypes = {
    // -------------------------------------------------------------------------
    // Data propTypes
    // -------------------------------------------------------------------------
    buttonContent: PropTypes.node.isRequired,
    launchButtonProps: PropTypes.object,
    cancelText: PropTypes.string,
    children: PropTypes.node,
    dialogBodyText: PropTypes.string,
    dialogTitle: PropTypes.string,
    progress: PropTypes.oneOfType([PropTypes.node, PropTypes.bool]),
    withProgress: PropTypes.bool,

    // -------------------------------------------------------------------------
    // Method propTypes
    // -------------------------------------------------------------------------
    launchButton: PropTypes.func.isRequired,
    handleOpen: PropTypes.func,
    handleClose: PropTypes.func,
    handleCancel: PropTypes.func,
    handleSubmit: PropTypes.func,
};

DialogWithContent.defaultProps = {
    launchButtonProps: {},
    cancelText: "Cancel",
    dialogTitle: "",
    progress: false,
    submitText: "Submit",
    withProgress: false,
    handleCancel: noOp,
    handleSubmit: noOp,
    handleOpen: noOp,
    handleClose: noOp,
};
