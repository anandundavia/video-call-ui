import React from "react";
import { connect } from "react-redux";
import { withSnackbar } from "notistack";

import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Fade from "@material-ui/core/Fade";

import TableRow from "@material-ui/core/TableRow";

import firebase from "../../config/firebase-config";

import { loginSuccessful } from "../../reducers/auth/auth.reducer";

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
		// prettier-ignore
		padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`
	},
	submit: {
		marginTop: theme.spacing.unit * 3
	},
	googleLogo: {
		marginRight: theme.spacing.unit
	}
});

class Registration extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loginButton: {
				disabled: false,
				text: "Login with Google"
			}
		};
	}

	updateLoginButton = buttonStatus => {
		this.setState({ loginButton: buttonStatus });
	};

	initiateLoginWithGoogle = async () => {
		this.updateLoginButton({ disabled: true, text: "Please Wait..." });
		log.debug("Initiating login with Google");
		const provider = new firebase.auth.GoogleAuthProvider();
		try {
			const result = await firebase.auth().signInWithPopup(provider);
			this.updateLoginButton({ disabled: false, text: "Login with Google" });
			log.debug("Login with Google successful");
			this.props.loginSuccessful(result);
			this.props.history.push("/make-call");
		} catch (error) {
			this.updateLoginButton({ disabled: false, text: "Login with Google" });
			// TODO: Handle this?
			log.error("Login with Google failed");
			log.error(error);
			// Handle Errors here.
			// var errorCode = error.code;
			// var errorMessage = error.message;
			// // The email of the user's account used.
			// var email = error.email;
			// // The firebase.auth.AuthCredential type that was used.
			// var credential = error.credential;
		}
	};

	render() {
		const { classes } = this.props;
		const { loginButton } = this.state;
		return (
			<div className={classes.main}>
				<Fade in>
					<Paper className={classes.paper}>
						<Typography component="h1" variant="h5">
							Identify Yourself
						</Typography>
						<Button
							fullWidth
							variant="outlined"
							color="primary"
							className={classes.submit}
							disabled={loginButton.disabled}
							onClick={this.initiateLoginWithGoogle}
						>
							<img
								className={classes.googleLogo}
								width="20px"
								alt='Google "G" Logo'
								src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
							/>
							{loginButton.text}
						</Button>
					</Paper>
				</Fade>
			</div>
		);
	}

	componentDidMount() {
		if (firebase.auth().currentUser) {
			log.debug("User is already logged in. redirecting...");
			this.props.history.push("/make-call");
		}
	}
}

const mapStateToProps = state => ({
	snackbar: state.snackbar,
	user: state.user
});

const mapDispatchToProps = {
	loginSuccessful
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withSnackbar(withStyles(styles)(Registration)));
