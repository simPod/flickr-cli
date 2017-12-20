const album = async (params, config, flickr) => {

    const listAlbums = async () => {
        const albums = await flickr.listAlbums();
        for (let album of albums) {
            config.logger.log(album.title);
        }
    };

    if (params.command = 'list') {
        await listAlbums();
    }
};

module.exports = album;