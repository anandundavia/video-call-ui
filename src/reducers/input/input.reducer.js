import { sanitizeMobileNumber, isMobileNumberValid } from "./input.model";

const MOBILE_NUMBER_INPUT_UPDATED = "[USER_INPUT]MOBILE_NUMBER_UPDATED";
const SUBMIT_BUTTON_INPUT_UPDATED = "[USER_INPUT]SUBMIT_BUTTON_INPUT_UPDATED";
const MOBILE_NUMBER_INPUT_RESET_TOUCHED = "[USER_INPUT]MOBILE_NUMBER_RESET_TOUCHED";
const MOBILE_NUMBER_INPUT_STATUS_UPDATE = "[USER_INPUT]MOBILE_NUMBER_INPUT_STATUS_UPDATE";

export const resetMobileNumberTouched = () => ({
    type: MOBILE_NUMBER_INPUT_RESET_TOUCHED
});

export const updateMobileNumberInput = number => ({
    type: MOBILE_NUMBER_INPUT_UPDATED,
    payload: number
});

export const updateSubmitButton = ({ text, disabled }) => ({
    type: SUBMIT_BUTTON_INPUT_UPDATED,
    payload: { text, disabled }
});

export const disableMobileNumberInput = () => ({
    type: MOBILE_NUMBER_INPUT_STATUS_UPDATE,
    payload: { disabled: true }
});

export const enableMobileNumberInput = () => ({
    type: MOBILE_NUMBER_INPUT_STATUS_UPDATE,
    payload: { disabled: false }
});

export const resetSubmitButton = () => dispatch => {
    dispatch(
        updateSubmitButton({
            disabled: false,
            text: "fill in mobile number"
        })
    );
};

export const resetMobileNumberInput = () => dispatch => {
    dispatch(resetMobileNumberTouched());
    dispatch(updateMobileNumberInput(""));
};

const initialInputState = {
    touched: false,
    mobileNumber: "",
    sanitizedMobileNumber: sanitizeMobileNumber(""),
    isMobileNumberValid: isMobileNumberValid(""),
    submitButtonDisabled: true,
    submitButtonText: "fill in mobile number"
};
export default function userInputReducer(state = initialInputState, action) {
    switch (action.type) {
        case MOBILE_NUMBER_INPUT_UPDATED: {
            const mobileNumber = action.payload;
            const sanitizedMobileNumber = sanitizeMobileNumber(mobileNumber);
            const isValid = isMobileNumberValid(sanitizedMobileNumber);
            return {
                ...state,
                mobileNumber,
                sanitizedMobileNumber,
                isMobileNumberValid: isValid,
                submitButtonDisabled: !isValid,
                submitButtonText: isValid ? "go" : "fill in mobile number",
                touched: true
            };
        }
        case SUBMIT_BUTTON_INPUT_UPDATED: {
            return {
                ...state,
                submitButtonDisabled: action.payload.disabled,
                submitButtonText: action.payload.text
            };
        }
        case MOBILE_NUMBER_INPUT_RESET_TOUCHED: {
            return {
                ...state,
                touched: false,
                disableMobileNumberInput: false
            };
        }
        case MOBILE_NUMBER_INPUT_STATUS_UPDATE: {
            return {
                ...state,
                disableMobileNumberInput: action.payload.disabled
            };
        }
        default:
            return state;
    }
}
