import React from "react";
import { connect } from "react-redux";
import Axios from "axios";
import { withSnackbar } from "notistack";

import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Fade from "@material-ui/core/Fade";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormLabel from "@material-ui/core/FormLabel";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";

import { updateUserCallPreference, updateUserInformation } from "../../reducers/user/user.reducer";

import socketService from "../../services/socket.service";

import constants from "../../constants";
import { hasOnlyNumbers, sanitizeMobileNumber } from "../../utils";
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
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing.unit
    },
    submit: {
        marginTop: theme.spacing.unit * 3
    }
});

class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mobileNumber: {
                value: "",
                error: null,
                errorMessage: null
            },
            callPreference: {
                preference: constants.preferences.caller
            },
            submit: {
                disabled: true,
                text: "fill in mobile number"
            }
        };
    }

    onMobileNumberChanged = e => {
        const { value } = e.target;
        const error = !hasOnlyNumbers(value, { allowSpaces: true });
        const errorMessage = error ? "Only numbers, spaces and '+' are allowed" : null;

        const submitButtonError = error || value.length < constants.minimumMobileNumberLength;
        const submit = {
            disabled: submitButtonError,
            text: submitButtonError ? "fill in mobile number" : "continue"
        };

        const mobileNumber = {
            value,
            error,
            errorMessage
        };

        this.setState({ mobileNumber, submit });
    };

    onCallPreferenceChanged = e => {
        const preference = e.target.value;
        this.setState({ callPreference: { preference } });
    };

    onMobileNumberSubmitted = e => {
        e.preventDefault();

        const submit = {
            disabled: true,
            text: "please wait..."
        };
        this.setState({ submit });

        const mobileNumber = sanitizeMobileNumber(this.state.mobileNumber.value);
        const isCaller = this.state.callPreference.preference === constants.preferences.caller;

        log.debug(`registering user with mobile number "${mobileNumber}"`);
        this.registerUser({ mobileNumber })
            .then(response => {
                log.debug(`user with mobile number "${mobileNumber}" successfully registered`);
                const { updateUserInformation, enqueueSnackbar } = this.props;
                updateUserInformation(response.data);
                const message = response.data.new
                    ? `Successfully Registered ${response.data.mobileNumber}!`
                    : `Welcome Back ${response.data.mobileNumber}!`;
                enqueueSnackbar(message, {
                    variant: response.data.new ? "success" : "info",
                    preventDuplicate: true
                });
                log.debug(`updating user preference to "${isCaller ? "caller" : "callee"}"`);
            })
            .then(() => {
                log.debug("updating user preference successfully updated");
                const submit = {
                    disabled: false,
                    text: "All Done"
                };
                this.setState({ submit });
                const { updateUserCallPreference } = this.props;
                updateUserCallPreference({ isCaller });
                socketService.init();
            })
            .then(() => {
                if (isCaller) {
                    this.props.history.push("/make-call");
                } else {
                    this.props.history.push("/wait-for-call");
                }
            })
            .catch(e => {
                log.error("something went wrong while registering the user");
                log.error(e);
            });
    };

    registerUser = ({ mobileNumber }) =>
        new Promise((resolve, reject) => {
            const path = `${constants.api.base}${constants.api.user.register}`;
            const body = { mobileNumber };
            return Axios.post(path, body).then(resolve, reject);
        });

    render() {
        const { classes } = this.props;
        const { mobileNumber, callPreference, submit } = this.state;
        return (
            <div className={classes.main}>
                <Fade in>
                    <Paper className={classes.paper}>
                        <Typography component="h1" variant="h5">
                            Register Yourself
                        </Typography>
                        <form className={classes.form}>
                            <FormControl margin="normal" required fullWidth>
                                <InputLabel htmlFor="mobileNumber">Mobile Number</InputLabel>
                                <Input
                                    name="mobileNumber"
                                    autoComplete="tel"
                                    placeholder="+91 1122 333 444"
                                    autoFocus
                                    required
                                    value={mobileNumber.value}
                                    error={mobileNumber.error}
                                    onChange={this.onMobileNumberChanged}
                                    type="tel"
                                />
                                {mobileNumber.error && (
                                    <FormHelperText error>
                                        {mobileNumber.errorMessage}
                                    </FormHelperText>
                                )}
                            </FormControl>
                            <FormControl margin="normal" fullWidth>
                                <FormLabel component="legend">I would like to</FormLabel>
                                <RadioGroup
                                    row
                                    name="callPreference"
                                    value={callPreference.preference}
                                    onChange={this.onCallPreferenceChanged}
                                >
                                    <FormControlLabel
                                        value={constants.preferences.caller}
                                        control={<Radio />}
                                        label="Make a Call"
                                    />
                                    <FormControlLabel
                                        value={constants.preferences.callee}
                                        control={<Radio />}
                                        label="Receive a Call"
                                    />
                                </RadioGroup>
                            </FormControl>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                disabled={submit.disabled}
                                onClick={this.onMobileNumberSubmitted}
                            >
                                {submit.text}
                            </Button>
                        </form>
                    </Paper>
                </Fade>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    snackbar: state.snackbar,
    user: state.user
});

const mapDispatchToProps = {
    updateUserInformation,
    updateUserCallPreference
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withSnackbar(withStyles(styles)(Registration)));
