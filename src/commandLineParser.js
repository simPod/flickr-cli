const commandLineArgs = require('command-line-args');

const optionDefinitions = [
    { name: 'help', alias: 'h', type: Boolean },
    { name: 'login', alias: 'l', type: Boolean },
    { name: 'upload', alias: 'u', type: String, multiple: true },
    { name: 'addToAlbum', alias: "a", type: String, multiple: true}
];

Commands = {
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
        this.parseHelp = this.parseHelp.bind(this);
        this.parseLogin = this.parseLogin.bind(this);
        this.parseUpload = this.parseUpload.bind(this);
        this.makeRes = this.makeRes.bind(this);
        this.parsers = [
            this.parseHelp,
            this.parseLogin,
            this.parseUpload,
        ];
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


    parse(argv)
    {
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