const os = require("os");

module.exports = class {
    constructor(config, flickr, format) {
        this.flickr = flickr;
        this.format = format;
        this.config = config;
    }

    async exec() {
        const albums = await this.flickr.listAlbums();
        const res = this.format.format(albums);
        const output = res.join(os.EOL);
        this.config.logger.log(output);
    }
};