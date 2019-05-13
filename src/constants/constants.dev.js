export default {
	api: {
		// base: "http://localhost:8000/api/v1",
		base: "https://video-call-api.herokuapp.com/api/v1",
		user: {
			register: "/user/register",
			get: "/user/get",
			status: "/user/status"
		}
	},
	socket: {
		// URL: "http://localhost:8000",
		URL: "https://video-call-api.herokuapp.com",
		options: {
			path: "/socket",
			transports: ["websocket", "polling"]
		},
		events: {
			/** Initial Sync */
			SYNC_EMAIL: "SYNC_EMAIL",
			/** Contact events for placing a connection */
			CALLER_SEND_PROMPT: "CALLER_SEND_PROMPT",
			CALLER_RECEIVE_PROMPT_ANSWER: "CALLER_RECEIVE_PROMPT_ANSWER",
			CALLEE_RECEIVE_PROMPT: "CALLEE_RECEIVE_PROMPT",
			CALLEE_SEND_PROMPT_ANSWER: "CALLEE_SEND_PROMPT_ANSWER",
			/** Methods to exchange the signals */
			SEND_PEER_SIGNAL: "SEND_PEER_SIGNAL",
			RECEIVE_PEER_SIGNAL: "RECEIVE_PEER_SIGNAL"
		}
	}
};
