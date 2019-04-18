import { sanitizeMobileNumber, isMobileNumberValid } from "./input.model";

const MOBILE_NUMBER_INPUT_UPDATED = "[USER_INPUT]MOBILE_NUMBER_UPDATED";
const SUBMIT_BUTTON_INPUT_UPDATED = "[USER_INPUT]SUBMIT_BUTTON_INPUT_UPDATED";

export const updateMobileNumberInput = number => ({
    type: MOBILE_NUMBER_INPUT_UPDATED,
    payload: number
});

export const updateSubmitButton = ({ text, disabled }) => ({
    type: SUBMIT_BUTTON_INPUT_UPDATED,
    payload: { text, disabled }
});

export const resetSubmitButton = () => dispatch => {
    dispatch(
        updateSubmitButton({
            disabled: false,
            text: "fill in mobile number"
        })
    );
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
        default:
            return state;
    }
}
