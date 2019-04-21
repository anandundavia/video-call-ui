import Peer from "simple-peer";

import logger from "../utils/logger";
const log = logger(__filename);

class PeerService {
    initializeForUser({ user, stream }) {
        return new Promise(resolve => {
            const options = {
                initiator: user.isCaller,
                trickle: false
            };
            if (user.isCaller) {
                options.stream = stream;
            }
            this.peer = new Peer(options);
            this.peer.on("signal", data => {
                this.selfSignal = data;
                log.debug("signal from webRTC received");
                resolve();
            });
            this.peer.on("connect", () => {
                console.log("connect");
            });
            this.peer.on("stream", videoStream => {
                log.debug("received video steam!");
            });
            this.peer.on("error", function(err) {
                console.log("error", err);
            });
        });
    }

    setPeerSignal(signal) {
        log.debug("setting peer signal");
        this.peerSignal = signal;
        this.peer.signal(signal);
    }

    setPeerUserAndSignal({ user, signal }) {
        this.peerUser = {
            user,
            signal
        };
    }
}

export default new PeerService();
