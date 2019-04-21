export const UPDATE_PEER = "[PEER]UPDATE_PEER";

export const updatePeerInformation = peer => ({ type: UPDATE_PEER, payload: peer });

const initialState = {};

export default function(state = initialState, action) {
    switch (action.type) {
        case UPDATE_PEER: {
            return {
                ...state,
                ...action.payload
            };
        }
        default: {
            return state;
        }
    }
}
