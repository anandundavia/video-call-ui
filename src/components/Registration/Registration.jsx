import React from "react";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";

import Button from "@material-ui/core/Button";

import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import { updateMobileNumberInput } from "../../reducers/input/input.reducer";
import { saveMobileNumber } from "../../reducers/user/user.reducer";

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
    }
});

const Registration = ({ classes, updateMobileNumberInput, saveMobileNumber, input }) => {
    const submitMobileNumber = _ => {
        saveMobileNumber(input.mobileNumber.sanitizedValue);
    };

    const onMobileNumberChanged = e => {
        updateMobileNumberInput(e.target.value);
    };
    return (
        <div className={classes.main}>
            <Paper className={classes.paper}>
                <Typography component="h1" variant="h5">
                    Register Yourself
                </Typography>
                <form className={classes.form}>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="phoneNumber">Phone Number</InputLabel>
                        <Input
                            name="phoneNumber"
                            autoComplete="tel"
                            placeholder="+91 1122 333 444"
                            autoFocus
                            required
                            value={input.mobileNumber.value}
                            error={input.mobileNumber.error}
                            onChange={onMobileNumberChanged}
                            type="tel"
                        />
                    </FormControl>

                    <Button
                        type="button"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        disabled={input.submit.disabled}
                        onClick={submitMobileNumber}
                    >
                        {input.submit.text}
                    </Button>
                </form>
            </Paper>
        </div>
    );
};

const mapStateToProps = state => {
    return {
        input: {
            mobileNumber: {
                value: state.input.mobileNumber,
                sanitizedValue: state.input.sanitizedMobileNumber,
                error: state.input.touched && !state.input.isMobileNumberValid
            },
            submit: {
                disabled: state.input.submitButtonDisabled,
                text: state.input.submitButtonText
            }
        }
    };
};

const mapDispatchToProps = {
    updateMobileNumberInput,
    saveMobileNumber
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(Registration));
