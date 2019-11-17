module.exports = class {
    constructor(config, flickr, { albumId, photoIds }) {
        this.flickr = flickr;
        this.albumId = albumId;
        this.photoIds = photoIds;
        this.config = config;
    }

    async exec() {
        const photoIds = this.photoIds.join(",");

        try {
            await this.flickr.removePhotosFromSet(this.albumId, photoIds);
            this.config.logger.log(`Removed ${this.photoIds.length} photo(s) from album ${this.albumId}`);
        }
        catch (error) {
            console.error(`Error removing photos from album: ${error}`);
        }
    }
};