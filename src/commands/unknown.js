const unknown = async (args) => {
    args.unknown.shift();
    args.unknown.shift();
    console.log(`Unknown command: ${args.unknown}`)
};

module.exports = unknown;