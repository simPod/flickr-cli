const LocalStorage = require('node-localstorage').LocalStorage;
const path = require("path");
const homedir = require("homedir");
const ConsoleLogger = require("./ConsoleLogger");

class Configuration {
    constructor() {
        const storagePath = path.join(homedir(), ".flickrcli");
        this.localStorage = new LocalStorage(storagePath);

        this.logger = new ConsoleLogger();
        this.getToken = this.getToken.bind(this);
        this.setToken = this.setToken.bind(this);
    }

    setToken(token) {
        this.localStorage.setItem("token", JSON.stringify(token));
    }

    getToken() {
        return JSON.parse(this.localStorage.getItem("token"));
    }
}

module.exports = Configuration;