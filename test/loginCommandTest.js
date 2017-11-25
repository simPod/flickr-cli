const td = require("testdouble");
const login = require("../src/commands/login");

describe("Login command", () => {
    it("should save token", async () => {
        const token = "123123124";
        const config = td.object(["setToken"]);

        flickr = { login: () => Promise.resolve(token) };

        await login({}, config, flickr);

        td.verify(config.setToken(token))
    });
});