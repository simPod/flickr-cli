const td = require("testdouble");
const Upload = require("../src/commands/upload/upload");

describe("Upload command", () => {
    it("should upload all files in command line", async () => {
        // prepare
        const flickr = td.object(["upload"]);
        const config = { logger: td.object(["log", "write"]) };

        const files = [1, 2, 3].map((index) => `${index}.jpg`);
        for (file of files) {
            td.when(flickr.upload(file)).thenResolve({ photoid: { _content: 123 + file } });
        }

        td.when(flickr.upload(null)).thenResolve({ photoid: { _content: 3424 } });

        // exec
        const upload = new Upload(config, flickr, { files });
        await upload.exec();

        // assert
        for (file of files) {
            td.verify(config.logger.log(`photoid: ${123 + file}`));
        }
    });

    // it("should retry 5 times", async function () {
    //     this.timeout(16000);
    //     const flickr = td.object(["upload"]);
    //     const config = { logger: td.object(["error", "log", "write"]) };
    //     const file = "ljhkjh";
    //     td.when(flickr.upload(file)).thenReject(Error("bla"));

    //     const upload = new Upload(config, flickr, { files: [file] });
    //     await upload.exec();

    //     td.verify(flickr.upload(file), { times: 5 });
    //     td.verify(config.logger.error(`Failed to upload ${file}: bla`));
    // });
});