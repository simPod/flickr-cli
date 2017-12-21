const TableFormat = require("../utils/TableFormat");

class Album {

    constructor(config, flickr) {
        this.config = config;
        this.flickr = flickr;
        this.exec = this.exec.bind(this);
    }

    async exec(params) {

        const tableFormat = new TableFormat((str) => this.config.logger.log(str), {
            fields: params.include || ["title"],
            includeHeaders: params.headers
        });

        const listAlbums = async () => {
            const albums = await this.flickr.listAlbums();
            tableFormat.format(albums);
        };

        if (params.command = 'list') {
            await listAlbums();
        }
    }
}

module.exports = Album;