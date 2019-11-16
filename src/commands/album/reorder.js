module.exports = class {
    constructor(config, flickr, { albumIds }) {
        this.flickr = flickr;
        this.albumIds = albumIds;
    }

    async exec() {
        const albumIds = this.albumIds.join(",");
        try {
            await this.flickr.reorderAlbums(albumIds);
        }
        catch (error) {
            console.error(`Error reordering album: ${error}`);
        }
    }
};