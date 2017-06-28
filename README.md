# bookmarks-for-spotify
"Bookmarks for Spotify" allows you to bookmark recently played song or audiobook tracks from Spotify.

App online: https://bookmarks-for-spotify.ws4.be/

Blog Post (en): https://www.sencha.com/blog/full-stack-development-with-ext-js-6-5-bookmarks-for-spotify/

## Features

The app has the following features:

* Authentication against Spotify (auth / logout)
* Show the users currently playing track
* Show the users fifty recently played tracks
* Show the users bookmarked tracks
* Bookmark the currently playing track with time process position
* Bookmark a recently played track
* Open Spotify and start playing a currently playing, recently played or bookmarked track. If the progress time is known it jumps to that position and starts playing from there.

## Technology Stack

* Sencha Ext JS 6.5
* Sencha CMD
* Spotify Web API
* NPM Build and Deploy Process
* Node JS 7.8
* Docker
* Sloppy.io
* therootcause.io


## Setup

checkout

    git clone git@github.com:mrsunshine/bookmarks-for-spotify.git

copy Sencha Ext JS 6.5.0 sources in the folder

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


## Build / Deploy / Run

The build and deployment process is done with **npm**.
Type

    npm run

 to see all available run scripts.


*deploy:prod* will:
 * create a new version
 * build the Sencha app for production
 * create and push git tag
 * build docker image
 * push docker image to docker hub
 * deploy to sloppy.io

Example:

    APP_VERSION=1.2.3 DOMAIN=domain.tdl DOCKERHUB_REPOSITORY=username/repo-name npm run deploy:prod


