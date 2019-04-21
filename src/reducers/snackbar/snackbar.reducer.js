export const SHOW_SNACKBAR = "[SNACKBAR]SHOW";
export const HIDE_SNACKBAR = "[SNACKBAR]HIDE";

export const showSnackBar = (message, variant) => ({
    type: SHOW_SNACKBAR,
    payload: { message, variant }
});

const initialState = {
    show: false
};

export default function(state = initialState, action) {
    switch (action.type) {
        case SHOW_SNACKBAR: {
            return {
                ...state,
                show: true,
                ...action.payload
            };
        }
        default:
            return state;
    }
}
