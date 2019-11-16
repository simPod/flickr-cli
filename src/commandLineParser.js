const yaclip = require('yaclip');
const commandLineParser = yaclip.commandLineParser;
const FormatterFactory = require("./formatter/factory");

const fieldSelector = { name: 'fields', alias: "f", type: String, multiple: true };
const photoIdsSelector = { name: 'photoid', alias: "p", type: String, multiple: true };
const albumIdsSelector = { name: 'albumid', alias: "a", type: String, multiple: true };
const albumIdSelector = { name: 'albumid', alias: "a", type: String, multiple: false };
const titleSelector = { name: 'title', alias: 't', type: String, multiple: false };

const albumSubcommands = [
    { name: 'index', alias: 'i', type: Boolean },
    { name: 'list', alias: 'l', type: String, multiple: true, description: "List photos in albums", typeLabel: '[underline]{albumid,albumid}[,albumid...]' },
    { name: 'delete', alias: 'd', type: Boolean, multiple: false, subcommands: [albumIdsSelector] },
    { name: 'reorder', alias: 'o', type: String, description: "Reorder albums in the specified order", typeLabel: '[underline]{albumid,albumid}[,albumid...]', multiple: true },
    { name: 'remove', alias: 'r', type: Boolean, multiple: false, description: "Remove photos from album", subcommands: [albumIdSelector, photoIdsSelector] },
    { name: 'rename', alias: 'n', type: Boolean, multiple: false, description: "Rename album", subcommands: [albumIdSelector, titleSelector] },
]

const optionDefinitions = [
    { name: 'help', description: "Prints this message", alias: 'h', type: Boolean },
    { name: 'login', description: "Initiate login process", alias: 'l', type: Boolean },
    { name: 'album', description: "CRUD for albums", alias: "a", type: Boolean, subcommands: albumSubcommands },
    { name: 'upload', description: "Upload files", typeLabel: '[underline]{file} [file...]', alias: 'u', type: String, multiple: true },
    { name: 'no-headers', description: "Do not include headers in a list command", alias: "H", type: Boolean },
    { name: 'separator', description: "Specify column separator", alias: "s", type: String, multiple: false },
    { name: 'field', description: "Select fields to be displayed", typeLabel: '[underline]{field name} [field name...]', alias: "f", type: String, multiple: true },
];

class CommandLineParser {
    constructor(config, flickr) {
        this.flickr = flickr;
        this.config = config;
        this.parse = this.parse.bind(this);
        this.parseAlbum = this.parseAlbum.bind(this);
        this.parseHelp = this.parseHelp.bind(this);
        this.parseLogin = this.parseLogin.bind(this);
        this.parseUpload = this.parseUpload.bind(this);
        this.createCommand = this.createCommand.bind(this);

        this.parsers = [
            this.parseAlbum,
            this.parseHelp,
            this.parseLogin,
            this.parseUpload,
        ];

        this.parser = commandLineParser(optionDefinitions, { dashesAreOptional: true });
    }

    getOptions() {
        return optionDefinitions;
    }

    createCommand(command, subcommand, ...params) {
        const CommandClass = require(`./commands/${command}/${subcommand}.js`);
        const commandObject = new CommandClass(this.config, this.flickr, ...params);
        return commandObject;
    }

    getIds(fields) {
        return fields.map(field => {
            if (field.value.indexOf(",") >= 0) {
                return field.value.split(",");
            } else {
                return [field.value];
            }
        }).reduce((arr, curr) => arr.concat(curr), []);
    }

    parseHelp(args) {
        if (args.help) {
            return this.createCommand("help", "help");
        }
        return null;
    }

    parseLogin(args, tableFormat) {
        if (args.login) {
            return this.createCommand("login", "login", tableFormat);
        }
    }

    parseUpload(args) {
        if (args.upload) {
            const params = { files: this.getIds(args.upload), albums: args.addToAlbum };
            return this.createCommand("upload", "upload", params);
        }
    }

    parseAlbum(args, tableFormat) {
        if (args.album) {
            const album = args.album;
            if (album.index) {
                return this.createCommand("album", "index", tableFormat);
            }
            if (album.list) {
                return this.createCommand("album", "list", tableFormat, { albumIds: this.getIds(album.list) })
            }
            if (album.rename) {
                return this.createCommand("album", "rename",
                    { albumId: album.rename.albumid.value, title: album.rename.title.value })
            }
            if (album.reorder) {
                return this.createCommand("album", "reorder",
                    { albumIds: this.getIds(album.reorder) })
            }
            if (album.remove) {
                return this.createCommand("album", "removePhotos",
                    { albumId: album.remove.albumid.value, photoIds: this.getIds(album.remove.photoid) })
            }
            if (album.delete) {
                return this.createCommand("album", "delete",
                    { albumIds: this.getIds(album.delete.albumid) })
            }
            throw new Error(`Not implemented: album.${album}`);
        }
    }

    getFormatter(parsedOptions, parse = false) {
        if (parse) {
            parsedOptions = this.parser(parsedOptions.slice(2));
        }
        const factory = new FormatterFactory();
        return factory.getFormatter("table", parsedOptions);
    }

    parse(argv = process.argv) {
        if (argv.length <= 2) {
            throw new Error("No parameters were given");
        }
        const args = this.parser(argv.slice(2));
        const tableFormat = this.getFormatter(args);
        for (const parser of this.parsers) {
            const res = parser(args, tableFormat);
            if (res) {
                return res;
            }
        }
        throw new Error(`Command unknown: ${argv.join(" ")}`)
    }
}

module.exports = CommandLineParser;