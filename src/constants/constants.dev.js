export default {
    api: {
        base: "http://localhost:8000/api/v1",
        // base: "https://shrouded-stream-12612.herokuapp.com/api/v1",
        user: {
            register: "/user/register",
            get: "/user/get"
        }
    },
    peer: {
        host: "localhost",
        port: 8000,
        path: "/peer"
    }
};
