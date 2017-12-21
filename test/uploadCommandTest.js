const td = require("testdouble");
const Upload = require("../src/commands/Upload");

describe("Upload command", () => {
    it("should upload all files in command line", async () => {
        const flickr = td.object(["upload"]);
        const config = { logger: td.object(["log", "write"]) };

        const files = [1, 2, 3].map((index) => `${index}.jpg`);
        for (file of files) {
            td.when(flickr.upload(file)).thenResolve({photoid:{_content: 123}});
        }

        const upload = new Upload(config, flickr);
        await upload.exec({files});

        for(file of files) {
            td.verify(flickr.upload(file));
        }
    });

    it("should retry 5 times", async function () {
        this.timeout(16000);
        const flickr = td.object(["upload"]);
        const config = { logger: td.object(["error", "log", "write"]) };
        const file = "ljhkjh";
        td.when(flickr.upload(file)).thenReject(Error("bla"));

        const upload = new Upload(config, flickr);
        await upload.exec({files: [file]});

        td.verify(flickr.upload(file), {times: 5});
        td.verify(config.logger.error(`Failed to upload ${file}: bla`));
    });
});