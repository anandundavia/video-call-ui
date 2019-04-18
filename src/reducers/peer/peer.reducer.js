export const SET_PEER = "[PEER]SET";
export const CALL_PEER = "[PEER]CALL";

export const setPeer = peer => ({ type: SET_PEER, payload: peer });

export const callPeer = () => ({ type: CALL_PEER });

const initialState = {};

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_PEER: {
            return {
                ...state,
                ...action.payload   
            };
        }
        case CALL_PEER: {
            return {
                ...state,
                isCalling: true
            };
        }
        default: {
            return state;
        }
    }
}
