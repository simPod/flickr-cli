const localstorage = require('node-localstorage');
const path = require("path");
const homedir = require("homedir");

class Configuration {
    constructor() {
        const storagePath = path.join(homedir(), ".flickrcli");
        var LocalStorage = require('node-localstorage').LocalStorage;
        this.localStorage = new LocalStorage(storagePath);

        this.getToken = this.getToken.bind(this);
        this.setToken = this.setToken.bind(this);
        this.getFlickrAuth = this.getFlickrAuth.bind(this);
    }

    setToken(token) {
        this.localStorage.setItem("token", JSON.stringify(token));
    }

    getToken() {
        return JSON.parse(this.localStorage.getItem("token"));
    }
}

module.exports = Configuration;