const commandLineArgs = require('command-line-args');

const optionDefinitions = [
    { name: 'help', description: "Prints this message", alias: 'h', type: Boolean },
    { name: 'login', description: "Initiate login process", alias: 'l', type: Boolean },
    { name: 'upload', description: "Upload files", typeLabel: '[underline]{file} [file...]', alias: 'u', type: String, multiple: true },
    { name: 'album', description: "CRUD for albums", alias: "a", type: String, multiple: true },
    { name: 'fields', alias: "f", type: String, multiple: true },
    { name: 'noheaders', description: "Do not include headers in a list command", alias: "H", type: Boolean },
    { name: 'separator', description: "Specify row separator", alias: "s", type: String, multiple: false },
    { name: 'albumid', type: String, multiple: false },
    { name: 'title', type: String, multiple: false }
];

Commands = {
    Album: "album",
    Help: "help",
    Login: "login",
    Upload: "upload",
    Unknown: "Unknown"
};

class CommandLineParser {
    constructor() {
        this.getTableFormatOptions = this.getTableFormatOptions.bind(this);
        this.parse = this.parse.bind(this);
        this.parseAlbum = this.parseAlbum.bind(this);
        this.parseHelp = this.parseHelp.bind(this);
        this.parseLogin = this.parseLogin.bind(this);
        this.parseUpload = this.parseUpload.bind(this);
        this.parseSubcommands = this.parseSubcommands.bind(this);

        this.makeRes = this.makeRes.bind(this);
        this.parsers = [
            this.parseAlbum,
            this.parseHelp,
            this.parseLogin,
            this.parseUpload,
        ];
    }

    getOptions() {
        return optionDefinitions;
    }

    makeRes(command, params) {
        return {
            command,
            params: params || {}
        }
    }

    parseHelp(args) {
        if (args.help) {
            return this.makeRes(Commands.Help);
        }
        return null;
    }

    parseLogin(args) {
        if (args.login) {
            return this.makeRes(Commands.Login);
        }
    }

    parseUpload(args) {
        if (args.upload) {
            const params = { files: args.upload, albums: args.addToAlbum };
            return this.makeRes(Commands.Upload, params);
        }
    }

    getTableFormatOptions(args) {
        const fields = args.fields || [];
        const separator = args.separator;
        const headers = args.noheaders !== true;
        return {
            fields,
            separator,
            headers
        }
    }

    removeDashes(str) {
        while (str[0] === '-') {
            str = str.slice(1);
        }
        return str;
    }

    parseSubcommands(args, params) {
        while (args.length > 0) {
            const field = this.removeDashes(args.shift());
            const value = args.shift();
            params[field] = value;
        }
    }

    parseAlbum(args) {
        if (args.album) {
            const command = args.album.shift();
            let params = {
                command
            };
            if (command === "index" || command === "list") {
                params.albumid = args.album || args.albumid;
                params.tableFormatOptions = this.getTableFormatOptions(args);
            }
            if (command === "rename") {
                params.albumid = args.albumid;
                params.title = args.title;
                //this.parseSubcommands(args.album, params);
            }
            return this.makeRes(Commands.Album, params);
        }
    }

    addDashIfMissing(argv) {
        if (argv[2] && argv[2].length > 2 && !argv[2].startsWith("--")) {
            argv[2] = "--" + argv[2];
        }
        return argv;
    }

    parse(argv = process.argv) {
        if (argv.length < 3) {
            return this.makeRes(Commands.Unknown, { unknown: [""] });
        }
        argv = this.addDashIfMissing(argv);
        const options = { argv, partial: true };
        const args = commandLineArgs(optionDefinitions, options);
        for (const parser of this.parsers) {
            const res = parser(args);
            if (res) {
                return res;
            }
        }
        return this.makeRes(Commands.Unknown, { unknown: args._unknown });
    }
}

module.exports = {
    CommandLineParser: CommandLineParser,
    Commands: Commands
};