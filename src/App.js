import React from "react";
import { Provider } from "react-redux";
import { Route, Switch, Redirect } from "react-router";
import { ConnectedRouter } from "connected-react-router";
import CssBaseline from "@material-ui/core/CssBaseline";

import "./index.css";
import { store, history } from "./reducers";

import Registration from "./pages/Registration/Registration";
import InitiateCall from "./pages/InitiateCall/InitiateCall";
import PrivateRoute from "./components/PrivateRoute";
import LiveCall from "./pages/LiveCall/LiveCall";

import { SnackbarProvider } from "notistack";

const App = () => (
    <Provider store={store}>
        <SnackbarProvider maxSnack={3}>
            <CssBaseline />
            <div>
                <ConnectedRouter history={history}>
                    <Switch>
                        <Route exact path="/registration" component={Registration} />
                        <PrivateRoute exact path="/initiate-call" component={InitiateCall} />
                        <PrivateRoute exact path="/live-call" component={LiveCall} />
                        <Redirect from="**" to="/registration" />
                    </Switch>
                </ConnectedRouter>
            </div>
        </SnackbarProvider>
    </Provider>
);

export default App;
