const { CommandLineParser } = require("./src/commandLineParser");
const Configuration = require("./src/infrastructure/configuration");
const FlickrAdapter = require("./src/infrastructure/FlickrAdapter");
const getCommandClassName = require("./src/utils/getCommandClassName");

const config = new Configuration();
const flickr = new FlickrAdapter(config);
const parser = new CommandLineParser();
const args = parser.parse();

const Command = require(`./src/commands/${getCommandClassName(args.command)}`);
const command = new Command(config, flickr);
command.exec(args.params)
    .then(() => process.exit());