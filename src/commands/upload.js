const {RetryPolicies, Retry} = require("../utils/retry");


const upload = async (params, config, flickr) => {
    const retry = new Retry(5, 1000, RetryPolicies.exponential, config.logger);
    for (const file of params.files) {
        process.stdout.write(`Uploading ${file} `);
        try {
            const res = await retry.retry(async () => await flickr.upload(file));
            config.logger.log(`photoid: ${res.photoid._content}`);
        }
        catch (error)
        {
            config.logger.error(`Failed to upload ${file}: ${error.message}`);
        }
    }
};

module.exports = upload;