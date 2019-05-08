import Peer from "simple-peer";

import { store } from "../reducers";

import socketService from "./socket.service";
import streamService from "./stream.service";

import logger from "../utils/logger";
const log = logger(__filename);

class PeerService {
	init() {}

	async _initializeInitiatorPeer() {
		// try {
		// 	this.stream = await streamService.requestStream();
		// 	this.initiatorPeer = new Peer({ initiator: true, trickle: false, stream: this.stream });
		// 	this.initiatorPeer.on("signal", this._onInitiatorPeerSignalReceived.bind(this));
		// } catch (e) {
		// 	log.error(`Error getting the stream`);
		// 	log.error(e);
		// }
	}

	_onInitiatorPeerSignalReceived(signal) {
		// const { call } = store.getState();
		// const { callee } = call;
		// socketService.sendSignal({ signal, to: callee.email });
	}
}

export default new PeerService();
