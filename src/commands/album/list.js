const os = require("os");
module.exports = class {
    constructor(config, flickr, format, { albumIds }) {
        this.flickr = flickr;
        this.format = format;
        this.albumIds = albumIds;
        this.config = config;
    }

    async exec() {
        let photos = [];
        for (let albumId of this.albumIds) {
            photos = photos.concat(await this.flickr.getAlbumContent(albumId));
        }
        const res = this.format.format(photos);
        const output = res.join(os.EOL);
        this.config.logger.log(output);
    }
};