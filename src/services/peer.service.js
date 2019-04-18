import logger from "../utils/logger";
import constants from "../constants";

const log = logger(__filename);

class PeerService {
    init(user) {
        log.debug(`initializing peer with ${user.peerID}`);
        this.peer = new window.Peer(user.peerID, constants.peer);
        this.peer.on("error", err => log.error(err));
    }
}

export default new PeerService();
