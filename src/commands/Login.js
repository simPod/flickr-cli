class Login {
    constructor(config, flickr) {
        this.config = config;
        this.flickr = flickr;
        this.exec = this.exec.bind(this);
    }

    async exec(args) {
        const token = await this.flickr.login();
        this.config.logger.log(`Logged in as ${token.fullname}`);
        this.config.setToken(token);
    }
}

module.exports = Login;