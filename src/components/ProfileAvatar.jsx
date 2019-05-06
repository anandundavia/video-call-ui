import React from "react";
import { withStyles } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";

const styles = theme => ({
	dot: {
		position: "relative",
		border: "1px solid green",
		height: 4,
		width: 4,
		top: "-10"
	}
});

const ProfileAvatar = props => (
	<React.Fragment>
		<Avatar {...props} />
		<div className={props.classes.dot} />
	</React.Fragment>
);

export default withStyles(styles)(ProfileAvatar);
