const td = require("testdouble");
const Login = require("../src/commands/Login");

describe("Login command", () => {
    it("should save token", async () => {
        const token = "123123124";
        const config = td.object(["setToken"]);
        config.logger = td.object(["log"]);

        flickr = { login: () => Promise.resolve(token) };

        const login = new Login(config, flickr);
        await login.exec({});

        td.verify(config.setToken(token))
    });
});