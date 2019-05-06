export const LOGIN_SUCCESSFUL = "LOGIN_SUCCESSFUL";

export const loginSuccessful = payload => ({
	type: LOGIN_SUCCESSFUL,
	payload
});

const initialState = {};

export default function(state = initialState, action) {
	switch (action.type) {
		case LOGIN_SUCCESSFUL: {
			return {
				...state,
				...action.payload
			};
		}
		default: {
			return state;
		}
	}
}
