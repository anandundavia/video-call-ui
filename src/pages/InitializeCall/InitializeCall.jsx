import React from "react";
import { connect } from "react-redux";

import Axios from "axios";

import withStyles from "@material-ui/core/styles/withStyles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Fade from "@material-ui/core/Fade";
import CircularProgress from "@material-ui/core/CircularProgress";

import peerService from "../../services/peer.service";
import streamService from "../../services/stream.service";
import socketService from "../../services/socket.service";

import constants from "../../constants";

import logger from "../../utils/logger";
const log = logger(__filename);

const styles = theme => ({
    main: {
        height: "100vh",
        width: "auto",
        display: "block", // Fix IE 11 issue.
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
            width: 400,
            marginLeft: "auto",
            marginRight: "auto"
        }
    },
    paper: {
        marginTop: theme.spacing.unit * 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit *
            3}px`
    },
    instruction: {
        marginTop: theme.spacing.unit * 8,
        textAlign: "center"
    },
    loading: {
        marginTop: theme.spacing.unit * 8,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column"
    },
    status: {
        marginTop: theme.spacing.unit
    }
});

class MakeCall extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: {
                progress: 0,
                message: "Please Wait..."
            },
            error: {
                message: null
            }
        };
    }

    render() {
        const { classes, user, peer, videoCall, history } = this.props;
        const { status } = this.state;
        if (videoCall.isStreamReceived) {
            history.push("/live-call");
            return null;
        }
        return (
            <div className={classes.main}>
                <Fade in>
                    <Paper className={classes.paper}>
                        <Typography component="h1" variant="h5">
                            Hi {user.mobileNumber}!
                        </Typography>
                        <Typography variant="caption">ID: {user._id}</Typography>
                    </Paper>
                </Fade>
                <Fade in>
                    <Paper className={classes.paper}>
                        <Typography component="h1" variant="h5">
                            Calling {peer.mobileNumber}...
                        </Typography>
                        <Typography variant="caption">ID: {peer._id}</Typography>
                    </Paper>
                </Fade>
                <Typography className={classes.instruction} component="h1" variant="subtitle1">
                    Please allow Video and Audio access when asked...
                </Typography>
                <Fade in>
                    <div className={classes.loading}>
                        <CircularProgress className={classes.progress} />
                        <Typography className={classes.status} component="div" variant="subtitle2">
                            {status.message}
                        </Typography>
                    </div>
                </Fade>
            </div>
        );
    }

    componentDidMount() {
        const { user, peer } = this.props;
        log.debug("request for stream");
        streamService
            .requestStream()
            .then(stream => {
                log.debug("stream successfully received");
                log.debug("initializing peer");
                this.setState(state => ({
                    status: {
                        progress: state.status.progress + 1,
                        message: `Making sure yourself available...`
                    }
                }));
                return peerService.initializeForUser({ user, stream });
            })
            .then(() => {
                socketService.emitInitiatorSignal({ user, signal: peerService.selfSignal, peer });
                log.debug("getting peer user's signal");
                this.setState(state => ({
                    status: {
                        progress: state.status.progress + 1,
                        message: `Making sure "${peer.mobileNumber}" available...`
                    }
                }));
            })
            .then(() => {
                this.setState(state => ({
                    status: {
                        progress: state.status.progress + 1,
                        message: `Ringing "${peer.mobileNumber}"...`
                    }
                }));
            })
            .catch(error => {
                if (error.response && error.response.status === 404) {
                    switch (this.state.status.progress) {
                        case 1: {
                            const errorStatus = {
                                message: error.response.data.message
                            };
                            this.setState({ error: errorStatus });
                            break;
                        }
                        default: {
                            log.warn(`No case defined for progress: ${this.state.status.progress}`);
                            log.debug(this.state.status);
                        }
                    }
                    return;
                }
                log.error("something went wrong while request stream");
                log.error(error);
            });
    }

    getSignalForUser({ userID }) {
        return new Promise((resolve, reject) => {
            const path = `${constants.api.base}${constants.api.signal.get}`;
            const body = { userID };
            return Axios.post(path, body).then(resolve, reject);
        });
    }
}

const mapStateToProps = state => ({
    user: state.user,
    peer: state.peer,
    videoCall: state.videoCall
});

const mapDispatchToProps = {};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(MakeCall));
