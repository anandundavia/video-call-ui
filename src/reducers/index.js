import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { connectRouter, routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";
import userReducer from "./user/user.reducer";
import inputReducer from "./input/input.reducer";
import snackbarReducer from "./snackbar/snackbar.reducer";
import peerReducer from "./peer/peer.reducer";

export const history = createBrowserHistory();

const allReducers = combineReducers({
    user: userReducer,
    peer: peerReducer,
    input: inputReducer,
    snackbar: snackbarReducer,
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
