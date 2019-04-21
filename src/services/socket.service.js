import io from "socket.io-client";
import logger from "../utils/logger";
import constants from "../constants";

import { store } from "../reducers";
import peerService from "./peer.service";

const log = logger(__filename);

class SocketService {
    init() {
        log.debug(`connecting socket server on "${constants.socket.URL}"`);
        this.socket = io.connect(constants.socket.URL, constants.socket.options);
        this.socket.on("connect", () => {
            log.info(`successfully opened a socket connection`);
            this.emitAvailability({ status: "online" });
        });
        this.socket.on("initiator-signal", this._onInitiatorSignalReceived.bind(this));
        this.socket.on("non-initiator-signal", this._onNonInitiatorSignalReceived.bind(this));
    }

    emitAvailability({ status }) {
        log.debug(`emitting '${constants.socket.events.availability}'`);
        const { user } = store.getState();
        this.socket.emit(constants.socket.events.availability, { user, status });
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
