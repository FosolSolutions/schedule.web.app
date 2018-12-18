//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import isUndefined from "lodash/isUndefined";

//------------------------------------------------------------------------------
// Redux Support
//------------------------------------------------------------------------------
import { selectAnswers } from "redux/reducers/calendarReducer";
import {
    setAnswerFromState,
    setCurrentOpeningId,
    setCurrentQuestionId,
} from "redux/actions/calendarActions";

//------------------------------------------------------------------------------
// Components
//------------------------------------------------------------------------------
import ValidatedTextField from "features/ui/components/ValidatedTextField/ValidatedTextField";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import { required } from "utils/validatorRules";

//------------------------------------------------------------------------------

/**
 * Renders the schedules content.
 */
export class OpeningQuestions extends React.Component {
    handleQuestionFocus(openingId, questionId) {
        this.props.setCurrentOpeningId(openingId);
        this.props.setCurrentQuestionId(questionId);
    }

    render() {
        const questionValidatorRules = [
            required("Response"),
        ];

        return this.props.questions.map((question) => {
            const questionId = question.getId();
            const value = (
                !isUndefined(this.props.answers[this.props.openingId]) &&
                !isUndefined(this.props.answers[this.props.openingId][questionId])
            ) ? this.props.answers[this.props.openingId][questionId] : "";
            return (
                <ValidatedTextField
                    key={`opening${this.props.openingId}_question${questionId}`}
                    id={`opening${this.props.openingId}_question${questionId}`}
                    data-id={this.props.openingId}
                    inputLabelProps={{ shrink: true }}
                    label={question.getText()}
                    syncValidatorRules={questionValidatorRules}
                    value={value}
                    variant="standard"
                    onFocus={
                        () => this.handleQuestionFocus(this.props.openingId, questionId)
                    }
                    storeValueSetter={this.props.setAnswerFromState}
                />
            );
        });
    }
}

// Export the redux-connected component
export default connect((state) => ({
    answers: selectAnswers(state),
}), {
    setAnswerFromState,
    setCurrentOpeningId,
    setCurrentQuestionId,
})(OpeningQuestions);

OpeningQuestions.propTypes = {
    // -------------------------------------------------------------------------
    // Data propTypes
    // -------------------------------------------------------------------------
    // Redux -------------------------------------------------------------------
    answers: PropTypes.object.isRequired,

    // React Router ------------------------------------------------------------
    history: PropTypes.object,
    location: PropTypes.object,

    // Passed from parent ------------------------------------------------------
    openingId: PropTypes.number.isRequired,
    questions: PropTypes.array.isRequired,

    // -------------------------------------------------------------------------
    // Method propTypes
    // -------------------------------------------------------------------------
    // Redux -------------------------------------------------------------------
    setAnswerFromState: PropTypes.func.isRequired,
    setCurrentOpeningId: PropTypes.func.isRequired,
    setCurrentQuestionId: PropTypes.func.isRequired,
};

OpeningQuestions.defaultProps = {};
