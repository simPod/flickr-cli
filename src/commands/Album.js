class Album {

    constructor(config, flickr) {
        this.config = config;
        this.flickr = flickr;
        this.exec = this.exec.bind(this);
    }

    async exec(params) {
        const isAllFields = (fields) => {
            return fields.length === 1 && fields[0] === "*";
        };

        const getFields = (fields, sampleAlbum) => {
            if (isAllFields(fields)) {
                return Object.keys(sampleAlbum)
            } else {
                return fields;
            }
        };

        const displayHeaders = (mappedFields) => {
            const line = mappedFields.join("\t");
            this.config.logger.log(line);
        };

        const listAlbums = async (fields, includeHeaders = false) => {
            const albums = await this.flickr.listAlbums();
            for (let album of albums) {
                const mappedFields = getFields(fields, album);
                if (includeHeaders) {
                    displayHeaders(mappedFields);
                    includeHeaders = false;
                }
                const fieldsValues = mappedFields.map((field) => album[field]);
                const line = fieldsValues.join("\t");
                this.config.logger.log(line);
            }
        };

        const include = params.include || ["title"];
        if (params.command = 'list') {
            await listAlbums(include, params.headers);
        }
    }
}

module.exports = Album;