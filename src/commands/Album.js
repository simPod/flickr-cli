const TableFormat = require("../utils/TableFormat");

class Album {

    static get Commands() {
        return {
            Index: "index",
            List: "list",
            Rename: "rename"
        };
    };

    constructor(config, flickr) {
        this.config = config;
        this.flickr = flickr;
        this.exec = this.exec.bind(this);
        this.indexAlbums = this.indexAlbums.bind(this);
        this.listAlbumContent = this.listAlbumContent.bind(this);
        this.renameAlbum = this.renameAlbum.bind(this);
    }

    async indexAlbums(tableFormat) {
        const albums = await this.flickr.listAlbums();
        tableFormat.format(albums);
    };

    async listAlbumContent(tableFormat, albumIds) {
        let photos = [];
        for (let albumId of albumIds) {
            photos = photos.concat(await this.flickr.getAlbumContent(albumId));
        }
        tableFormat.format(photos);
    }

    async renameAlbum(albumId, title) {
        try {
            await this.flickr.renameAlbum(albumId, title);
        }
        catch (error) {
            console.error(`Error renaming album: ${error}`);
        }
    }

    async exec(params) {
        const tableFormat = new TableFormat((str) => this.config.logger.log(str), {
            fields: (!!params.tableFormatOptions && !!params.tableFormatOptions.fields) ? params.tableFormatOptions.fields : ["title"],
            separator: (!!params.tableFormatOptions && !!params.tableFormatOptions.fields) ? params.tableFormatOptions.separator : '\t',
            includeHeaders: (!!params.tableFormatOptions && !!params.tableFormatOptions.headers) ? params.tableFormatOptions.headers : true
        });

        if (params.command === Album.Commands.Index) {
            await this.indexAlbums(tableFormat);
        }

        if (params.command === Album.Commands.List) {
            await this.listAlbumContent(tableFormat, params.albumid);
        }

        if (params.command === Album.Commands.Rename) {
            await this.renameAlbum(params.albumid, params.title);
        }
    }
}

module.exports = Album;