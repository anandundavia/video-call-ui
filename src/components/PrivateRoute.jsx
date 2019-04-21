import React from "react";
import { store } from "../reducers";
import { Route, Redirect } from "react-router";

import logger from "../utils/logger";
const log = logger(__filename);

const PrivateRoute = ({ component: Component, ...rest }) => {
    const state = store.getState();
    log.debug(`Incoming route: ${rest.path}`);
    switch (rest.path) {
        case "/wait-for-call":
        case "/make-call": {
            if (state.user && state.user.mobileNumber) {
                log.debug("user exists. allowed access to '/initiate-call'");
                return <Route {...rest} component={Component} />;
            } else {
                log.warn("did not find required user or user.mobileNumber");
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
        default: {
            log.debug("no rules specified. redirecting to /registration");
        }
    }
    return <Redirect to="/registration" />;
};

export default PrivateRoute;
