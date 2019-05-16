import React from "react";
import { connect } from "react-redux";

import withStyles from "@material-ui/core/styles/withStyles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import CallEnd from "@material-ui/icons/CallEnd";
import IconButton from "@material-ui/core/IconButton";
import LinearProgress from "@material-ui/core/LinearProgress";

import peerService from "../../services/peer.service";

import logger from "../../utils/logger";
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
		display: "flex",
		flexDirection: "column",
		alignItems: "center"
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
				<Paper className={classes.videoPaper}>
					<video width="100%" autoPlay ref={x => (this.videoElement = x)} />
				</Paper>
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
		});
		peerService.init();
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
