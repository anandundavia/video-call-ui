import firebase from "firebase/app";
import "firebase/app";
import "firebase/auth";

const firebaseConfig = {
	apiKey: "AIzaSyBBLPrpLcm_hCU6n8FnF2eMpKSXFLKRfyg",
	authDomain: "video-call-dev.firebaseapp.com",
	databaseURL: "https://video-call-dev.firebaseio.com",
	projectId: "video-call-dev",
	storageBucket: "video-call-dev.appspot.com",
	messagingSenderId: "735421855481",
	appId: "1:735421855481:web:d4c5f3cd6d8a1aaa"
};

firebase.initializeApp(firebaseConfig);

let hasSetPersistence = false;
(async () => {
	if (hasSetPersistence) {
		return console.log("[firebase-config] persistence is already set");
	}
	try {
		const st = Date.now();
		await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
		const et = Date.now();
		return console.log(`[firebase-config] persistence set successfully in ${et - st} ms`);
	} catch (e) {
		console.warn("[firebase-config] error while configuring persistence");
		console.warn(e);
	} finally {
		hasSetPersistence = true;
	}
})();

export default firebase;
