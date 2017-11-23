const localstorage = require('node-localstorage');
const path = require("path");
const homedir = require("homedir");
const Flickr = require("flickr-sdk");

class Configuration {
    constructor() {
        const storagePath = path.join(homedir(), ".flickrcli");
        var LocalStorage = require('node-localstorage').LocalStorage;
        this.localStorage = new LocalStorage(storagePath);

        this.getToken = this.getToken.bind(this);
        this.setToken = this.setToken.bind(this);
        this.getFlickrAuth = this.getFlickrAuth.bind(this);
        this.key = "9d4245967dab4342323f56e5a3729d4e";
        this.secret = "285ef7f67de72667";
    }

    setToken(token) {
        this.localStorage.setItem("token", JSON.stringify(token));
    }

    getToken() {
        return JSON.parse(this.localStorage.getItem("token"));
    }

    getFlickrAuth() {
        const token = this.getToken();
        const auth = Flickr.OAuth.createPlugin(
            this.key,
            this.secret,
            token.oauth_token,
            token.oauth_token_secret
        );
        return auth;
    }
}

module.exports = Configuration;