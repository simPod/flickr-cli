class Unknown {

    constructor(config, flickr) {
        this.config = config;
        this.flickr = flickr;
        this.exec = this.exec.bind(this);
    }

    async exec(args) {
        args.unknown.shift();
        args.unknown.shift();
        this.config.logger.log(`Unknown command: ${args.unknown}`)
    }
}

module.exports = Unknown;