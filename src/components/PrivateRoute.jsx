import React from "react";
import { Route, Redirect } from "react-router";

import firebase from "../config/firebase-config";

import logger from "../utils/logger";
const log = logger(__filename);

const PrivateRoute = ({ component: Component, ...rest }) => {
	log.debug(`Incoming route: ${rest.path}`);
	switch (rest.path) {
		case "/wait-for-call":
		case "/make-call": {
			if (firebase.auth().currentUser) {
				log.debug(`User exists. allowed access to '${rest.path}'`);
				return <Route {...rest} component={Component} />;
			} else {
				log.warn("Did not find user in firebase.auth().currentUser");
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
