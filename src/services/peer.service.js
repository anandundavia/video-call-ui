import Peer from "simple-peer";

import { store } from "../reducers";

import socketService from "./socket.service";
import streamService from "./stream.service";

import { toggleLoadingBar } from "../reducers/ui/ui.reducer";

import toArray from "../utils/to-array";
import logger from "../utils/logger";
const log = logger("peer-service");

class PeerService {
	constructor() {
		this.events = {
			STREAM_RECEIVED: "STREAM_RECEIVED"
		};
		this.eventsArray = toArray(this.events);
		this._subscriptions = [];
	}

	async init() {
		store.dispatch(toggleLoadingBar(true));
		this._initializeNonInitiatorPeer();
		await this._initializeInitiatorPeer();
	}

	async _initializeInitiatorPeer() {
		try {
			log.debug("Initializing initiator peer");
			this.stream = await streamService.requestStream();
			this.initiatorPeer = new Peer({ initiator: true, trickle: false, stream: this.stream });
			this.initiatorPeer.on("signal", this._onInitiatorPeerSignalReceived.bind(this));
			log.debug(`Subscribing to "${socketService.events.RECEIVE_NON_INITIATOR_PEER_SIGNAL}"`);
			socketService.subscribe(
				socketService.events.RECEIVE_NON_INITIATOR_PEER_SIGNAL,
				data => {
					const { from, signal } = data;
					log.debug(`[OTHER] Signal reply received from non initiator peer"${from}"`);
					this.initiatorPeer.signal(signal);
					log.info("Peer successfully connected");
				}
			);
		} catch (e) {
			log.error(`Something went wrong while initializing the initiator peer`);
			log.error(e);
		}
	}

	_initializeNonInitiatorPeer() {
		log.debug("Initializing non initiator peer");
		log.debug(`Subscribing to "${socketService.events.RECEIVE_INITIATOR_PEER_SIGNAL}"`);
		socketService.subscribe(socketService.events.RECEIVE_INITIATOR_PEER_SIGNAL, data => {
			const { from, signal } = data;
			log.debug(`[OTHER] Signal received from initiator peer "${from}"`);
			this.nonInitiatorPeer = new Peer({ trickle: false });
			this.nonInitiatorPeer.on("signal", this._onNonInitiatorPeerSignalReceived.bind(this));
			this.nonInitiatorPeer.signal(signal);
			this.nonInitiatorPeer.on("stream", this._onStreamReceived.bind(this));
		});
	}

	__getToEmailAddress() {
		const { call } = store.getState();
		const { callee, caller } = call;
		return callee.from || caller.from;
	}

	_onNonInitiatorPeerSignalReceived(signal) {
		log.debug("[SELF] Non Initiator signal successfully received");
		this.nonInitiatorSignal = signal;
		const to = this.__getToEmailAddress();
		socketService.sendNonInitiatorSignal({ to, signal });
	}

	_onInitiatorPeerSignalReceived(signal) {
		log.debug("[SELF] Initiator signal successfully received");
		this.initiatorSignal = signal;
		const to = this.__getToEmailAddress();
		socketService.sendInitiatorSignal({ to, signal });
	}

	subscribe(event, callback) {
		if (!this.eventsArray.includes(event)) {
			const message = `"${event}" must be one of ${this.eventsArray.join(",")}`;
			throw new Error(message);
		}
		this._subscriptions.push({ event, callback });
	}

	_onStreamReceived(stream) {
		store.dispatch(toggleLoadingBar(false));
		this.__flushToSubscribers(this.events.STREAM_RECEIVED, stream);
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

export default new PeerService();
