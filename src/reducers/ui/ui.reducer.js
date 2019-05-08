export const RESET_CALLEE_FORM = "[UI]RESET_CALLEE_FORM";

export const toggleResetCalleeForm = payload => ({ type: RESET_CALLEE_FORM, payload: !!payload });

const initialState = {};

export default function(state = initialState, action) {
	switch (action.type) {
		case RESET_CALLEE_FORM: {
			const _state = Object.assign({}, state);
			if (action.payload) {
				_state.resetCalleeForm = true;
			} else {
				delete _state.resetCalleeForm;
			}
			return _state;
		}
		default: {
			return state;
		}
	}
}
