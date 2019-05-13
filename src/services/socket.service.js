import io from "socket.io-client";

import { store } from "../reducers";
import { incomingCall, callAccepted, callDeclined } from "../reducers/call/call.reducer";

import constants from "../constants";

import { toggleResetCalleeForm } from "../reducers/ui/ui.reducer";

import toArray from "../utils/to-array";
import logger from "../utils/logger";
const log = logger(__filename);

const { events } = constants.socket;

const eventsArray = toArray(events);

class SocketService {
	init() {
		log.debug(`connecting socket server on "${constants.socket.URL}"`);
		this.events = events;
		this.socket = io.connect(constants.socket.URL, constants.socket.options);
		this.socket.on("connect", () => {
			log.info(`successfully opened a socket connection`);
			this._syncSocketWithEmail();
		});
		this.socket.on(events.CALLEE_RECEIVE_PROMPT, this._onCalleePromptReceived.bind(this));
		this.socket.on(
			events.CALLER_RECEIVE_PROMPT_ANSWER,
			this._onCallerPromptAnswerReceived.bind(this)
		);
		this.socket.on(events.RECEIVE_PEER_SIGNAL, this._onPeerSignalReceived.bind(this));
		this._subscriptions = [];
	}

	sendPrompt({ to }) {
		if (!this.socket.connected) {
			// prettier-ignore
			return log.warn(`socket is not connected. '${events.CALLER_SEND_PROMPT}' will not be sent`);
		}
		this.socket.emit(events.CALLER_SEND_PROMPT, { to });
	}

	sendIncomingCallAnswer({ from, accepted }) {
		if (!this.socket.connected) {
			// prettier-ignore
			return log.warn(`socket is not connected. '${events.CALLEE_SEND_PROMPT_ANSWER}' will not be sent`);
		}
		this.socket.emit(events.CALLEE_SEND_PROMPT_ANSWER, { to: from, accepted });
	}

	_syncSocketWithEmail() {
		const { auth } = store.getState();
		const { email, photoURL, displayName } = auth;
		log.debug(`Syncing "${email}" with socket id "${this.socket.id}"`);
		this.socket.emit(events.SYNC_EMAIL, { email, photoURL, displayName });
	}

	_onCalleePromptReceived(data) {
		const { from, displayName, photoURL } = data;
		if (!from) {
			return log.warn('received falsy "from" field from socket connection');
		}
		store.dispatch(incomingCall({ from, displayName, photoURL }));
	}

	_onCallerPromptAnswerReceived(data) {
		const { accepted, from } = data;
		if (accepted) {
			store.dispatch(callAccepted({ from, accepted }));
		} else {
			store.dispatch(toggleResetCalleeForm(true));
			store.dispatch(callDeclined({ from, accepted }));
		}
	}

	subscribe(event, callback) {
		if (!eventsArray.includes(event)) {
			throw new Error(`${event} must be one of ${eventsArray.join(",")}`);
		}
		this._subscriptions.push({ event, callback });
	}

	/** We would always receive the initiator signal */
	_onPeerSignalReceived(data) {
		const subscription = this._subscriptions.find(
			aSubscription => aSubscription.event === events.RECEIVE_PEER_SIGNAL
		);
		subscription.forEach(aSubscription => {
			try {
				aSubscription(data);
			} catch (e) {
				log.error(e);
			}
		});
	}
}
export default new SocketService();
