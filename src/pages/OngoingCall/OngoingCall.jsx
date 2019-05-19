import React from "react";
import { connect } from "react-redux";

import withStyles from "@material-ui/core/styles/withStyles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import CallEnd from "@material-ui/icons/CallEnd";
import IconButton from "@material-ui/core/IconButton";
import LinearProgress from "@material-ui/core/LinearProgress";

import peerService from "../../services/peer.service";
import streamService from "../../services/stream.service";

// import { getLargerDimension } from "../../utils";

import logger from "../../utils/logger";
import { getSmallerDimension } from "../../utils";
const log = logger("ongoing-call");

const styles = theme => ({
	main: {
		width: "70vw",
		display: "block", // Fix IE 11 issue.
		marginLeft: theme.spacing.unit * 3,
		marginRight: theme.spacing.unit * 3,
		[theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
			marginLeft: "auto",
			marginRight: "auto"
		}
	},
	title: {
		marginTop: theme.spacing.unit * 8,
		textAlign: "center"
	},
	videoPaper: {
		marginTop: theme.spacing.unit * 2,
		position: "relative",
		height: window.innerHeight / 1.5,
		width: window.innerWidth / 1.5,
		display: "flex",
		justifyContent: "center"
	},
	actions: {
		marginTop: theme.spacing.unit * 2,
		display: "flex",
		justifyContent: "center"
	},
	loadingPaper: {
		marginTop: theme.spacing.unit * 2,
		display: "flex",
		flexDirection: "column"
	},
	loading: {
		margin: theme.spacing.unit * 4
	},
	remoteVideo: {
		position: "absolute",
		height: window.innerHeight / 1.5,
		width: window.innerWidth / 1.5,
		left: "auto",
		right: "auto"
	},
	selfVideo: {
		position: "absolute",
		height: `20v${getSmallerDimension().name.charAt(0)}`,
		width: `20v${getSmallerDimension().name.charAt(0)}`,
		bottom: 0,
		left: 0,
		borderRadius: "4px"
	}
});

class OngoingCall extends React.Component {
	endCall = () => {
		window.location.href = "/";
	};

	render() {
		const { classes, call, ui } = this.props;
		const { callee, caller } = call;
		if (ui.showLoadingBar) {
			return (
				<div className={classes.main}>
					<Typography className={classes.title} variant="subtitle1">
						Please wait, you are being connected...
					</Typography>
					<Paper className={classes.loadingPaper}>
						<LinearProgress className={classes.loading} />
					</Paper>
				</div>
			);
		}
		return (
			<div className={classes.main}>
				<Typography className={classes.title} variant="subtitle1">
					On going call with {callee.displayName || caller.displayName}
				</Typography>
				<div className={classes.videoPaper}>
					<video
						className={classes.remoteVideo}
						autoPlay
						ref={x => (this.videoElement = x)}
					/>
					<video
						className={classes.selfVideo}
						ref={x => (this.selfVideoElement = x)}
						autoPlay
					/>
				</div>
				<div className={classes.actions}>
					<IconButton onClick={this.endCall}>
						<CallEnd />
					</IconButton>
				</div>
			</div>
		);
	}
	componentDidMount() {
		peerService.subscribe(peerService.events.STREAM_RECEIVED, stream => {
			this._attachStreamToElement(stream, this.videoElement);
			this._setSelfVideo();
		});
		peerService.init();
	}

	async _setSelfVideo() {
		try {
			const selfStream = await streamService.requestStream({ video: true, audio: false });
			this._attachStreamToElement(selfStream, this.selfVideoElement);
		} catch (e) {
			log.warn("Something went wrong while setting the self video");
			log.warn(e);
		}
	}

	_attachStreamToElement(stream, el) {
		try {
			const srcObject = stream;
			el.srcObject = srcObject;
		} catch (error) {
			log.warn(`Using old URL.createObjectURL method`);
			log.warn(error);
			const src = window.URL.createObjectURL(stream);
			el.selfVideoElement.src = src;
		}
	}
}

const mapStateToProps = state => ({ call: state.call, ui: state.ui });
const mapDispatchToProps = {};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withStyles(styles)(OngoingCall));
