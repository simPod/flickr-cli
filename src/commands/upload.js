const upload = async (params, config, flickr) => {
    for (const file of params.files) {
        process.stdout.write(`Uploading ${file} `);
        try {
            const res = await flickr.upload(file);
            process.stdout.write(` OK - photoid: ${res.photoid._content}\n`);
        }
        catch (error)
        {
            console.error(error);
        }
    }
};

module.exports = upload;