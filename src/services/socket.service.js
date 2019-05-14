import io from "socket.io-client";

import { store } from "../reducers";
import { incomingCall, callAccepted, callDeclined } from "../reducers/call/call.reducer";

import constants from "../constants";

import { toggleResetCalleeForm } from "../reducers/ui/ui.reducer";

import toArray from "../utils/to-array";
import logger from "../utils/logger";
const log = logger("socket-service");

class SocketService {
	constructor() {
		this.events = {
			/** Initial Sync */
			SYNC_EMAIL: "SYNC_EMAIL",
			/** Contact events for placing a connection */
			CALLER_SEND_PROMPT: "CALLER_SEND_PROMPT",
			CALLER_RECEIVE_PROMPT_ANSWER: "CALLER_RECEIVE_PROMPT_ANSWER",
			CALLEE_RECEIVE_PROMPT: "CALLEE_RECEIVE_PROMPT",
			CALLEE_SEND_PROMPT_ANSWER: "CALLEE_SEND_PROMPT_ANSWER",
			/** Methods to exchange the signals */
			// For initiator
			SEND_INITIATOR_PEER_SIGNAL: "SEND_INITIATOR_PEER_SIGNAL",
			RECEIVE_INITIATOR_PEER_SIGNAL: "RECEIVE_INITIATOR_PEER_SIGNAL",
			// For non initiator
			SEND_NON_INITIATOR_PEER_SIGNAL: "SEND_NON_INITIATOR_PEER_SIGNAL",
			RECEIVE_NON_INITIATOR_PEER_SIGNAL: "RECEIVE_NON_INITIATOR_PEER_SIGNAL"
		};
		this.eventsArray = toArray(this.events);
	}
	init() {
		log.debug(`connecting socket server on "${constants.socket.URL}"`);

		this.socket = io.connect(constants.socket.URL, constants.socket.options);
		this.socket.on("connect", () => {
			log.info(`successfully opened a socket connection`);
			this._syncSocketWithEmail();
		});
		this.socket.on(this.events.CALLEE_RECEIVE_PROMPT, this._onCalleePromptReceived.bind(this));
		this.socket.on(
			this.events.CALLER_RECEIVE_PROMPT_ANSWER,
			this._onCallerPromptAnswerReceived.bind(this)
		);
		this.socket.on(
			this.events.RECEIVE_INITIATOR_PEER_SIGNAL,
			this._onInitiatorPeerSignalReceived.bind(this)
		);
		this.socket.on(
			this.events.RECEIVE_NON_INITIATOR_PEER_SIGNAL,
			this._onNonInitiatorPeerSignalReceived.bind(this)
		);
		this._subscriptions = [];
	}

	sendPrompt({ to }) {
		if (!this.socket.connected) {
			// prettier-ignore
			return log.warn(`socket is not connected. '${this.events.CALLER_SEND_PROMPT}' will not be sent`);
		}
		this.socket.emit(this.events.CALLER_SEND_PROMPT, { to });
	}

	sendIncomingCallAnswer({ from, accepted }) {
		if (!this.socket.connected) {
			// prettier-ignore
			return log.warn(`socket is not connected. '${this.events.CALLEE_SEND_PROMPT_ANSWER}' will not be sent`);
		}
		this.socket.emit(this.events.CALLEE_SEND_PROMPT_ANSWER, { to: from, accepted });
	}

	_syncSocketWithEmail() {
		const { auth } = store.getState();
		const { email, photoURL, displayName } = auth;
		log.debug(`Syncing "${email}" with socket id "${this.socket.id}"`);
		this.socket.emit(this.events.SYNC_EMAIL, { email, photoURL, displayName });
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
		if (!this.eventsArray.includes(event)) {
			const message = `"${event}" must be one of ${this.eventsArray.join(",")}`;
			throw new Error(message);
		}
		this._subscriptions.push({ event, callback });
	}

	sendInitiatorSignal(data) {
		const { to, signal } = data;
		log.debug(`Sending initiator signal to "${to}"`);
		this.socket.emit(this.events.SEND_INITIATOR_PEER_SIGNAL, { to, signal });
	}

	sendNonInitiatorSignal(data) {
		const { to, signal } = data;
		log.debug(`Sending non initiator signal to "${to}"`);
		this.socket.emit(this.events.SEND_NON_INITIATOR_PEER_SIGNAL, { to, signal });
	}

	/** We would always receive the initiator signal */
	_onInitiatorPeerSignalReceived(data) {
		log.debug(`Received initiator peer signal from "${data.from}"`);
		this.__flushToSubscribers(this.events.RECEIVE_INITIATOR_PEER_SIGNAL, data);
	}

	_onNonInitiatorPeerSignalReceived(data) {
		log.debug(`Received non initiator peer signal from "${data.from}"`);
		this.__flushToSubscribers(this.events.RECEIVE_NON_INITIATOR_PEER_SIGNAL, data);
	}

	__flushToSubscribers(event, data) {
		// console.log(this._subscriptions);
		const subscriptions = this._subscriptions.filter(
			aSubscription => aSubscription.event === event
		);
		subscriptions.forEach(aSubscription => {
			try {
				aSubscription.callback(data);
			} catch (e) {
				// prettier-ignore
				log.error(`Something went wrong while flushing "${event}" event to one of the subscribers`)
				log.error(e);
			}
		});
	}
}
export default new SocketService();
