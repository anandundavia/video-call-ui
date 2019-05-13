import React from "react";
import { connect } from "react-redux";
import { withSnackbar } from "notistack";
import Axios from "axios";

import withStyles from "@material-ui/core/styles/withStyles";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Fade from "@material-ui/core/Fade";
import FormHelperText from "@material-ui/core/FormHelperText";
import Modal from "@material-ui/core/Modal";
import LinearProgress from "@material-ui/core/LinearProgress";

import { isValidEmailAddress, isGmailAddress } from "../../utils";
import constants from "../../constants";
import socketService from "../../services/socket.service";

import { incomingCallAnswered } from "../../reducers/call/call.reducer";
import { toggleResetCalleeForm } from "../../reducers/ui/ui.reducer";

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
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing.unit
	},
	submit: {
		marginTop: theme.spacing.unit * 3
	},
	avatar: {
		margin: 10,
		width: 60,
		height: 60
	},
	modal: {
		position: "absolute",
		width: theme.spacing.unit * 50,
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		padding: theme.spacing.unit * 4,
		outline: "none"
	},
	modalHeader: {
		textAlign: "center"
	},
	modalBody: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center"
	},
	incomingCallButtonsContainer: {
		display: "flex",
		flexDirection: "row",
		marginTop: theme.spacing.unit * 3
	},
	incomingCallButtons: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit
	},
	modalProgress: {
		marginTop: theme.spacing.unit * 3,
		textAlign: "center"
	}
});

