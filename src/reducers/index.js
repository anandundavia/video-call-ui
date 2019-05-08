import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { connectRouter, routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";
import { firebaseReducer } from "react-redux-firebase";

import callReducer from "./call/call.reducer";
import authReducer from "./auth/auth.reducer";
import uiReducer from "./ui/ui.reducer";

export const history = createBrowserHistory();

const allReducers = combineReducers({
	call: callReducer,
	auth: authReducer,
	ui: uiReducer,
	firebase: firebaseReducer,
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
