import Peer from "simple-peer";

import { store } from "../reducers";

import socketService from "./socket.service";
import streamService from "./stream.service";

import logger from "../utils/logger";
const log = logger(__filename);

class PeerService {
	init() {}

	async _initializeNonInitiatorPeer() {
		socketService.subscribe(socketService.events.RECEIVE_PEER_SIGNAL, data => {
			log.debug("initiator signal received");
			const { from, signal } = data;
			this.nonInitiatorPeer = new Peer({ trickle: false });

			this.nonInitiatorPeer.signal(signal);
			this.nonInitiatorPeer.on("signal", this._onNonInitiatorPeerSignalReceived.bind(this));
			this.nonInitiatorPeer.on("stream", stream => {
				log.debug("stream received");
			});
		});
	}

	async _initializeInitiatorPeer() {
		try {
			this.stream = await streamService.requestStream();
			this.initiatorPeer = new Peer({ initiator: true, trickle: false, stream: this.stream });
			this.initiatorPeer.on("signal", this._onInitiatorPeerSignalReceived.bind(this));
		} catch (e) {
			log.error(`Error getting the stream`);
			log.error(e);
		}
	}

	_onNonInitiatorPeerSignalReceived(signal) {
		this.nonInitiatorSignal = signal;
		const { call } = store.getState();
		const { callee } = call;
		socketService.sendSignal({ signal, to: callee.email, type: "NON_INITIATOR_SIGNAL" });
	}

	_onInitiatorPeerSignalReceived(signal) {
		this.initiatorSignal = signal;
		const { call } = store.getState();
		const { callee } = call;
		socketService.sendSignal({ signal, to: callee.email, type: "INITIATOR_SIGNAL" });
	}
}

export default new PeerService();
