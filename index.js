const { CommandLineParser } = require("./src/commandLineParser");
const Configuration = require("./src/infrastructure/configuration");
const FlickrAdapter = require("./src/infrastructure/FlickrAdapter");

const config = new Configuration();
const flickr = new FlickrAdapter(config);
const parser = new CommandLineParser();
const args = parser.parse();

const command = require(`./src/commands/${args.command}`);
command(args.params, config, flickr)
    .then(() => process.exit());