export default {
    api: {
        base: "http://localhost:8000/api/v1",
        // base: "https://shrouded-stream-12612.herokuapp.com/api/v1",
        user: {
            register: "/user/register",
            get: "/user/get"
        }
    },
    socket: {
        URL: "http://localhost:8000",
        options: {
            path: "/socket",
            transports: ["polling", "websocket"]
        },
        events: {
            initiatorSignal: "initiator-signal",
            nonInitiatorSignal: "non-initiator-signal",
            availability: "availability"
        }
    }
};
