class ConsoleLogger {
    log(msg) {
        console.info(msg);
    }
    writeError(msg) {
        console.error(msg);
    }
    writeWarning(msg) {
        console.warn(msg);
    }
}

module.exports = ConsoleLogger;