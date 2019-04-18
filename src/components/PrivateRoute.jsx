import React from "react";
import { store } from "../reducers";
import { Route, Redirect } from "react-router";

import logger from "../utils/logger";
const log = logger(__filename);

const PrivateRoute = ({ component: Component, ...rest }) => {
    const state = store.getState();
    log.debug(`Incoming route: ${rest.path}`);
    switch (rest.path) {
        case "/initiate-call": {
            if (state.user && state.user.peerID) {
                log.debug("user has peerID. allowed access to '/initiate-call'");
                return <Route {...rest} component={Component} />;
            } else {
                log.warn("did not find required user and user.peerID");
            }
            break;
        }
        case "/live-call": {
            if (state.user && state.user.peerID && state.peer && state.peer.peerID) {
                log.debug("user has peerID. peer has peerID. allowed access to '/live-call'");
                return <Route {...rest} component={Component} />;
            } else {
                log.warn("did not find required user and user.peerID and peer and peer.peerID");
            }
            break;
        }
        default: {
            log.debug("user does not have peerID. redirecting to /registration");
        }
    }
    return <Redirect to="/registration" />;
};

export default PrivateRoute;
