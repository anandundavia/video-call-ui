import React from "react";
import { Route, Redirect } from "react-router";

import { store } from "../reducers";
import firebase from "../config/firebase-config";

import logger from "../utils/logger";
const log = logger(__filename);

const PrivateRoute = ({ component: Component, ...rest }) => {
	const state = store.getState();
	log.debug(`Incoming route: ${rest.path}`);
	switch (rest.path) {
		case "/wait-for-call":
		case "/make-call": {
			if (firebase.auth().currentUser) {
				log.debug("User exists. allowed access to '/initiate-call'");
				return <Route {...rest} component={Component} />;
			} else {
				log.warn("Did not find user in firebase.auth().currentUser");
			}
			break;
		}
		case "/initialize-call": {
			if (state.user && state.user.mobileNumber && state.peer && state.peer.mobileNumber) {
				log.debug("user exists. peer exists. allowed access to '/initialize-call'");
				return <Route {...rest} component={Component} />;
			} else {
				log.warn(
					"did not find required user or user.mobileNumber and peer and peer.mobileNumber"
				);
			}
			break;
		}
		case "/live-call": {
			if (state.videoCall.isStreamReceived) {
				log.debug("stream exists. allowed access to '/live-call'");
				return <Route {...rest} component={Component} />;
			} else {
				log.warn(
					"did not find required user or user.mobileNumber and peer and peer.mobileNumber"
				);
			}
			break;
		}
		default: {
			log.debug("no rules specified. redirecting to /registration");
		}
	}
	return <Redirect to="/registration" />;
};

export default PrivateRoute;
