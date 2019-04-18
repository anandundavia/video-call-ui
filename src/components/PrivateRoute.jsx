import React from "react";
import { store } from "../reducers";
import { Route, Redirect } from "react-router";

import logger from "../utils/logger";
const log = logger(__filename);

const PrivateRoute = ({ component: Component, ...rest }) => {
    const state = store.getState();
    if (state.user && state.user.peerID) {
        log.debug("user has peerID. allowing call");
        return <Route {...rest} component={Component} />;
    }
    log.debug("user does not have peerID. redirecting to /registration");
    return <Redirect to="/registration" />;
};

export default PrivateRoute;
