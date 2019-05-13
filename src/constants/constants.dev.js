export default {
	api: {
		// base: "http://192.168.0.112:8000/api/v1",
		base: "https://video-call-api.herokuapp.com/api/v1",
		user: {
			register: "/user/register",
			get: "/user/get",
			status: "/user/status"
		}
	},
	socket: {
		// URL: "http://192.168.0.112:8000",
		URL: "https://video-call-api.herokuapp.com",
		options: {
			path: "/socket",
			transports: ["websocket", "polling"]
		}
	}
};
