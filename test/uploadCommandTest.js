const td = require("testdouble");
const upload = require("../src/commands/upload");

describe("Upload command", () => {
    it("should upload all files in command line", async () => {
        const flickr = td.object(["upload"]);
        const files = [1, 2, 3].map((index) => `${index}.jpg`);
        for (file of files) {
            td.when(flickr.upload(file)).thenResolve({photoid:{_content: 123}});
        }

        await upload({files}, {}, flickr);

        for(file of files) {
            td.verify(flickr.upload(file));
        }
    });
});