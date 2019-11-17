module.exports = class {
    constructor(config, flickr, { albumIds }) {
        this.flickr = flickr;
        this.albumIds = albumIds;
        this.config = config;
    }

    async exec() {
        try {
            for (let i = 0; i < this.albumIds.length; i++) {
                await this.flickr.deleteAlbum(this.albumIds[i]);
            }
            this.config.logger.log(`Deleted ${this.albumIds.length} album(s)`);
        }
        catch (error) {
            console.error(`Error deleting album: ${error}`);
        }
    }
};