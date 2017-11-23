const { CommandLineParser } = require("./src/commandLineParser");
const Configuration = require("./src/configuration");

const config = new Configuration();

const parser = new CommandLineParser();
const args = parser.parse();

const command = require(`./src/commands/${args.command}`);
command(args.params, config)
    .then(() => process.exit());