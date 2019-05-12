import React from "react";
import { connect } from "react-redux";

import withStyles from "@material-ui/core/styles/withStyles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import CallEnd from "@material-ui/icons/CallEnd";
import IconButton from "@material-ui/core/IconButton";

const styles = theme => ({
	main: {
		height: "100vh",
		width: "70vw",
		display: "block", // Fix IE 11 issue.
		marginLeft: theme.spacing.unit * 3,
		marginRight: theme.spacing.unit * 3,
		[theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
			// width: 400,
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
	}
});

class OngoingCall extends React.Component {
	render() {
		// sizing.
		const { classes, call } = this.props;
		const { callee } = call;
		return (
			<div className={classes.main}>
				<Typography className={classes.title} variant="subtitle1">
					On going call with {callee.from}
				</Typography>
				<Paper className={classes.videoPaper}>
					<video width="100%" autoPlay>
						<source
							src="https://www.quirksmode.org/html5/videos/big_buck_bunny.mp4"
							type="video/mp4"
						/>
						<p>Your browser does not support H.264/MP4.</p>
					</video>
				</Paper>
				<div className={classes.actions}>
					<IconButton>
						<CallEnd />
					</IconButton>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({ call: state.call });
const mapDispatchToProps = {};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withStyles(styles)(OngoingCall));
