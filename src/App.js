import React from "react";
import { Provider } from "react-redux";
import { Route, Switch, Redirect } from "react-router";
import { ConnectedRouter } from "connected-react-router";
import CssBaseline from "@material-ui/core/CssBaseline";

import "./App.css";
import { store, history } from "./reducers";

import Registration from "./pages/Registration/Registration";
import MakeCall from "./pages/MakeCall/MakeCall";
import PrivateRoute from "./components/PrivateRoute";

import { SnackbarProvider } from "notistack";
import OngoingCall from "./pages/OngoingCall/OngoingCall";

const App = () => (
	<Provider store={store}>
		<SnackbarProvider maxSnack={3}>
			<CssBaseline />
			<div className="wrapper">
				<ConnectedRouter history={history}>
					<Switch>
						<Route exact path="/registration" component={Registration} />
						<PrivateRoute exact path="/make-call" component={MakeCall} />
						<PrivateRoute exact path="/ongoing-call" component={OngoingCall} />
						<Redirect from="**" to="/registration" />
					</Switch>
				</ConnectedRouter>
			</div>
			<footer className="footer">
				Written with &nbsp;
				<span role="img" aria-label="love">
					❤️
				</span>
				&nbsp; by &nbsp;
				<a href="https://github.com/anandundavia" target="_blank" rel="noopener noreferrer">
					Anand Undavia
				</a>
			</footer>
		</SnackbarProvider>
	</Provider>
);

export default App;
