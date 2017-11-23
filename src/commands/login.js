const Flickr = require("flickr-sdk");
const readline = require("readline");
const parse = require('url').parse;
const http = require('http');

const asyncReadline = (question) => {
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question(question, (response) => {
            resolve(response);
        });
    });
};

const listenToAnswer = () => {
    return new Promise((resolve) => {
        const server = http.createServer(function (req, res) {
            var url = parse(req.url, true);
            res.write("You can close that tab now.");
            res.end();
            server.close();
            return resolve(url.query.oauth_verifier);
        }).listen(3000);
    });
};

const login = async (args, config) => {
    const key = config.key;
    const secret = config.secret;


    const oauth = Flickr.OAuth(key, secret);
    const res = await oauth.request("http://localhost:3000/");
    var { oauth_token, oauth_token_secret } = res.body;
    console.log(`Go to this URL and authorize the application: ${oauth.authorizeUrl(oauth_token, "write")}`);
    const verifier = await listenToAnswer();
    const verifyRes = await oauth.verify(oauth_token, verifier, oauth_token_secret);
    const { fullname, username, user_nsid } = verifyRes.body;
    oauth_token= verifyRes.body.oauth_token;
    oauth_token_secret = verifyRes.body.oauth_token_secret;
    console.log(`Logged in as ${fullname}`);

    config.setToken({
        fullname,
        oauth_token,
        oauth_token_secret,
        user_nsid,
        username
    });
};

module.exports = login;