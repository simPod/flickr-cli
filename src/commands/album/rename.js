module.exports = class {
    constructor(config, flickr, { albumId, title }) {
        this.flickr = flickr;
        this.albumId = albumId;
        this.title = title;
    }

    async exec() {
        try {
            await this.flickr.renameAlbum(this.albumId, this.title);
        }
        catch (error) {
            console.error(`Error renaming album: ${error}`);
        }
    }
};