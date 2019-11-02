const TableFormat = require("../utils/TableFormat");

class Album {

    static get Commands() {
        return {
            Index: "index",
            List: "list",
            Rename: "rename",
            Reorder: "reorder",
            Delete: "delete",
            Remove: "remove"
        };
    };

    constructor(config, flickr) {
        this.config = config;
        this.flickr = flickr;
        this.exec = this.exec.bind(this);
        this.indexAlbums = this.indexAlbums.bind(this);
        this.listAlbumContent = this.listAlbumContent.bind(this);
        this.renameAlbum = this.renameAlbum.bind(this);
        this.reorderAlbum = this.reorderAlbum.bind(this);
        this.deleteAlbum = this.deleteAlbum.bind(this);
        this.removePhotosFromSet = this.removePhotosFromSet.bind(this);
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

    async deleteAlbum(albumId) {
        try {
            await this.flickr.deleteAlbum(albumId);
        }
        catch (error) {
            console.error(`Error deleting album: ${error}`);
        }
    }
    async reorderAlbum(albumIds) {
        try {
            await this.flickr.reorderAlbums(albumIds);
        }
        catch (error) {
            console.error(`Error reordering album: ${error}`);
        }
    }

    async removePhotosFromSet(albumId, photoIds) {
        try {
            const ids = photoIds.join(",");
            await this.flickr.removePhotosFromSet(albumId, ids);
        }
        catch (error) {
            console.error(`Error reordering album: ${error}`);
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
        if (params.command === Album.Commands.Delete) {
            await this.deleteAlbum(params.albumid);
        }
        if (params.command === Album.Commands.Remove) {
            await this.removePhotosFromSet(params.albumid, params.photoids);
        }
        if (params.command === Album.Commands.Reorder) {
            const albumids = params.albumid.join(",")
            await this.reorderAlbum(albumids);
        }
    }
}

module.exports = Album;