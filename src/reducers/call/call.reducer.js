export const VIDEO_STREAM_RECEIVED = "[VIDEO_CALL]STEAM_RECEIVED";
export const CALLEE_RECEIVE_PROMPT = "[CALL]CALLEE_RECEIVE_PROMPT";

export const incomingCall = payload => ({ type: CALLEE_RECEIVE_PROMPT, payload });

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
		default: {
			return state;
		}
	}
}
