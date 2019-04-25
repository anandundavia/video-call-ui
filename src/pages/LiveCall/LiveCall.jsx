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
        if (peerService.videoStream) {
            return (
                <video id="video">
                    <source id="video-source" />
                    Sorry, your browser doesn't support embedded videos.
                </video>
            );
        }
        console.warn("no peerService.videStream");
        return null;
    }

    render() {
        return <div className={this.props.classes.main}>{this.getVideo()}</div>;
    }
    componentDidMount() {
        setTimeout(() => {
            console.log("playing");
            const video = document.getElementById("video");
            video.srcObject = peerService.videoStream;
            video.play();
        }, 1000);
    }
}

export default withStyles(styles)(LiveCall);
