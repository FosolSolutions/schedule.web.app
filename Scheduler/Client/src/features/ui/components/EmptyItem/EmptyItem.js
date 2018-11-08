//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import PropTypes from "prop-types";
import React from "react";
import classNames from "classnames";

//------------------------------------------------------------------------------
// Components
//------------------------------------------------------------------------------
import ListItem from "@material-ui/core/ListItem";

//------------------------------------------------------------------------------
// Assets
//------------------------------------------------------------------------------
import styles from "features/ui/components/EmptyItem/emptyItem.scss";
import EventBusyIcon from "@material-ui/icons/EventBusy";
import ErrorIcon from "@material-ui/icons/Error";

//------------------------------------------------------------------------------

/**
 * Renders an empty item.
 */
export default class EmptyItem extends React.PureComponent {
    render() {
        const iconProps = {
            className: styles.icon,
            fontSize: "small",
        };
        const icon = (this.props.isError)
            ? <ErrorIcon { ...iconProps } />
            : <EventBusyIcon { ...iconProps } />;
        const listItemClassNames = classNames({
            [styles.listItem]: true,
            [styles.error]: this.props.isError,
        });
        const divClassNames = classNames({
            [styles.div]: true,
            [styles.error]: this.props.isError,
        });

        const returnVal = (this.props.isListItem)
            ? (
                <ListItem className={listItemClassNames}>
                    {icon}
                    {this.props.text}
                </ListItem>
            ) : (
                <div className={divClassNames}>
                    {icon}
                    {this.props.text}
                </div>
            );

        return returnVal;
    }
}

EmptyItem.propTypes = {
    // -------------------------------------------------------------------------
    // Data propTypes
    // -------------------------------------------------------------------------
    // Whether the empty state should be displayed as an error.
    isError: PropTypes.bool.isRequired,

    // Whether the empty item should be a ListItem.
    isListItem: PropTypes.bool,

    // The text to display in the list item.
    text: PropTypes.string.isRequired,
};

EmptyItem.defaultProps = {
    isListItem: false,
};
