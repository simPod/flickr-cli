const td = require("testdouble");
const Album = require("../src/commands/Album");

describe("Album command", () => {
    it("should index albums with title by default", async () => {
        const albums = [
            { title: "test", id: "123123" },
            { title: "second", id: "456456" }
        ];
        const flickr = {
            listAlbums: async () => albums
        };
        const config = { logger: td.object(["log"]) };
        const album = new Album(config, flickr);
        await album.exec({ command: Album.Commands.Index, tableFormatOptions: {} });

        for (let album of albums) {
            td.verify(config.logger.log(album.title));
        }
    });

    it("should index albums with specified fields", async () => {
        const albums = [
            { title: "test", id: "123123" },
            { title: "second", id: "456456" }
        ];
        const flickr = {
            listAlbums: async () => albums
        };
        const config = { logger: td.object(["log"]) };

        const album = new Album(config, flickr);
        await album.exec({ command: Album.Commands.Index, tableFormatOptions: { fields: ["title", "id"] } });

        for (let album of albums) {
            td.verify(config.logger.log(`${album.title}\t${album.id}`));
        }
    });

    it("should list content of an album with specified fields", async () => {
        const pics = {
            "1234": [
                { title: "bla", id: "21314" },
                { title: "blerh", id: "p2953405" }
            ],
            "5678": [
                { title: "lsdkfs", id: "1242" }
            ],
            "20943": [
                { title: "dsfsdfg", id: "03ktgo" }
            ]
        };
        const flickr = {
            getAlbumContent: async (albumid) => pics[albumid]
        };
        const config = { logger: td.object(["log"]) };

        const album = new Album(config, flickr);
        await album.exec({ command: Album.Commands.List, albumid: ["1234", "5678"], tableFormatOptions: { fields: '*', separator: ' ' } });

        for (let photo of pics["1234"]) {
            td.verify(config.logger.log(`${photo.title} ${photo.id}`))
        }

        for (let photo of pics["5678"]) {
            td.verify(config.logger.log(`${photo.title} ${photo.id}`))
        }
        td.verify(config.logger.log("title id"), { times: 1 })
    });

    it("should rename album", async () => {
        const albumid = "1234";
        const title = "newname"
        const flickr = td.object(["renameAlbum"]);
        const config = {};
        const album = new Album(config, flickr);

        await album.exec({ command: Album.Commands.Rename, albumid: albumid, title: title });

        td.verify(flickr.renameAlbum(albumid, title));
    });


    it("should reorder albums", async () => {
        const albumids = [1, 3, 2, 4];
        const flickr = td.object(["reorderAlbums"]);
        const config = {};
        const album = new Album(config, flickr);

        await album.exec({ command: Album.Commands.Reorder, albumid: albumids });

        td.verify(flickr.reorderAlbums("1,3,2,4"));
    });


    it("should delete albums", async () => {
        const albumid = "51";
        const flickr = td.object(["deleteAlbum"]);
        const config = {};
        const album = new Album(config, flickr);

        await album.exec({ command: Album.Commands.Delete, albumid: albumid });

        td.verify(flickr.deleteAlbum("51"));
    });

    it("should remove photos from albums", async () => {
        const albumid = "51";
        const photoIds = ["1", "2"];
        const flickr = td.object(["removePhotosFromSet"]);
        const config = {};
        const album = new Album(config, flickr);

        await album.exec({ command: Album.Commands.Remove, albumid: albumid, photoids: photoIds });

        td.verify(flickr.removePhotosFromSet("51", "1,2"));
    });
});