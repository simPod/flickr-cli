const commandLineArgs = require('command-line-args');

const optionDefinitions = [
    { name: 'help', description: "Prints this message", alias: 'h', type: Boolean },
    { name: 'login', description: "Initiate login process", alias: 'l', type: Boolean },
    { name: 'upload', description: "Upload files", typeLabel: '[underline]{file} [file...]', alias: 'u', type: String, multiple: true },
    { name: 'album', alias: "a", type: String, multiple: true },
    { name: 'include', alias: "i", type: String, multiple: true}
];

Commands = {
    Album: "album",
    Help: "help",
    Login: "login",
    Upload: "upload",
    Unknown: "unknown"
};

class CommandLineParser
{
    constructor()
    {
        this.parse = this.parse.bind(this);
        this.parseAlbum = this.parseAlbum.bind(this);
        this.parseHelp = this.parseHelp.bind(this);
        this.parseLogin = this.parseLogin.bind(this);
        this.parseUpload = this.parseUpload.bind(this);
        this.makeRes = this.makeRes.bind(this);
        this.parsers = [
            this.parseAlbum,
            this.parseHelp,
            this.parseLogin,
            this.parseUpload,
        ];
    }

    getOptions(){
        return optionDefinitions;
    }

    makeRes(command, params){
        return {
            command,
            params: params || {}
        }
    }

    parseHelp(args){
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

    parseAlbum(args) {
        if (args.album) {
            const include = args.include || [];
            const params = {
                command: args.album[0],
                include
            };
            return this.makeRes(Commands.Album, params);
        }
    }

    addDashIfMissing(argv) {
        if (argv[2] && argv[2].length > 2 && !argv[2].startsWith("--")) {
            argv[2] = "--" + argv[2];
        }
        return argv;
    }

    parse(argv = process.argv)
    {
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