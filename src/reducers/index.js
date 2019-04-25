import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { connectRouter, routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";

import userReducer from "./user/user.reducer";
import peerReducer from "./peer/peer.reducer";
import videoCallReducer from "./videoCall/video-call.reducer";

export const history = createBrowserHistory();

const allReducers = combineReducers({
    user: userReducer,
    peer: peerReducer,
    videoCall: videoCallReducer,
    router: connectRouter(history)
});

const initialState = {};

const enhancers = [];
const middleware = [thunk, routerMiddleware(history)];

const composedEnhancers = compose(
    applyMiddleware(...middleware),
    ...enhancers
);

export const store = createStore(allReducers, initialState, composedEnhancers);
