const {RetryPolicies, Retry} = require("../utils/retry");

class Upload {

    constructor(config, flickr) {
        this.config = config;
        this.flickr = flickr;
        this.exec = this.exec.bind(this);
    }

    async exec(params) {
        const retry = new Retry(5, 1000, RetryPolicies.exponential, this.config.logger);
        for (const file of params.files) {
            this.config.logger.write(`Uploading ${file} `);
            try {
                const res = await retry.retry(async () => await this.flickr.upload(file));
                this.config.logger.log(`photoid: ${res.photoid._content}`);
            }
            catch (error) {
                this.config.logger.error(`Failed to upload ${file}: ${error.message}`);
            }
        }
    }
}

module.exports = Upload;