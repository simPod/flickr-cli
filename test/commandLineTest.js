const should = require("should");
const { CommandLineParser, Commands } = require("../src/commandLineParser");

describe("Command line parser", () => {
    const parser = new CommandLineParser();
    it("should add -- to first argument if missing", () => {
       const res = parser.parse("login");
       should(res.command).equal(Commands.Login);
    });
    it("should parse help", () => {
        for(const cmd of ["-h", "--help", "--help --login"]){
            const res = parser.parse(cmd);
            should(res.command).equal(Commands.Help);
        }
    });
    it("should return unknown", () => {
        const res = parser.parse("jkjkl");
        should(res.command).equal(Commands.Unknown);
        should(res.params.unknown).containEql("jkjkl");
    });
    it("should parse login", () => {
        for(const cmd of ["-l", "--login"]){
            const res = parser.parse(cmd);
            should(res.command).equal(Commands.Login);
        }
    });
    it("should parse upload", () => {
        for(const cmd of [
            ["-u", "123.png", "456.png"],
            ["something", "something", "--upload", "123.png", "456.png"],
            ["-u", "123.png", "--upload", "456.png"],
            ["--upload", "123.png", "456.png", "--anotherThing", "toto"]]){
            const res = parser.parse(cmd);
            should(res.command).equal(Commands.Upload);
            should(res.params.files).have.length(2);
            should(res.params.files).containEql("123.png");
            should(res.params.files).containEql("456.png");
        }
    });

    it("should parse upload album", () => {
        for(const cmd of [
            ["-u", "123.png", "456.png", "--addToAlbum", "1231234", "456456"],
            ["something", "something", "--upload", "123.png", "456.png", "-a", "1231234", "-a", "456456"]]){
            const res = parser.parse(cmd);
            should(res.command).equal(Commands.Upload);
            should(res.params.files).have.length(2);
            should(res.params.files).containEql("123.png");
            should(res.params.files).containEql("456.png");
            should(res.params.albums).have.length(2);
            should(res.params.albums).containEql("1231234");
            should(res.params.albums).containEql("456456");
        }
    });
    
});