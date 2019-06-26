export default {
	api: {
		base: "http://192.168.0.103:8000/api/v1",
		user: {
			register: "/user/register",
			get: "/user/get",
			status: "/user/status"
		}
	},
	socket: {
		URL: "http://192.168.0.103:8000",
		options: {
			path: "/socket",
			transports: ["websocket", "polling"]
		}
	}
};
