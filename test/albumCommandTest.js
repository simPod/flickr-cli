const td = require("testdouble");
const index = require("../src/commands/album/index.js");
const list = require("../src/commands/album/list.js");
const rename = require("../src/commands/album/rename.js");
const reorder = require("../src/commands/album/reorder.js");
const deleteAlbum = require("../src/commands/album/delete.js");
const removePhotos = require("../src/commands/album/removePhotos.js");

describe("Album command", () => {
    it("should index albums with title by default", async () => {
        const albums = [
            { title: "test", id: "123123" },
            { title: "second", id: "456456" }
        ];
        const flickr = {
            listAlbums: async () => albums
        };
        const config = { logger: td.object("log") };
        const formatter = td.object(["format"]);
        td.when(formatter.format(albums)).thenReturn(["123123", "456456"])

        const command = new index(config, flickr, formatter);
        await command.exec();

        td.verify(config.logger.log("123123\n456456"));
    });

    it("should rename album", async () => {
        const albumid = "1234";
        const title = "newname"
        const flickr = td.object(["renameAlbum"]);
        const config = {};
        const album = new rename(config, flickr, { albumId: albumid, title: title });
        await album.exec();
        td.verify(flickr.renameAlbum(albumid, title));
    });


    it("should reorder albums", async () => {
        const albumids = [1, 3, 2, 4];
        const flickr = td.object(["reorderAlbums"]);
        const config = {};
        const command = new reorder(config, flickr, { albumIds: albumids });

        await command.exec();

        td.verify(flickr.reorderAlbums("1,3,2,4"));
    });


    it("should delete albums", async () => {
        const albumids = ["51", "32"];
        const flickr = td.object(["deleteAlbum"]);
        const config = {};
        const command = new deleteAlbum(config, flickr, { albumIds: albumids });

        await command.exec();

        td.verify(flickr.deleteAlbum("51"));
        td.verify(flickr.deleteAlbum("32"));
    });

    it("should remove photos from albums", async () => {
        const albumid = "51";
        const photoIds = ["1", "2"];
        const flickr = td.object(["removePhotosFromSet"]);
        const config = {};
        const command = new removePhotos(config, flickr, { albumId: albumid, photoIds });

        await command.exec();

        td.verify(flickr.removePhotosFromSet("51", "1,2"));
    });
});