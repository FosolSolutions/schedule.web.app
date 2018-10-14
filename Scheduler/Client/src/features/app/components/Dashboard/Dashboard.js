//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

//------------------------------------------------------------------------------
// Redux Support
//------------------------------------------------------------------------------
import { selectCalendars } from "redux/reducers/calendarsReducer";
import {
    selectGivenName,
    selectSurname,
} from "redux/reducers/userReducer";

//------------------------------------------------------------------------------
// Components
//------------------------------------------------------------------------------
import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Chip from "@material-ui/core/Chip";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";

//------------------------------------------------------------------------------
// Assets
//------------------------------------------------------------------------------
import styles from "features/app/components/Dashboard/dashboard.scss";
import HomeIcon from "@material-ui/icons/Home";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { stringToHslColor } from "../../../../__utils__/generalUtils";

//------------------------------------------------------------------------------

/**
 * Renders the dashboard content.
 */
export class Dashboard extends React.PureComponent {
    render() {
        const vcName = "Victoria Christadelphians";
        const soName = "Some Other Organization";
        const VcAvatar = withStyles({
            colorDefault: {
                backgroundColor: stringToHslColor(vcName),
            },
        })(Avatar);
        const SoAvatar = withStyles({
            colorDefault: {
                backgroundColor: stringToHslColor(soName),
            },
        })(Avatar);

        return [
            <Chip
                className={styles.chip}
                avatar={
                    <Avatar className={styles.chipAvatar}><HomeIcon /></Avatar>
                }
                key="dashboardChip"
                label="Dashboard"
            />,
            <Grid
                container
                key="dashboardGrid"
                spacing={8}
            >
                <Grid
                    item
                    xs={12}
                >
                    <Card>
                        <CardHeader
                            action={
                                <IconButton>
                                    <MoreVertIcon />
                                </IconButton>
                            }
                            className={styles.cardHeader}
                            title="At a glance"
                            subheader="My activities"
                        />
                        <CardContent>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid
                    item
                    xs={12}
                    md={6}
                    xl={4}
                >
                    <Card>
                        <CardHeader
                            avatar={
                                <VcAvatar>
                                    VC
                                </VcAvatar>
                            }
                            action={
                                <IconButton>
                                    <MoreVertIcon />
                                </IconButton>
                            }
                            className={styles.cardHeader}
                            title={vcName}
                            subheader="Overview"
                        />
                        <Divider />
                    </Card>
                </Grid>
                <Grid
                    item
                    xs={12}
                    md={6}
                    xl={4}
                >
                    <Card>
                        <CardHeader
                            avatar={
                                <SoAvatar>
                                    SO
                                </SoAvatar>
                            }
                            action={
                                <IconButton>
                                    <MoreVertIcon />
                                </IconButton>
                            }
                            className={styles.cardHeader}
                            title={soName}
                            subheader="Overview"
                        />
                        <Divider />
                    </Card>
                </Grid>
            </Grid>,
        ];
    }
}

/**
 * Map values from redux store state to props
 *
 * @param  {Object} state Redux store state
 *
 * @return {Object}       Object map of props
 */
function mapStateToProps(state) {
    return {
        calendars: selectCalendars(state),
        givenName: selectGivenName(state),
        surname: selectSurname(state),
    };
}

// Export the redux-connected component
export default connect(mapStateToProps, null)(Dashboard);

Dashboard.propTypes = {
    // -------------------------------------------------------------------------
    // Data propTypes
    // -------------------------------------------------------------------------
    // The calendars
    calendars: PropTypes.array.isRequired,

    // User's given name
    givenName: PropTypes.string.isRequired,

    // User's surname
    surname: PropTypes.string.isRequired,
};

Dashboard.defaultProps = {};
