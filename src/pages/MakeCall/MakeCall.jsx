import React from "react";
import { connect } from "react-redux";
import Axios from "axios";

import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Fade from "@material-ui/core/Fade";
import FormHelperText from "@material-ui/core/FormHelperText";

import { updatePeerInformation } from "../../reducers/peer/peer.reducer";

import { hasOnlyNumbers, sanitizeMobileNumber } from "../../utils";
import constants from "../../constants";

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

class MakeCall extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mobileNumber: {
                value: "",
                error: null,
                errorMessage: null
            },
            submit: {
                disabled: true,
                text: "fill in mobile number"
            }
        };
    }

    onMobileNumberChanged = e => {
        const { value } = e.target;
        let error = !hasOnlyNumbers(value, { allowSpaces: true });
        let errorMessage = error ? "Only numbers, spaces and '+' are allowed" : null;

        const { user } = this.props;
        if (sanitizeMobileNumber(value) === user.mobileNumber) {
            error = true;
            errorMessage = "Can not call self";
        }

        const submitButtonError = error || value.length < constants.minimumMobileNumberLength;
        const submit = {
            disabled: submitButtonError,
            text: submitButtonError ? "fill in mobile number" : "call"
        };

        const mobileNumber = {
            value,
            error,
            errorMessage
        };

        this.setState({ mobileNumber, submit });
    };

    onMobileNumberSubmitted = e => {
        e.preventDefault();
        const submit = {
            disabled: true,
            text: "finding..."
        };
        this.setState({ submit });

        const mobileNumber = sanitizeMobileNumber(this.state.mobileNumber.value);

        log.debug(`finding user with mobile number "${mobileNumber}"`);
        this.findUserWithMobileNumber({ mobileNumber })
            .then(response => {
                log.debug(`user with mobile number "${mobileNumber}" successfully found`);
                const { setPeer, history } = this.props;
                setPeer(response.data);
                history.push("/initialize-call");
            })
            .catch(error => {
                if (error.response && error.response.status === 404) {
                    const submit = {
                        disabled: false,
                        text: "fill in mobile number..."
                    };
                    const mobileNumberState = {
                        value: "",
                        error: true,
                        errorMessage: `No user with mobile number "${mobileNumber}" exists.`
                    };
                    log.debug(`user with mobile number "${mobileNumber}" not found`);
                    return this.setState({ submit, mobileNumber: mobileNumberState });
                }
                log.error(`error while finding user with mobile number "${mobileNumber}"`);
                log.error(error);
            });
    };

    findUserWithMobileNumber = ({ mobileNumber }) =>
        new Promise((resolve, reject) => {
            const path = `${constants.api.base}${constants.api.user.get}`;
            const body = { mobileNumber };
            return Axios.post(path, body).then(resolve, reject);
        });

    render() {
        const { classes, user } = this.props;
        const { mobileNumber, submit } = this.state;
        return (
            <div className={classes.main}>
                <Fade in>
                    <Paper className={classes.paper}>
                        <Typography component="h1" variant="h5">
                            Hi {user.mobileNumber}!
                        </Typography>
                        <Typography variant="caption">ID: {user._id}</Typography>
                    </Paper>
                </Fade>
                <Fade in>
                    <Paper className={classes.paper}>
                        <Typography component="h1" variant="h5">
                            Whom Do You Want To Call?
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

const mapStateToProps = state => {
    return {
        user: state.user
    };
};

const mapDispatchToProps = {
    setPeer: updatePeerInformation
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(MakeCall));
