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

    it("should add -- to first argument if missing", () => {
       const res = parser.parse(makeArgv(["login"]));
       should(res.command).equal(Commands.Login);
    });
    it("should parse help", () => {
        for(const cmd of ["-h", "--help", "--help --login"]){
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
        for(const cmd of [["-l"], ["--login"]]){
            const res = parser.parse(makeArgv(cmd));
            should(res.command).equal(Commands.Login);
        }
    });
    it("should parse upload", () => {
        for(const cmd of [
            ["-u", "123.png", "456.png"],
            ["something", "something", "--upload", "123.png", "456.png"],
            ["-u", "123.png", "--upload", "456.png"],
            ["--upload", "123.png", "456.png", "--anotherThing", "toto"]]){
            const res = parser.parse(makeArgv(cmd));
            should(res.command).equal(Commands.Upload);
            should(res.params.files).have.length(2);
            should(res.params.files).containEql("123.png");
            should(res.params.files).containEql("456.png");
        }
    });

    it("should parse upload album", () => {
        for(const cmd of [
            ["-u", "123.png", "456.png", ],
            ["something", "something", "--upload", "123.png", "456.png"]]){
            const res = parser.parse(makeArgv(cmd));
            should(res.command).equal(Commands.Upload);
            should(res.params.files).have.length(2);
            should(res.params.files).containEql("123.png");
            should(res.params.files).containEql("456.png");
        }
    });

    context("for albums", () => {
        it("should parse album list", () => {
            const res = parser.parse(makeArgv(["album", "list"]));
            should(res.command).equal(Commands.Album);
            should(res.params.command).equal("list");
            should(res.params.include).be.empty();
        });
        it("should parse includes for album list", () => {
            const res = parser.parse(makeArgv(["album", "list", "--include", "title", "id"]));
            should(res.command).equal(Commands.Album);
            should(res.params.command).equal("list");
            should(res.params.include).be.deepEqual(["title", "id"]);
            should(res.params.headers).be.true();
        });
        it("should parse headers for album list", () => {
            const res = parser.parse(makeArgv(["album", "list", "--include", "title", "id", "--noheaders"]));
            should(res.command).equal(Commands.Album);
            should(res.params.command).equal("list");
            should(res.params.include).be.deepEqual(["title", "id"]);
            should(res.params.headers).be.false();
        });
    });
    
});