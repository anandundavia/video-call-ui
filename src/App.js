import React from "react";
import { Provider } from "react-redux";
import { Route, Switch, Redirect } from "react-router";
import { ConnectedRouter } from "connected-react-router";
import CssBaseline from "@material-ui/core/CssBaseline";

import "./index.css";
import { store, history } from "./reducers";

import Registration from "./components/Registration/Registration";

const App = () => (
    <Provider store={store}>
        <CssBaseline />
        <div>
            <ConnectedRouter history={history}>
                <Switch>
                    <Route exact path="/registration" component={Registration} />
                    <Redirect from="**" to="/registration" />
                </Switch>
            </ConnectedRouter>
        </div>
    </Provider>
);

export default App;
