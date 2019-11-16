const CommandLineParser = require("./src/commandLineParser");
const Configuration = require("./src/infrastructure/configuration");
const FlickrAdapter = require("./src/infrastructure/FlickrAdapter");
const help = require("./src/commands/help/help");

const config = new Configuration();
const flickr = new FlickrAdapter(config);
const parser = new CommandLineParser(config, flickr);

let command;
let returnCode = 0;
try {
    command = parser.parse();
} catch (error) {
    console.error(error.message);
    command = new help(config);
    returnCode = 1;
}
command.exec()
    .then(() => process.exit(returnCode))
    .catch((error) => {
        console.error(error.message);
        process.exit(2);
    });