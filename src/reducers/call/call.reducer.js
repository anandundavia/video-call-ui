export const VIDEO_STREAM_RECEIVED = "[VIDEO_CALL]STEAM_RECEIVED";
export const CALLEE_RECEIVE_PROMPT = "[CALL]CALLEE_RECEIVE_PROMPT";
export const CALLEE_ANSWERED_PROMPT = "[CALL]CALLEE_ANSWERED_PROMPT";

export const incomingCall = payload => ({ type: CALLEE_RECEIVE_PROMPT, payload });

export const incomingCallAnswered = () => ({ type: CALLEE_ANSWERED_PROMPT });

const initialState = {
	incomingCall: null,
	from: null,
	displayName: null,
	photoURL: null
};

export default function(state = initialState, action) {
	switch (action.type) {
		case CALLEE_RECEIVE_PROMPT: {
			return {
				...state,
				incomingCall: true,
				...action.payload
			};
		}
		case CALLEE_ANSWERED_PROMPT: {
			return {
				...state,
				incomingCall: false,
				from: null,
				displayName: null,
				photoURL: null
			};
		}
		default: {
			return state;
		}
	}
}
