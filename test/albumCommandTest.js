const td = require("testdouble");
const Album = require("../src/commands/Album");

describe("Album command", () => {
    it("should index albums with title by default", async () => {
        const albums = [
            { title: "test", id: "123123" },
            { title: "second", id: "456456"}
        ];
        const flickr = {
            listAlbums: async () => albums
        };
        const config = { logger : td.object(["log"]) };
        const album = new Album(config, flickr);
        await album.exec({ command: Album.Commands.Index, tableFormatOptions: {} });

        for(let album of albums) {
            td.verify(config.logger.log(album.title));
        }
    });

    it("should index albums with specified fields", async () => {
        const albums = [
            { title: "test", id: "123123" },
            { title: "second", id: "456456"}
        ];
        const flickr = {
            listAlbums: async () => albums
        };
        const config = { logger : td.object(["log"]) };

        const album = new Album(config, flickr);
        await album.exec({ command: Album.Commands.Index, albumid: "1234", tableFormatOptions: { fields: ["title", "id"] } });

        for(let album of albums) {
            td.verify(config.logger.log(`${album.title}\t${album.id}`));
        }
    });

    it("should list content of an album with specified fields", async () => {
        const pics = [
            { title: "bla", id: "21314" },
            { title: "blerh", id: "p2953405"}
        ];
        const flickr = {
            getAlbumContent: async (albumid) => pics
        };
        const config = { logger: td.object( [ "log" ])};

        const album = new Album(config, flickr);
        await album.exec({ command: Album.Commands.List, tableFormatOptions: { fields: '*', separator: ' '}});

        for (let photo of pics) {
            td.verify(config.logger.log(`${photo.title} ${photo.id}`))
        }
    })
});