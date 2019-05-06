import Axios from "axios";
import io from "socket.io-client";

import { store } from "../reducers";
import { incomingCall } from "../reducers/call/call.reducer";

import constants from "../constants";

import peerService from "./peer.service";

import logger from "../utils/logger";
const log = logger(__filename);

const { events } = constants.socket;

class SocketService {
	init() {
		log.debug(`connecting socket server on "${constants.socket.URL}"`);
		this.socket = io.connect(constants.socket.URL, constants.socket.options);
		this.socket.on("connect", () => {
			log.info(`successfully opened a socket connection`);
			this._syncSocketWithEmail();
		});
		this.socket.on(events.CALLEE_RECEIVE_PROMPT, this._onCalleePromptReceived.bind(this));
	}

	sendPrompt({ to }) {
		if (!this.socket.connected) {
			// prettier-ignore
			return log.warn(`socket is not connected. '${events.CALLER_SEND_PROMPT}' will not be sent`);
		}
		this.socket.emit(events.CALLER_SEND_PROMPT, { to });
	}

	_syncSocketWithEmail() {
		const { auth } = store.getState();
		const { email, photoURL, displayName } = auth.user;
		log.debug(`Syncing "${email}" with socket id "${this.socket.id}"`);
		this.socket.emit(events.SYNC_EMAIL, { email, photoURL, displayName });
	}

	_onCalleePromptReceived(data) {
		const { from, displayName, photoURL } = data;
		if (!from) {
			return log.warn('received falsy "from" field from socket connection');
		}
		// dispatch some action baby!
		store.dispatch(incomingCall({ from, displayName, photoURL }));
	}

	emitInitiatorSignal({ user, signal, peer }) {
		log.debug(`emitting '${constants.socket.events.initiatorSignal}'`);
		this.socket.emit(constants.socket.events.initiatorSignal, { user, signal, peer });
	}

	emitNonInitiatorSignal({ user, signal }) {
		log.debug(`emitting '${constants.socket.events.nonInitiatorSignal}'`);
		this.socket.emit(constants.socket.events.nonInitiatorSignal, {
			user,
			signal,
			peer: this._peer
		});
	}

	_onInitiatorSignalReceived({ user, signal, peer }) {
		this._user = user;
		this._peer = peer;
		peerService.setPeerSignal(signal);
	}

	_onNonInitiatorSignalReceived({ user, signal, peer }) {
		this._user = user;
		this._peer = peer;
		peerService.setPeerSignal(signal);
	}
}
export default new SocketService();
