module.exports = class {
    constructor(config, flickr, { albumId, photoIds }) {
        this.flickr = flickr;
        this.albumId = albumId;
        this.photoIds = photoIds;
    }

    async exec() {
        const photoIds = this.photoIds.join(",");

        try {
            await this.flickr.removePhotosFromSet(this.albumId, photoIds);
        }
        catch (error) {
            console.error(`Error removing photos from album: ${error}`);
        }
    }
};