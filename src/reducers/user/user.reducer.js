export const UPDATE_USER = "[USER]UPDATE_USER";

export const updateUserInformation = user => ({ type: UPDATE_USER, payload: user });
export const updateUserCallPreference = ({ isCaller }) => ({
    type: UPDATE_USER,
    payload: { isCaller }
});

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
