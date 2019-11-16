module.exports = class {
    constructor(config, flickr, { albumIds }) {
        this.flickr = flickr;
        this.albumIds = albumIds;
    }

    async exec() {
        try {
            for (let i = 0; i < this.albumIds.length; i++) {
                await this.flickr.deleteAlbum(this.albumIds[i]);
            }
        }
        catch (error) {
            console.error(`Error deleting album: ${error}`);
        }
    }
};