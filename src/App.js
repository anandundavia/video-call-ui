import React from "react";
import { Provider } from "react-redux";
import { Route, Switch, Redirect } from "react-router";
import { ConnectedRouter } from "connected-react-router";
import CssBaseline from "@material-ui/core/CssBaseline";

import "./index.css";
import { store, history } from "./reducers";

import Registration from "./pages/Registration/Registration";
import MakeCall from "./pages/MakeCall/MakeCall";
import PrivateRoute from "./components/PrivateRoute";
import InitializeCall from "./pages/InitializeCall/InitializeCall";
import WaitForCall from "./pages/WaitForCall/WaitForCall";

import { SnackbarProvider } from "notistack";

const App = () => (
    <Provider store={store}>
        <SnackbarProvider maxSnack={3}>
            <CssBaseline />
            <div>
                <ConnectedRouter history={history}>
                    <Switch>
                        <Route exact path="/registration" component={Registration} />
                        <PrivateRoute exact path="/make-call" component={MakeCall} />
                        <PrivateRoute exact path="/wait-for-call" component={WaitForCall} />
                        <PrivateRoute exact path="/initialize-call" component={InitializeCall} />
                        <Redirect from="**" to="/registration" />
                    </Switch>
                </ConnectedRouter>
            </div>
        </SnackbarProvider>
    </Provider>
);

export default App;
