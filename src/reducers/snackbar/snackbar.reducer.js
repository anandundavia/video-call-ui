export const SHOW_SNACKBAR = "[SNACKBAR]SHOW";
export const HIDE_SNACKBAR = "[SNACKBAR]HIDE";

export const showSnackBar = (fileName, message, variant) => ({
    type: SHOW_SNACKBAR,
    payload: { fileName, message, variant }
});

const initialState = {
    show: false,
    fileName: null
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
