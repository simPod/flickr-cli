const td = require("testdouble");
const album = require("../src/commands/album");

describe("Album command", () => {
    it("should list albums", async () => {
        const albums = [
            { title: "test", id: "123123" },
            { title: "second", id: "456456"}
        ];
        const flickr = {
            listAlbums: async () => albums
        };
        const config = { logger : td.object(["log"]) };

        await album({ command: "list" }, config, flickr);

        for(let album of albums) {
            td.verify(config.logger.log(album.title));
        }
    });
});