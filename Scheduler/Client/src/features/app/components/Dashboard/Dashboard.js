//------------------------------------------------------------------------------
// Third Party
//------------------------------------------------------------------------------
import React from "react";

//------------------------------------------------------------------------------
// Components
//------------------------------------------------------------------------------
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";

//------------------------------------------------------------------------------
// Assets
//------------------------------------------------------------------------------
import styles from "features/app/components/Dashboard/dashboard.scss";
import MoreVertIcon from "@material-ui/icons/MoreVert";

//------------------------------------------------------------------------------

/**
 * Renders the dashboard content.
 */
export default class Dashboard extends React.PureComponent {
    render() {
        return (
            <Grid
                container
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
            </Grid>
        );
    }
}

Dashboard.propTypes = {};

Dashboard.defaultProps = {};
