const login = async (args, config, flickr) => {
    const token = await flickr.login();
    config.logger.log(`Logged in as ${token.fullname}`);
    config.setToken(token);
};

module.exports = login;