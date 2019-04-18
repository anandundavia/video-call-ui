import common from "./constants.common";

import dev from "./constants.dev";
import prod from "./constants.prod";

export default Object.assign({}, common, process.env.NODE_ENV === "production" ? prod : dev);
