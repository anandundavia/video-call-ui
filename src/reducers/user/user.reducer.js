import axios from "axios";
import { push } from "connected-react-router";

import constants from "../../constants";
// import { isResponseGood } from "../../utils";

import { updateSubmitButton, resetSubmitButton } from "../input/input.reducer";

const UPDATE_USER = "[USER]UPDATE_USER";

export const saveMobileNumber = number => dispatch => {
    dispatch(updateSubmitButton({ text: "please wait...", disabled: true }));

    const path = `${constants.api.base}${constants.api.user.register}`;
    const body = { mobileNumber: number };
    axios
        .post(path, body)
        .then(response => {
            dispatch(resetSubmitButton());
            dispatch({ type: UPDATE_USER, payload: response.data });
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
            return { ...action.payload };
        }
        default:
            return state;
    }
}
