export const VIDEO_STREAM_RECEIVED = "[VIDEO_CALL]STEAM_RECEIVED";

export const videoCallSteamReceived = () => ({ type: VIDEO_STREAM_RECEIVED });

const initialState = {
    isStreamReceived: false
};

export default function(state = initialState, action) {
    switch (action.type) {
        case VIDEO_STREAM_RECEIVED: {
            return {
                ...state,
                isStreamReceived: true
            };
        }
        default: {
            return state;
        }
    }
}
