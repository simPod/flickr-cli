const should = require("should");

const CommandLineParser = require("../src/commandLineParser");

describe("Command line parser", () => {

    const makeArgv = (args) => {
        const res = ["node", "/something/stuff"];
        for (arg of args) {
            res.push(arg);
        }
        return res;
    };

    const createParser = () => {
        const flickr = {};
        const config = {};
        const parser = new CommandLineParser(config, flickr);
        return {
            flickr,
            config,
            parser,
            checkRes: (res) => {
                should(res.flickr = flickr)
                should(res.config = config)
            }
        }
    }

    context("options", () => {
        it("should get fields", () => {
            const parserAndFakes = createParser();
            const res = parserAndFakes.parser.getFormatter(makeArgv(["album", "index", "--field", "name,id"]), true);
            should(res).be.instanceOf(require("../src/formatter/TableFormat"));
            should(res.config.fields).be.deepEqual(["name", "id"]);
            should(res.config.displayHeaders).be.true();
            parserAndFakes.checkRes(res);
        });
        it("should parse headers for album index", () => {
            const parserAndFakes = createParser();
            const res = parserAndFakes.parser.getFormatter(makeArgv(["album", "index", "-f", "sdf", "-f", "id", "--no-headers"]), true);
            should(res).be.instanceOf(require("../src/formatter/TableFormat"));
            should(res.config.fields).be.deepEqual(["sdf", "id"]);
            should(res.config.displayHeaders).be.false();
            parserAndFakes.checkRes(res);
        });
        it("should parse without dashes", () => {
            const parserAndFakes = createParser();
            const res = parserAndFakes.parser.parse(makeArgv(["login"]));
            should(res).be.instanceOf(require("../src/commands/login/login.js"));
            parserAndFakes.checkRes(res);
        });
    })

    context("Unknown or missing", () => {
        it('should return Unknown when no params are given', () => {
            const parserAndFakes = createParser();
            should(() => parserAndFakes.parser.parse(makeArgv([]))).throw("No parameters were given")
        });
        it("should return Unknown", () => {
            const parserAndFakes = createParser();
            should(() => parserAndFakes.parser.parse(makeArgv(["--jkjkl"]))).throw("Unknown command: --jkjkl");
        });
    });

    context("various commands", () => {

        it("should parse help", () => {
            for (const cmd of ["-h", "--help"]) {
                const parserAndFakes = createParser();
                const res = parserAndFakes.parser.parse(makeArgv([cmd]));
                should(res).be.instanceOf(require("../src/commands/help/help.js"));
                parserAndFakes.checkRes(res);
            }
        });
        it("should parse login", () => {
            for (const cmd of [["-l"], ["--login"]]) {
                const parserAndFakes = createParser();
                const res = parserAndFakes.parser.parse(makeArgv(cmd));
                should(res).be.instanceOf(require("../src/commands/login/login.js"));
                parserAndFakes.checkRes(res);
            }
        });
        it("should parse upload", () => {
            for (const cmd of [
                ["-u", "123.png", "--upload", "456.png"],
                ["--upload", "123.png", "-u", "456.png"]]) {
                const parserAndFakes = createParser();
                const res = parserAndFakes.parser.parse(makeArgv(cmd));
                should(res).be.instanceOf(require("../src/commands/upload/upload"));
                should(res.params.files).have.length(2);
                should(res.params.files).containEql("123.png");
                should(res.params.files).containEql("456.png");
                parserAndFakes.checkRes(res);
            }
        });
    });

    context("for albums", () => {
        it("should parse album index", () => {
            const parserAndFakes = createParser();
            const res = parserAndFakes.parser.parse(makeArgv(["album", "index"]));
            should(res).be.instanceOf(require("../src/commands/album/index"));
            parserAndFakes.checkRes(res);
        });
        it("should parse album list", () => {
            const parserAndFakes = createParser();
            const res = parserAndFakes.parser.parse(makeArgv(["album", "list", "1234", "--list", "4567", "-f", "title,id", "--no-headers"]));
            should(res).be.instanceOf(require("../src/commands/album/list"));
            should(res.albumIds).deepEqual(["1234", "4567"]);
            should(res.format.config.fields).be.deepEqual(["title", "id"]);
            should(res.format.config.displayHeaders).be.false();
            parserAndFakes.checkRes(res);
        });

        it("should parse rename", () => {
            const cmd = ["album", "rename", "--albumid", "newid", "--title", "newname"];
            const parserAndFakes = createParser();
            const res = parserAndFakes.parser.parse(makeArgv(cmd));
            should(res).be.instanceOf(require("../src/commands/album/rename"));
            should(res.title).equal("newname");
            should(res.albumId).equal("newid");
            parserAndFakes.checkRes(res);
        });

        it("should read reorder from command line", () => {
            const cmd = ["album", "reorder", "1,3", "--reorder", "2,4"];
            const parserAndFakes = createParser();
            const res = parserAndFakes.parser.parse(makeArgv(cmd));
            should(res).be.instanceOf(require("../src/commands/album/reorder"));
            should(res.albumIds).deepEqual(["1", "3", "2", "4"]);
            parserAndFakes.checkRes(res);
        });

        it("should parse delete", () => {
            const cmd = ["album", "delete", "--albumid", "1", "--albumid", "3,2", "--albumid", "4"];
            const parserAndFakes = createParser();
            const res = parserAndFakes.parser.parse(makeArgv(cmd));
            should(res).be.instanceOf(require("../src/commands/album/delete"));
            should(res.albumIds).deepEqual(["1", "3", "2", "4"]);
            parserAndFakes.checkRes(res);
        });

        it("should read remove photos from command line", () => {
            const cmd = ["album", "remove", "--albumid", "12", "--photoid", "3,2", "--photoid", "4"];
            const parserAndFakes = createParser();
            const res = parserAndFakes.parser.parse(makeArgv(cmd));
            should(res).be.instanceOf(require("../src/commands/album/removePhotos"));
            should(res.albumId).equal("12");
            should(res.photoIds).deepEqual(["3", "2", "4"]);
            parserAndFakes.checkRes(res);
        });
    });

});