const Flickr = require("flickr-sdk");
const parse = require('url').parse;
const http = require('http');

class FlickrAdapter {
    constructor(configuration) {
        this.key = "9d4245967dab4342323f56e5a3729d4e";
        this.secret = "285ef7f67de72667";
        this.configuration = configuration;

        this.getFlickrAuth = this.getFlickrAuth.bind(this);
        this.upload = this.upload.bind(this);
        this.login = this.login.bind(this);
    }

    getFlickrAuth() {
        const token = this.configuration.getToken();
        const auth = Flickr.OAuth.createPlugin(
            this.key,
            this.secret,
            token.oauth_token,
            token.oauth_token_secret
        );
        return auth;
    }

    async login() {
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

        const oauth = Flickr.OAuth(this.key, this.secret);
        const res = await oauth.request("http://localhost:3000/");
        const { oauth_token, oauth_token_secret } = res.body;
        this.configuration.logger.log(`Go to this URL and authorize the application: ${oauth.authorizeUrl(oauth_token, "write")}`);
        const verifier = await listenToAnswer();
        const verifyRes = await oauth.verify(oauth_token, verifier, oauth_token_secret);
        const token = verifyRes.body;
        return token;
    }

    async upload(file) {
        const auth = this.getFlickrAuth();
        const upload = new Flickr.Upload(auth, file, { title: file });
        const res = await upload;
        return res.body;
    }

    async listAlbums() {
        const generateFieldFlattener = (field) => (entry) => {
            entry[field] = entry[field]["_content"];
            return entry;
        };
        const auth = this.getFlickrAuth();
        const flickr = new Flickr(auth);
        const res = await flickr.photosets.getList();
        const list = res.body.photosets.photoset;
        const flattenedList = list
            .map(generateFieldFlattener("title"))
            .map(generateFieldFlattener("description"));
        return flattenedList;
    }

    async getAlbumContent(albumId) {
        const generateFieldFlattener = (field) => (entry) => {
            entry[field] = entry[field]["_content"];
            return entry;
        };
        const auth = this.getFlickrAuth();
        const flickr = new Flickr(auth);
        const res = await flickr.photosets.getPhotos({ photoset_id: albumId, user_id: auth.user_id });
        const list = res.body.photoset.photo;
        const flattenedList = list;
        return flattenedList;
    }

    async renameAlbum(albumId, title) {
        console.log(`Renaming album ${albumId} to ${title}`);
        const auth = this.getFlickrAuth();
        const flickr = new Flickr(auth);
        await flickr.photosets.editMeta({ api_key: this.key, photoset_id: albumId, title: title });
    }
}

module.exports = FlickrAdapter;