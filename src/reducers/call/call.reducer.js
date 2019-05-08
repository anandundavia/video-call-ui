export const VIDEO_STREAM_RECEIVED = "[VIDEO_CALL]STEAM_RECEIVED";
export const SET_CALLER = "[CALL]SET_CALLER";
export const CALLEE_ANSWERED_PROMPT = "[CALL]CALLEE_ANSWERED_PROMPT";
export const SET_CALLEE = "[CALL]SET_CALLEE";
export const UNSET_CALLEE = "[CALL]UNSET_CALLEE";

export const incomingCall = payload => ({ type: SET_CALLER, payload });
export const incomingCallAnswered = () => ({ type: CALLEE_ANSWERED_PROMPT });

export const callAccepted = payload => ({ type: SET_CALLEE, payload });
export const callDeclined = payload => ({ type: UNSET_CALLEE, payload });

const initialState = {
	incomingCall: null,
	caller: {},
	callee: {}
};

export default function(state = initialState, action) {
	switch (action.type) {
		case SET_CALLER: {
			return {
				...state,
				incomingCall: true,
				caller: {
					...action.payload
				}
			};
		}
		case CALLEE_ANSWERED_PROMPT: {
			return {
				...state,
				incomingCall: false
			};
		}
		case SET_CALLEE: {
			return {
				...state,
				callee: {
					...action.payload
				}
			};
		}
		case UNSET_CALLEE: {
			return {
				...state,
				callee: {
					...action.payload
				}
			};
		}
		default: {
			return state;
		}
	}
}