class MakeCall extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			emailAddress: {
				disabled: false,
				value: "",
				error: null,
				message: null
			},
			submit: {
				disabled: true,
				text: "fill the email address"
			},
			timer: {
				timeout: 30000, // 30 seconds to milliseconds
				remaining: 100,
				started: false
			}
		};
	}

	updateEmailAddress = props => {
		this.setState({ emailAddress: { ...props } });
	};

	updateSubmitButton = props => {
		this.setState({ submit: { ...props } });
	};

	onEmailAddressChanged = e => {
		const value = e.target.value.trim();

		let error = !isValidEmailAddress(value);
		let message = error ? "Enter a valid email address" : null;

		error = !isGmailAddress(value);
		message = error ? "Only gmail addresses are supported" : null;

		const { auth } = this.props;

		if (value === auth.email) {
			error = true;
			message = "Can not be the same email as yours";
		}

		const emailAddress = {
			value,
			error,
			message
		};

		this.updateEmailAddress(emailAddress);

		const submitButtonError = error;
		const submit = {
			disabled: submitButtonError,
			text: submitButtonError ? "fill in email address" : "call"
		};

		this.updateSubmitButton(submit);
	};

	getUserStatus = ({ emailAddress }) =>
		new Promise((resolve, reject) => {
			// prettier-ignore
			const path = `${constants.api.base}${constants.api.user.status}?email=${encodeURIComponent(emailAddress)}`;
			return Axios.get(path).then(resolve, reject);
		});

	onEmailAddressSubmitted = async e => {
		e.preventDefault();
		this.updateSubmitButton({ disabled: true, text: "finding..." });
		const emailAddress = this.state.emailAddress.value;
		log.debug(`Getting status user with email "${emailAddress}"`);
		try {
			const response = await this.getUserStatus({ emailAddress });
			const { status } = response.data;
			log.debug(`Status of user with email "${emailAddress}" is "${status}"`);
			switch (status) {
				case constants.status.LOGGED_IN: {
					this.updateEmailAddress({
						disabled: true,
						error: false,
						message: `Waiting for ${emailAddress} to accept...`
					});
					socketService.sendPrompt({ to: emailAddress });
					this.updateSubmitButton({ disabled: true, text: "Ringing..." });
					break;
				}
				case null:
				case constants.status.UNAVAILABLE: {
					const emailAddress = {
						error: true,
						message: `${this.state.emailAddress.value} is not available.`
					};
					this.updateEmailAddress(emailAddress);
					this.updateSubmitButton({ disabled: false, text: "fill the email address" });
					break;
				}
				default: {
					const emailAddress = {
						error: true,
						message: `${this.state.emailAddress.value} is busy in some other call`
					};
					this.updateEmailAddress(emailAddress);
					this.updateSubmitButton({ disabled: false, text: "fill the email address" });
				}
			}
		} catch (error) {
			// prettier-ignore
			log.error(`Something went wrong while getting status of use with email "${emailAddress}"`)
			log.error(error);
		}
	};

	onIncomingCallHandled = accepted => {
		const { call, incomingCallAnswered, history } = this.props;
		const { caller } = call;
		socketService.sendIncomingCallAnswer({ accepted, from: caller.from });
		incomingCallAnswered();
		log.debug(`resetting the timer`);
		this.setState({
			timer: {
				timeout: 30000,
				remaining: 100,
				started: false
			}
		});
		history.replace("/ongoing-call");
	};

	onIncomingCallAccepted = () => {
		this.onIncomingCallHandled(true);
	};

	onIncomingCallRejected = () => {
		this.onIncomingCallHandled(false);
	};

	_startModalTimer = () => {
		const { timer } = this.state;
		if (timer.started) {
			return;
		}
		const tick = timer.timeout / 100;
		log.debug(`starting the modal timer`);
		const interval = setInterval(() => {
			if (this.state.timer.remaining <= 0) {
				log.debug(`stopping the modal timer`);
				clearInterval(interval);
				this.onIncomingCallRejected();
			} else {
				this.setState(state => ({
					timer: { timeout: 30000, started: true, remaining: state.timer.remaining - 1 }
				}));
			}
		}, tick);
	};

	__getRemainingTimeInSeconds = () => {
		const { timer } = this.state;
		const remaining = (timer.timeout * timer.remaining) / (1000 * 100);
		return remaining.toFixed(0);
	};

	getIncomingCallModal = () => {
		const { classes, call } = this.props;
		if (!call.incomingCall) {
			return null;
		}
		this._startModalTimer();
		const { timer } = this.state;
		const { caller } = call;
		const style = {
			top: "50%",
			left: "50%",
			transform: `translate(-50%, -50%)`
		};
		return (
			<Modal open={call.incomingCall}>
				<div style={style} className={classes.modal}>
					<Typography className={classes.modalHeader} variant="h6" id="modal-title">
						Incoming Call
					</Typography>
					<div className={classes.modalBody}>
						<Avatar
							alt={caller.displayName}
							src={caller.photoURL}
							className={classes.avatar}
						/>
						<Typography variant="subtitle1">
							{caller.displayName} is calling you...
						</Typography>
						<div className={classes.incomingCallButtonsContainer}>
							<Button
								variant="contained"
								color="primary"
								className={classes.incomingCallButtons}
								onClick={this.onIncomingCallAccepted}
							>
								Accept
							</Button>
							<Button
								color="primary"
								onClick={this.onIncomingCallRejected}
								className={classes.incomingCallButtons}
							>
								Decline
							</Button>
						</div>
					</div>
					<div className={classes.modalProgress}>
						<Typography variant="caption">
							Auto decline in {this.__getRemainingTimeInSeconds()}s...
						</Typography>
						<LinearProgress variant="buffer" value={0} valueBuffer={timer.remaining} />
					</div>
				</div>
			</Modal>
		);
	};

	componentDidUpdate() {
		const { ui, history, toggleResetCalleeForm, enqueueSnackbar, call } = this.props;
		if (ui.resetCalleeForm) {
			enqueueSnackbar(`You call was declined`);
			history.replace("/registration");
			toggleResetCalleeForm(false);
		}
		const { callee } = call;
		const { from, accepted } = callee;
		if (from && accepted) {
			history.replace("/ongoing-call");
		}
	}

	render() {
		const { classes, auth } = this.props;
		const { emailAddress, submit } = this.state;
		return (
			<div className={classes.main}>
				{this.getIncomingCallModal()}
				<Fade in>
					<Paper className={classes.paper}>
						<Avatar
							alt={auth.displayName}
							src={auth.photoURL}
							className={classes.avatar}
						/>
						<Typography component="h1" variant="h5">
							Hello, {auth.displayName}!
						</Typography>
						<Typography variant="caption">ID: {auth.uid}</Typography>
						<Typography variant="caption">EMAIL: {auth.email}</Typography>
					</Paper>
				</Fade>
				<Fade in>
					<Paper className={classes.paper}>
						<Typography component="h1" variant="h5">
							Whom do you want to call?
						</Typography>
						<form className={classes.form}>
							<FormControl margin="normal" required fullWidth>
								<InputLabel htmlFor="emailAddress">Email Address</InputLabel>
								<Input
									name="emailAddress"
									autoComplete="email"
									placeholder="someone@gmail.com"
									autoFocus
									required
									disabled={emailAddress.disabled}
									value={emailAddress.value}
									error={emailAddress.error}
									onChange={this.onEmailAddressChanged}
									type="email"
								/>
								{emailAddress.message && (
									<FormHelperText error={emailAddress.error}>
										{emailAddress.message}
									</FormHelperText>
								)}
							</FormControl>

							<Button
								type="submit"
								fullWidth
								variant="contained"
								color="primary"
								className={classes.submit}
								disabled={submit.disabled}
								onClick={this.onEmailAddressSubmitted}
							>
								{submit.text}
							</Button>
						</form>
					</Paper>
				</Fade>
			</div>
		);
	}

	async componentDidMount() {
		socketService.init();
	}
}

const mapStateToProps = state => {
	return {
		user: state.user,
		auth: state.auth,
		call: state.call,
		ui: state.ui
	};
};

const mapDispatchToProps = {
	incomingCallAnswered,
	toggleResetCalleeForm
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withSnackbar(withStyles(styles)(MakeCall)));
