const login = async (args, config, flickr) => {
    const token = await flickr.login();
    console.log(`Logged in as ${token.fullname}`);
    config.setToken(token);
};

module.exports = login;