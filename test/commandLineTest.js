const should = require("should");
const { CommandLineParser, Commands } = require("../src/commandLineParser");

describe("Command line parser", () => {
    const parser = new CommandLineParser();

    const makeArgv = (args) => {
        const res = ["node", "/something/stuff"];
        for (arg of args) {
            res.push(arg);
        }
        return res;
    };

    it("should parse without dashes", () => {
        const res = parser.parse(makeArgv(["login"]));
        should(res.command).equal(Commands.Login);
    });
    it("should parse help", () => {
        for (const cmd of ["-h", "--help"]) {
            const res = parser.parse(makeArgv([cmd]));
            should(res.command).equal(Commands.Help);
        }
    });
    it('should return Unknown when no params are given', () => {
        const res = parser.parse(makeArgv([]));
        should(res.command).equal(Commands.Unknown);
    });
    it("should return Unknown", () => {
        const res = parser.parse(makeArgv(["--jkjkl"]));
        should(res.command).equal(Commands.Unknown);
        should(res.params.unknown).containEql("--jkjkl");
    });
    it("should parse login", () => {
        for (const cmd of [["-l"], ["--login"]]) {
            const res = parser.parse(makeArgv(cmd));
            should(res.command).equal(Commands.Login);
        }
    });
    it("should parse upload", () => {
        for (const cmd of [
            ["-u", "123.png", "456.png"],
            //["something", "something", "--upload", "123.png", "456.png"],
            ["-u", "123.png", "456.png"],
            ["--upload", "123.png", "456.png"]]) {
            const res = parser.parse(makeArgv(cmd));
            should(res.command).equal(Commands.Upload);
            should(res.params.files).have.length(2);
            should(res.params.files).containEql("123.png");
            should(res.params.files).containEql("456.png");
        }
    });

    it("should parse upload album", () => {
        for (const cmd of [
            ["-u", "123.png", "456.png",],
            ["--upload", "123.png", "456.png"]]) {
            const res = parser.parse(makeArgv(cmd));
            should(res.command).equal(Commands.Upload);
            should(res.params.files).have.length(2);
            should(res.params.files).containEql("123.png");
            should(res.params.files).containEql("456.png");
        }
    });


    context("for albums", () => {
        it("should parse album index", () => {
            const res = parser.parse(makeArgv(["album", "index"]));
            should(res.command).equal(Commands.Album);
            should(res.params.command).equal("index");
            should(res.params.tableFormatOptions.fields).be.empty();
        });
        it("should parse fields for album index", () => {
            const res = parser.parse(makeArgv(["album", "index", "--fields", "title", "id"]));
            should(res.command).equal(Commands.Album);
            should(res.params.command).equal("index");
            should(res.params.tableFormatOptions.fields).be.deepEqual(["title", "id"]);
            should(res.params.tableFormatOptions.headers).be.true();
        });
        it("should parse headers for album index", () => {
            const res = parser.parse(makeArgv(["album", "index", "-f", "title", "id", "--noheaders"]));
            should(res.command).equal(Commands.Album);
            should(res.params.command).equal("index");
            should(res.params.tableFormatOptions.fields).be.deepEqual(["title", "id"]);
            should(res.params.tableFormatOptions.headers).be.false();
        });
        it("should retrieve album id for album list", () => {
            const res = parser.parse(makeArgv(["album", "list", "1234", "4567", "-f", "title", "id", "--noheaders"]));
            should(res.command).equal(Commands.Album);
            should(res.params.command).equal("list");
            should(res.params.albumid).deepEqual(["1234", "4567"]);
            should(res.params.tableFormatOptions.fields).be.deepEqual(["title", "id"]);
            should(res.params.tableFormatOptions.headers).be.false();
        });

        it("should read albumid and title from command line", () => {
            const cmd = ["album", "rename", "--title", "newname", "--albumid", "newid"];
            const res = parser.parse(makeArgv(cmd));
            should(res.command).equal(Commands.Album);
            should(res.params.command).equal("rename");
            should(res.params.title).equal("newname");
            should(res.params.albumid).equal("newid");
        });


        it("should read reorder from command line", () => {
            const cmd = ["album", "reorder", "1", "3", "2", "4"];
            const res = parser.parse(makeArgv(cmd));
            should(res.command).equal(Commands.Album);
            should(res.params.command).equal("reorder");
            should(res.params.albumid).deepEqual(["1", "3", "2", "4"]);
        });


        it("should read delete from command line", () => {
            const cmd = ["album", "delete", "1", "3", "2", "4"];
            const res = parser.parse(makeArgv(cmd));
            should(res.command).equal(Commands.Album);
            should(res.params.command).equal("delete");
            should(res.params.albumid).deepEqual(["1", "3", "2", "4"]);
        });
    });

});