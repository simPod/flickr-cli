Command line interface for Flickr.

Still in development, more edit mode to come.

# Install

```sh
npm install -g flickr-cli
```

# Login

Login is interactive and requires for you to 
grant access rights to your Flickr account. To
trigger the login process, launch:

```sh
flickr login
```

Then follow directions. You need to copy and 
paste a URL into your browser, then grant
access.

Flickr-cli is not designed to work in non-auth'ed
mode for now.

# Upload

```sh
flickr upload filename.jpg otherfile.png somethingelse/*.jpg
```

In the future uploaded files will be added to 
a staging area for management (such as, adding to album, editing
privacy, or sharing)

# Albums

All commands for album management start with: 

```sh
flickr album [command]
```

## Listing all albums

```sh 
flickr album list [--include id title description [...] ] [--noheaders]
```

Returns a list of albums.

- `--include` or `-i` (_optional_) give a list of fields to 
  include in the list. Can be `'*'` to include all. Defaults
  to `title`
- `--noheaders` or `-H` (_optional_) remove field names from
  output.