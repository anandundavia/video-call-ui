class StreamService {
    requestStream() {
        return navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    }
}

export default new StreamService();
