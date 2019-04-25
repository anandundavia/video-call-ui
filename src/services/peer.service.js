import Peer from "simple-peer";

import { store } from "../reducers";

import logger from "../utils/logger";
import { videoCallSteamReceived } from "../reducers/videoCall/video-call.reducer";
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
            this.peer.on("connect", foo => {
                console.log("connect", foo);
            });
            this.peer.on("stream", videoStream => {
                this.videoStream = videoStream;
                store.dispatch(videoCallSteamReceived());
                log.debug("received peer video steam");
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
