import React from "react";

import withStyles from "@material-ui/core/styles/withStyles";

import peerService from "../../services/peer.service";
import steamService from "../../services/stream.service";
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
    }
});

class LiveCall extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shouldStream: false
        };
    }

    getVideo() {
        return (
            <video id="video" controls>
                <source id="video-source" />
                Sorry, your browser doesn't support embedded videos.
            </video>
        );
    }

    render() {
        return <div className={this.props.classes.main}>{this.getVideo()}</div>;
    }
    componentDidMount() {
        const peer = peerService.get();
        if (peer) {
            log.debug("requesting steam");
            steamService
                .requestStream()
                .then(stream => {
                    log.debug("steam received");
                    const callee = peerService.getCallee();
                    const call = peer.call(callee.peerID, stream);
                    call.on("stream", remoteStream => {
                        peerService.remoteStream = remoteStream;
                        const elem = document.getElementById("video-source");
                        elem.setAttribute("src", URL.createObjectURL(remoteStream));
                        this.setState({ shouldStream: true });
                        log.info("call connected!");
                    });
                })
                .catch(error => {
                    log.error(error);
                });
        } else {
            log.error(`peer is falsy`);
            log.error(peer);
        }
    }
}

export default withStyles(styles)(LiveCall);
