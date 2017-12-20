const unknown = async (args, config) => {
    args.unknown.shift();
    args.unknown.shift();
    config.logger.log(`Unknown command: ${args.unknown}`)
};

module.exports = unknown;