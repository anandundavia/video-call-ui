export default {
	api: {
		base: "https://video-call-api.herokuapp.com/api/v1",
		user: {
			register: "/user/register",
			get: "/user/get",
			status: "/user/status"
		}
	},
	socket: {
		URL: "https://video-call-api.herokuapp.com",
		options: {
			path: "/socket",
			transports: ["websocket", "polling"]
		}
	}
};
