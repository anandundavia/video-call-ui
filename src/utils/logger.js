export default function prefix(prefix) {
    return {
        debug: (...msg) => {
            console.log("[DEBUG]", `[${prefix}]`, ...msg);
        },
        info: (...msg) => {
            console.log("[INFO]", `[${prefix}]`, ...msg);
        },
        log: (...msg) => {
            console.log("[LOG]", `[${prefix}]`, ...msg);
        },
        warn: (...msg) => {
            console.warn("[WARN]", `[${prefix}]`, ...msg);
        },
        error: (...msg) => {
            console.error("[ERROR]", `[${prefix}]`, ...msg);
        }
    };
}
