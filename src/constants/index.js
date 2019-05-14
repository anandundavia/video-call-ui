import common from "./constants.common";

import local from "./constants.local";
import staging from "./constants.staging";

const environment = process.env.REACT_APP_ENV;

let constantsToMerge;

switch (environment) {
	case "staging": {
		console.log("[constants] using 'staging' constants");
		constantsToMerge = staging;
		break;
	}
	default: {
		console.log("[constants] using 'local' constants");
		constantsToMerge = local;
	}
}

export default Object.assign({}, common, constantsToMerge);
