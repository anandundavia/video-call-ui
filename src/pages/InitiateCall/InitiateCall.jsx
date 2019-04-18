import React from "react";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";

import Button from "@material-ui/core/Button";

import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Fade from "@material-ui/core/Fade";
import FormHelperText from "@material-ui/core/FormHelperText";

import { updateMobileNumberInput } from "../../reducers/input/input.reducer";
import { peerMobileNumberSubmitted } from "../../reducers/user/user.reducer";

import logger from "../../utils/logger";
const log = logger(__filename);

const styles = theme => ({
    main: {
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
    avatar: {
        margin: theme.spacing.unit,
        backgroundColor: theme.palette.secondary.main
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing.unit
    },
    submit: {
        marginTop: theme.spacing.unit * 3
    },
    info: {
        marginTop: theme.spacing.unit,
        marginLeft: "auto",
        marginRight: "auto"
    }
});

class InitiateCall extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false
        };
    }

    submitMobileNumber = _ => {
        const { input, user, peerMobileNumberSubmitted } = this.props;
        if (input.mobileNumber.sanitizedValue === user.mobileNumber) {
            this.setState({ error: true, labelText: "Can not call self" });
        } else {
            peerMobileNumberSubmitted(input.mobileNumber.sanitizedValue);
        }
    };

    onMobileNumberChanged = e => {
        const { updateMobileNumberInput } = this.props;
        updateMobileNumberInput(e.target.value);
    };

    render() {
        const { classes, user, input } = this.props;
        const labelText = this.state.labelText || "";
        return (
            <div className={classes.main}>
                <Fade in>
                    <Paper className={classes.paper}>
                        <Typography component="h1" variant="h5">
                            Hi There!
                        </Typography>
                        <div className={classes.info}>
                            <Typography component="h1" variant="subheading">
                                Mobile Number: {user.mobileNumber}
                            </Typography>
                            <Typography component="h1" variant="caption">
                                PeerID: {user.peerID}
                            </Typography>
                        </div>
                    </Paper>
                </Fade>
                <Fade in>
                    <Paper className={classes.paper}>
                        <Typography component="h1" variant="h5">
                            Whom Do You Want To Call?
                        </Typography>
                        <form className={classes.form}>
                            <FormControl margin="normal" required fullWidth>
                                <InputLabel htmlFor="phoneNumber">Phone Number of peer</InputLabel>
                                <Input
                                    name="phoneNumber"
                                    autoComplete="tel"
                                    placeholder="+91 1122 333 444"
                                    autoFocus
                                    required
                                    disabled={input.mobileNumber.disabled}
                                    value={input.mobileNumber.value}
                                    error={this.state.error || input.mobileNumber.error}
                                    onChange={this.onMobileNumberChanged}
                                    type="tel"
                                />
                                <FormHelperText error={this.state.error}>
                                    {labelText}
                                </FormHelperText>
                            </FormControl>

                            <Button
                                type="button"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                disabled={input.submit.disabled}
                                onClick={this.submitMobileNumber}
                            >
                                {input.submit.text}
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
        input: {
            mobileNumber: {
                value: state.input.mobileNumber,
                sanitizedValue: state.input.sanitizedMobileNumber,
                error: state.input.touched && !state.input.isMobileNumberValid,
                disabled: state.input.disableMobileNumberInput
            },
            submit: {
                disabled: state.input.submitButtonDisabled,
                text: state.input.submitButtonText
            }
        },
        user: state.user,
        peer: state.peer
    };
};

const mapDispatchToProps = {
    updateMobileNumberInput,
    peerMobileNumberSubmitted
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(InitiateCall));
