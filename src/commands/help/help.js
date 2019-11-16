const usage = require("command-line-usage");
const CommandLineParser = require("../../commandLineParser");

class Help {
    constructor(config, flickr) {
        this.config = config;
        this.flickr = flickr;
        this.exec = this.exec.bind(this);
    }

    async exec() {
        const options = new CommandLineParser().getOptions();
        const structure = [
            {
                header: 'Flickr command line',
                content: 'Allows you to manage your flickr account from command line.\n\n' +
                    'You need to login before being able to access your own pictures or upload' +
                    'new ones.'
            },
            {
                header: 'Options',
                optionList: options
            }
        ];
        const message = usage(structure);
        this.config.logger.log(message);
    }
}

module.exports = Help;