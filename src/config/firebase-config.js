import firebase from "firebase/app";
import "firebase/app";
import "firebase/auth";

import stagingConfigs from "./environments/staging";
import localConfigs from "./environments/local";

const environment = process.env.REACT_APP_ENV;

let configToUse;

switch (environment) {
	case "staging": {
		console.log("[firebase-config] using 'staging' configs");
		configToUse = stagingConfigs;
		break;
	}
	default: {
		console.log("[firebase-config] using 'local' configs");
		configToUse = localConfigs;
	}
}

firebase.initializeApp(configToUse);

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
