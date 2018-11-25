//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import PropTypes from "prop-types";
import React from "react";
import classNames from "classnames";

//------------------------------------------------------------------------------
// Components
//------------------------------------------------------------------------------
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";

//------------------------------------------------------------------------------
// Assets
//------------------------------------------------------------------------------
import styles from "features/ui/components/ValidatedTextField/validatedTextField.scss";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import Validator, {
    VALIDATION_TYPE_SYNC,
    VALIDATION_VALID,
    VALIDATION_INVALID,
} from "utils/Validator";

//------------------------------------------------------------------------------

/**
 * Renders a text field with validation error as appropriate.
 */
export default class ValidatedTextField extends React.PureComponent {
    constructor(props) {
        super(props);

        this.validator = new Validator(props.syncValidatorRules);

        const error = this.validator.runRules(
            props.value,
            VALIDATION_TYPE_SYNC,
            props.siblingValue,
        );

        // Show errors on mount when there is an error to show and associated
        // prop is present
        this.state = {
            validatorError: error,
            showError: props.showErrorOnMount && error !== null,
            siblingChanged: false,
        };
    }

    componentDidUpdate(prevProps) {
        /*
         * Record when there is a change to the provided siblingValue (when a
         * sibling input changes). We don't want to re-validate this input
         * automatically as a result in every case, as that could mean showing
         * error messages on the sibling input before the user is finished with
         * their entry. For most cases, re-validation of this input as a result
         * only occurs on blur.
         */
        if (
            this.props.siblingValue !== ValidatedTextField.defaultProps.siblingValue &&
            prevProps.siblingValue !== this.props.siblingValue
        ) {
            this.setState({ siblingChanged: true });

            /*
             * Re-run validation of this input automatically if the sibling
             * input's validation status is VALIDATION_VALID. Where validation
             * of sibling inputs is inter-dependent (as in the case of min/max
             * range validation) a valid sibling may mean this input is also
             * valid now, in which case we want to clear any such errors on this
             * input without the user needing to blur/change it.
             */
            if (this.props.siblingValidationStatus === VALIDATION_VALID) {
                this.validate(this.props.value);
            }
        }

        /*
         * Run validation if there's an error and that the user has cleared the
         * sibling field.
         */
        if (
            this.state.validatorError !== null &&
            this.props.siblingValue === ValidatedTextField.defaultProps.siblingValue
        ) {
            this.validate(this.props.value);
        }
    }

    /**
     * Handle input blur event
     */
    handleBlur() {
        const newState = { showError: true };

        if (this.state.siblingChanged) {
            this.validate(this.props.value);
            newState.siblingChanged = false;
        }

        this.setState(newState);
    }

    /**
     * Handle input change event
     *
     * @param  {SyntheticEvent} e React synthetic event object
     */
    handleChange(e) {
        const value = e.target.value;

        this.validate(value);
    }

    /**
     * Handle input blur event
     */
    handleFocus() {
        this.props.onFocus();
    }

