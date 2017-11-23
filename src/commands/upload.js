const Flickr = require("flickr-sdk");
const path = require("path");

const upload = async (params, config) => {
    const auth = config.getFlickrAuth();
    for (const file of params.files) {
        process.stdout.write(`Uploading ${file} `);
        try {
            const upload = new Flickr.Upload(auth, file, { title: file });
            const res = await upload;
            process.stdout.write(` OK - photoid: ${res.body.photoid._content}\n`);
        }
        catch (error)
        {
            console.error(error);
        }
    }
};

module.exports = upload;