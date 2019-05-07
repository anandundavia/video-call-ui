import io from "socket.io-client";

import { store } from "../reducers";
import { incomingCall } from "../reducers/call/call.reducer";

import constants from "../constants";

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
		this.socket.on(
			events.CALLER_RECEIVE_PROMPT_ANSWER,
			this._onCAllerPromptAnswerReceived.bind(this)
		);
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
		const { email, photoURL, displayName } = auth.user;
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

	_onCAllerPromptAnswerReceived(data) {
		const { accepted, from } = data;
		if (accepted) {
		} else {
		}
		alert(`${from} ${accepted ? "accepted" : "declined"} your call`);
	}
}
export default new SocketService();
