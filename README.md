# bookmarks-for-spotify
"Bookmarks for Spotify" allows you to bookmark recently played song or audiobook tracks from Spotify.

App online: https://bookmarks-for-spotify.ws4.be/

Uses:
* Sencha Ext JS 6.2
* Sencha CMD
* Spotify Web API
* Node JS 7.8
* Docker
* Sloppy.io
* therootcause.io


## Setup

checkout

    git clone git@github.com:mrsunshine/bookmarks-for-spotify.git

copy Sencha Ext JS 6.2.1 sources in the folder

    client/ext/

node package dependencies

    npm install

## Config

create config.json and adjust values

    cp config.json.example config.json

## Local development

Sencha app watch on the client folder (Terminal 1)

    cd client
    sencha-6.5.0.180 app watch

Start local node server (Terminal 2)

    NODE_ENV=development node bin/www.js


## Build and deploy

The build and deployment is done by the makefile.

    Makefile

Make all will:
 * create a new version
 * build the Sencha app for production
 * create and push git tag
 * build docker image
 * push docker image to docker hub
 * deploy to sloppy.io

Example:

    make all version=1.2.3 domain=domain.tdl dockerhub-repository=user/repository-name

