import axios from "axios";
import { push } from "connected-react-router";

import constants from "../../constants";
import peerService from "../../services/peer.service";

import {
    updateSubmitButton,
    resetSubmitButton,
    resetMobileNumberInput
} from "../input/input.reducer";
import { showSnackBar } from "../snackbar/snackbar.reducer";
import { setPeer } from "../peer/peer.reducer";
import { sanitizeMobileNumber } from "../input/input.model";

export const UPDATE_USER = "[USER]UPDATE_USER";

export const updateUserInformation = user => ({ type: UPDATE_USER, payload: user });
export const updateUserCallPreference = ({ isCaller }) => ({
    type: UPDATE_USER,
    payload: { isCaller }
});

export const peerMobileNumberSubmitted = number => dispatch => {
    dispatch(findUserByMobileNumber(number));
};

export const findUserByMobileNumber = number => dispatch => {
    dispatch(updateSubmitButton({ text: "finding...", disabled: true }));
    const path = `${constants.api.base}${constants.api.user.get}`;
    const body = { mobileNumber: number };
    axios
        .post(path, body)
        .then(response => {
            dispatch(resetSubmitButton());
            dispatch(resetMobileNumberInput());
            dispatch(setPeer(response.data));
            peerService.setCallee(response.data);
            dispatch(push("/live-call"));
        })
        .catch(error => {
            dispatch(resetSubmitButton());
            console.log(error);
        });
};

export const updateUserPreferences = ({ mobileNumber, isCaller }) => dispatch => {
    dispatch(updateSubmitButton({ text: "please wait...", disabled: true }));

    const sanitizedMobileNumber = sanitizeMobileNumber(mobileNumber);
    const path = `${constants.api.base}${constants.api.user.register}`;
    const body = { mobileNumber: sanitizedMobileNumber };
    axios
        .post(path, body)
        .then(response => {
            dispatch(resetSubmitButton());
            dispatch(resetMobileNumberInput());
            dispatch({ type: UPDATE_USER, payload: response.data });
            if (response.data.new) {
                dispatch(
                    showSnackBar(
                        __filename,
                        `Successfully Registered ${response.data.mobileNumber} !`,
                        "success"
                    )
                );
            } else {
                dispatch(
                    showSnackBar(__filename, `Welcome back ${response.data.mobileNumber} !`, "info")
                );
            }
            peerService.init(response.data);
            dispatch(push("/initiate-call"));
        })
        .catch(error => {
            dispatch(resetSubmitButton());
            console.log(error);
        });
};

const initialInputState = {
    mobileNumber: ""
};

export default function(state = initialInputState, action) {
    switch (action.type) {
        case UPDATE_USER: {
            return { ...state, ...action.payload };
        }
        default:
            return state;
    }
}
