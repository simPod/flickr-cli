const {RetryPolicies, Retry} = require("../utils/retry");

const retry = new Retry(5, 1000, RetryPolicies.exponential);

const upload = async (params, config, flickr) => {
    for (const file of params.files) {
        process.stdout.write(`Uploading ${file} `);
        try {
            const res = await retry.retry(async () => await flickr.upload(file));
            process.stdout.write(` OK - photoid: ${res.photoid._content}\n`);
        }
        catch (error)
        {
            console.error(`Failed to upload ${file}: ${error.message}`);
        }
    }
};

module.exports = upload;