    /**
     * Handle input Enter keydown event
     *
     * @param  {SyntheticEvent} e React synthetic event object
     */
    handleKeyDown(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            this.props.onEnter();
        }
    }

    /**
     * Validate the input, updating parent state and validity status via prop
     * callback
     *
     * @param  {string} value The new value to validate, store in parent state
     */
    validate(value) {
        const newError = this.validator.runRules(
            value,
            VALIDATION_TYPE_SYNC,
            this.props.siblingValue,
        );
        const status = (newError === null) ? VALIDATION_VALID : VALIDATION_INVALID;

        this.props.storeStatusSetter(status);
        this.props.storeValueSetter(value);

        if (newError !== this.state.validatorError) {
            this.setState({ validatorError: newError });
        }
    }

    render() {
        const SHOULD_SHOW_ERROR = (
            this.state.validatorError !== null &&
            this.state.showError &&
            this.props.value !== ""
        );
        const textFieldClassNames = classNames({
            [styles.textField]: true,
            [styles.error]: SHOULD_SHOW_ERROR,
            [styles.standard]: this.props.variant === "standard",
        });
        const renderValidationError = () => {
            let validationErrorMarkup = false;

            if (SHOULD_SHOW_ERROR) {
                validationErrorMarkup = (
                    <span className={styles.validationError}>
                        {this.state.validatorError}
                    </span>
                );
            }

            return validationErrorMarkup;
        };
        const getInputProps = () => {
            const inputProps = {};
            let adornment = false;

            if (this.props.adornmentIcon) {
                if (this.props.adornmentIsButton) {
                    adornment = (
                        <InputAdornment position={this.props.adornmentPosition}>
                            <IconButton
                                className={this.props.variant === "standard" ? styles.adornmentButton : ""}
                                onClick={() => this.props.onEnter()}
                                disabled={this.state.validatorError !== null || this.props.value === ""}
                            >
                                {this.props.adornmentIcon}
                            </IconButton>
                        </InputAdornment>
                    );
                } else {
                    adornment = (
                        <InputAdornment position={this.props.adornmentPosition}>
                            {this.props.adornmentIcon}
                        </InputAdornment>
                    );
                }

                inputProps[`${this.props.adornmentPosition}Adornment`] = adornment;
                inputProps.className = styles.input;
            }

            return inputProps;
        };

        return (
            <div className={styles.textFieldWrap}>
                <TextField
                    className={textFieldClassNames}
                    error={SHOULD_SHOW_ERROR}
                    label={this.props.label}
                    margin={"normal"}
                    InputProps={getInputProps()}
                    InputLabelProps={this.props.inputLabelProps}
                    value={this.props.value}
                    variant={this.props.variant}
                    onBlur={(e) => this.handleBlur(e)}
                    onChange={(e) => this.handleChange(e)}
                    onFocus={(e) => this.handleFocus(e)}
                    onKeyDown={(e) => this.handleKeyDown(e)}
                />
                {renderValidationError()}
            </div>
        );
    }
}

ValidatedTextField.propTypes = {
    // -------------------------------------------------------------------------
    // Data propTypes
    // -------------------------------------------------------------------------
    // Adornment icon.
    adornmentIcon: PropTypes.node,

    // The position of the adornment. "start" or "end".
    adornmentPosition: PropTypes.string,

    // Whether the passed adornment icon should be a button.
    adornmentIsButton: PropTypes.bool,

    // Props to apply to the InputLabel component rendered by TextField
    inputLabelProps: PropTypes.object,

    // The field label.
    label: PropTypes.string,

    // Whether to show any error on mount.
    showErrorOnMount: PropTypes.bool,

    // Validation status of sibling. Used to automatically re-validate when
    // sibling is newly valid.
    siblingValidationStatus: PropTypes.string,

    // Used to track changes in state of a sibling input in order to trigger
    // revalidation of this input.
    siblingValue: PropTypes.string,

    // The synchronous concern validation rules to check.
    syncValidatorRules: PropTypes.array,

    // The material-ui style variant
    variant: PropTypes.string,

    // The field value.
    value: PropTypes.string,

    // -------------------------------------------------------------------------
    // Method propTypes
    // -------------------------------------------------------------------------
    // Handler to run on enter keypress
    onEnter: PropTypes.func,

    // Handler to run onfocus
    onFocus: PropTypes.func,

    // Action creator for updating input validity status in store (via parent
    // component's mapDispatchToProps)
    storeStatusSetter: PropTypes.func,

    // Action creator for updating input value in store (via parent component's
    // mapDispatchToProps)
    storeValueSetter: PropTypes.func.isRequired,
};

ValidatedTextField.defaultProps = {
    siblingValidationStatus: "",
    siblingValue: "",
    showErrorOnMount: false,
    syncValidatorRules: [],
    value: "",
    variant: "outlined",
    onEnter: () => {},
    onFocus: () => {},
    storeStatusSetter: () => {},
};
