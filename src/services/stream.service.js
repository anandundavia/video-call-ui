class StreamService {
	requestStream({ video, audio } = { video: true, audio: true }) {
		return navigator.mediaDevices.getUserMedia({ video, audio });
	}
}

export default new StreamService();
