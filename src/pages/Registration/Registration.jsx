import React from "react";
import { connect } from "react-redux";
import { withSnackbar } from "notistack";

import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Fade from "@material-ui/core/Fade";
import CircularProgress from "@material-ui/core/CircularProgress";

import firebase from "../../config/firebase-config";

import { loginSuccessful } from "../../reducers/auth/auth.reducer";

import logger from "../../utils/logger";
const log = logger("registration");

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
			},
			loading: true
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
			this.props.loginSuccessful(result.user);
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

	renderProgress() {
		const { loading } = this.state;
		if (loading) {
			return <CircularProgress />;
		}
	}

	renderLoginForm() {
		const { classes } = this.props;
		const { loginButton, loading } = this.state;
		if (loading) {
			return;
		}
		return (
			<React.Fragment>
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
			</React.Fragment>
		);
	}

	render() {
		const { classes } = this.props;

		return (
			<div className={classes.main}>
				<Fade in>
					<Paper className={classes.paper}>
						{this.renderProgress()}
						{this.renderLoginForm()}
					</Paper>
				</Fade>
			</div>
		);
	}

	componentDidMount() {
		firebase.auth().onAuthStateChanged(user => {
			if (user) {
				this.props.loginSuccessful(user);
				this.props.history.push("/make-call");
			} else {
				this.setState({ loading: false });
			}
		});
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
