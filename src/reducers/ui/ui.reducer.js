export const RESET_CALLEE_FORM = "[UI]RESET_CALLEE_FORM";
export const SET_LOADING_BAR = "[UI]SET_LOADING_BAR";
export const LOADING_BAR_PROGRESS = "[UI]LOADING_BAR_PROGRESS";
export const UNSET_LOADING_BAR = "[UI]UNSET_LOADING_BAR";

export const toggleResetCalleeForm = payload => ({ type: RESET_CALLEE_FORM, payload: !!payload });

export const toggleLoadingBar = show => ({ type: show ? SET_LOADING_BAR : UNSET_LOADING_BAR });
export const setLoadingBarProgress = progress => ({
	type: LOADING_BAR_PROGRESS,
	payload: progress
});

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
		case SET_LOADING_BAR: {
			return {
				...state,
				showLoadingBar: true,
				loadingBarProgress: 0
			};
		}
		case LOADING_BAR_PROGRESS: {
			return {
				...state,
				loadingBarProgress: action.payload
			};
		}
		case UNSET_LOADING_BAR: {
			return {
				...state,
				showLoadingBar: false,
				loadingBarProgress: 0
			};
		}
		default: {
			return state;
		}
	}
}
