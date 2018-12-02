//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import classNames from "classnames";

//------------------------------------------------------------------------------
// Redux Support
//------------------------------------------------------------------------------
import { selectActivities } from "redux/reducers/calendarReducer";
import { selectDrawerIsOpen } from "redux/reducers/uiReducer";

//------------------------------------------------------------------------------
// Components
//------------------------------------------------------------------------------
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";

//------------------------------------------------------------------------------
// Assets
//------------------------------------------------------------------------------
import styles from "features/app/components/Schedules/schedules.scss";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
import {
    DRAWER_WIDTH,
    EVENT_NAME_MEMORIAL_MEETING,
    ACTIVITY_NAME_PRESIDE,
    ACTIVITY_NAME_PRESIDER,
} from "utils/constants";

//------------------------------------------------------------------------------

/**
 * Renders the schedules content.
 */
export class Schedules extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fixTableHead: false,
        };

        this.headerRefIntersectionObserver = null;
        this.headerRef = React.createRef();
    }

    componentDidMount() {
        this.initializeIntersectionObserver();
    }

    componentWillUnmount() {
        this.disconnectIntersectionObserver();
    }

    disconnectIntersectionObserver() {
        if (this.headerRefIntersectionObserver) {
            this.headerRefIntersectionObserver.disconnect();
        }
    }

    initializeIntersectionObserver() {
        const options = {
            root: null,
            threshold: [0.01, 1],
            rootMargin: "0px",
        };
        const callback = (entries) => {
            const entry = entries[0];

            if (
                !entry.isIntersecting ||
                (entry.isIntersecting && entry.intersectionRatio < 1)
            ) {
                this.setState({ fixTableHead: true });
            } else {
                this.setState({ fixTableHead: false });
            }
        };

        this.headerRefIntersectionObserver = new IntersectionObserver(callback, options);
        this.headerRefIntersectionObserver.observe(this.headerRef.current);
    }

    render() {
        const allActivities = this.props.activities.getAll();
        let tableHeadWidth;

        if (this.state.fixTableHead) {
            if (this.props.drawerIsOpen) {
                tableHeadWidth = `calc(100% - ${DRAWER_WIDTH} - 1em)`;
            } else {
                tableHeadWidth = "calc(100% - 1em)";
            }
        } else {
            tableHeadWidth = "100%";
        }

        const dateCell = (
            <TableCell
                className={styles.headerCell}
                style={this.props.firstColumnStyle}
            >
                Date
            </TableCell>
        );
        const tableHeadClassNames = classNames({
            [styles.tableHead]: true,
            [styles.fixed]: this.state.fixTableHead,
        });
        let activities = [];
        let activityCells = [];

        if (this.props.event !== null) {
            let returnVal;

            activities = this.props.event.getActivities().map(
                (activityId) => allActivities.get(activityId),
            );
            activityCells = activities.map((activity) => {
                const name = activity.getName();

                if (
                    this.props.event.getName() !== EVENT_NAME_MEMORIAL_MEETING &&
                    (
                        name === ACTIVITY_NAME_PRESIDE ||
                        name === ACTIVITY_NAME_PRESIDER
                    )
                ) {
                    returnVal = false;
                } else {
                    returnVal = (
                        <TableCell
                            className={styles.headerCell}
                            key={name}
                        >
                            {name}
                        </TableCell>
                    );
                }

                return returnVal;
            });
        }

        return [
            <tbody
                ref={this.headerRef}
                className={styles.tableHeadPlaceholder}
                key="headerPlaceholder"
            />,
            <TableHead
                className={tableHeadClassNames}
                key="tableHeader"
                style={{ width: tableHeadWidth }}
            >
                <TableRow className={styles.headerRow}>
                    {dateCell}
                    {activityCells}
                </TableRow>
            </TableHead>,
        ];
    }
}

// Export the redux-connected component
export default withRouter(connect((state) => ({
    activities: selectActivities(state),
    drawerIsOpen: selectDrawerIsOpen(state),
}),
null)(Schedules));

Schedules.propTypes = {
    // -------------------------------------------------------------------------
    // Data propTypes
    // -------------------------------------------------------------------------
    // Redux -------------------------------------------------------------------
    activities: PropTypes.object.isRequired,
    drawerIsOpen: PropTypes.bool.isRequired,

    // React Router ------------------------------------------------------------
    history: PropTypes.object,
    location: PropTypes.object,

    // From parent -------------------------------------------------------------
    firstColumnStyle: PropTypes.object,

    // From caller -------------------------------------------------------------
    // The representative event from which to render the schedule table header.
    event: PropTypes.object,
};

Schedules.defaultProps = {
    firstColumnStyle: {},
};
