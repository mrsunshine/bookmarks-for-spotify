// Requires
var express      = require('express');
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var request      = require('request'); // "Request" library
var querystring  = require('querystring');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var config       = require('./config.json');
var generateRandomString = require('./util/generate-random-string');


// ENV
var env = process.env.NODE_ENV || 'production';

// Spotify
var spotifyClientId      = config.spotifyClientId;
var spotifyClientSecret  = config.spotifyClientSecret;
var spotifyRedirectUri   = config[env].spotifyRedirectUri;
var spotifyStateKey      = 'spotify_auth_state';

// APP

var app = express();
app.use(favicon(path.join(__dirname, config[env].staticDir + '/resources/favicon/', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, config[env].staticDir)));


// Routes start
app.get('/login', function (req, res) {
	var state = generateRandomString(16);
	res.cookie(spotifyStateKey, state);

	// your application requests authorization
	var scope = 'user-read-recently-played user-read-playback-state user-modify-playback-state';
	res.redirect('https://accounts.spotify.com/authorize?' +
		querystring.stringify({
			response_type: 'code',
			client_id    : spotifyClientId,
			scope        : scope,
			redirect_uri : spotifyRedirectUri,
			state        : state,
			show_dialog  : true
		}));
});

app.get('/played', function (req, res) {
	var access_token = req.query.token || null;

	var options = {
		url    : 'https://api.spotify.com/v1/me/player/recently-played?limit=50',
		headers: {'Authorization': 'Bearer ' + access_token},
		json   : true
	};

	// use the access token to access the Spotify Web API
	request.get(options, function (error, response, body) {
		res.setHeader('Content-Type', 'application/json');
		if (!error && response.statusCode === 200) {
			res.send(body);
		} else {
			res.send({
				success: false
			});
		}
	});
});

app.get('/current-playback', function (req, res) {
	var access_token = req.query.token || null;

	var options = {
		url    : 'https://api.spotify.com/v1/me/player',
		headers: {'Authorization': 'Bearer ' + access_token},
		json   : true
	};

	// use the access token to access the Spotify Web API
	request.get(options, function (error, response, body) {
		res.setHeader('Content-Type', 'application/json');
		if (!error && response.statusCode === 200) {
			res.send(body);
		} else {
			res.send({
				success: false
			});
		}
	});
});

app.get('/play-track', function (req, res) {
	var access_token = req.query.token || null;
	var uri = req.query.uri || null;
	var progress_ms = req.query.progress_ms || 0;
	console.log(progress_ms);
	var options = {
		url    : 'https://api.spotify.com/v1/me/player/play',
		headers: {'Authorization': 'Bearer ' + access_token},
		json   : true,
		body: {
			"uris": [uri]
		}
	};

	// use the access token to access the Spotify Web API
	request.put(options, function (error, response, body) {
		res.setHeader('Content-Type', 'application/json');
		console.log('error: ', error);
		console.log('status: ', response.statusCode);
		if (!error && response.statusCode === 204) {
			console.log(progress_ms);
			if (progress_ms) {

				var options = {
					url    : 'https://api.spotify.com/v1/me/player/seek?position_ms=' + progress_ms,
					headers: {'Authorization': 'Bearer ' + access_token},
					json   : true
				};

				// use the access token to access the Spotify Web API
				request.put(options, function (error, response, body) {
					res.setHeader('Content-Type', 'application/json');

					console.log('error: ', error);
					console.log('status: ', response.statusCode);
					if (!error && response.statusCode === 204) {

						res.send({
							success: true
						});
					} else {
						res.send({
							success: false
						});
					}
				});
			} else {
				res.send({
					success: true
				});
			}
		} else {
			res.send({
				success: false
			});
		}
	});
});



app.get('/callback', function (req, res) {

	// your application requests refresh and access tokens
	// after checking the state parameter

	var code        = req.query.code || null;
	var state       = req.query.state || null;
	var storedState = req.cookies ? req.cookies[spotifyStateKey] : null;

	if (state === null || state !== storedState) {
		res.redirect('/#' +
			querystring.stringify({
				error: 'state_mismatch'
			}));
	} else {
		res.clearCookie(spotifyStateKey);
		var authOptions = {
			url    : 'https://accounts.spotify.com/api/token',
			form   : {
				code        : code,
				redirect_uri: spotifyRedirectUri,
				grant_type  : 'authorization_code'
			},
			headers: {
				'Authorization': 'Basic ' + (new Buffer(spotifyClientId + ':' + spotifyClientSecret).toString('base64'))
			},
			json   : true
		};

		request.post(authOptions, function (error, response, body) {
			if (!error && response.statusCode === 200) {

				var access_token  = body.access_token,
						refresh_token = body.refresh_token;

				var options = {
					url    : 'https://api.spotify.com/v1/me',
					headers: {'Authorization': 'Bearer ' + access_token},
					json   : true
				};

				// use the access token to access the Spotify Web API
				request.get(options, function (error, response, body) {
					console.log(body);
				});

				// we can also pass the token to the browser to make requests from there
				res.redirect('/#token/' + access_token);
			} else {
				res.redirect('/#' +
					querystring.stringify({
						error: 'invalid_token'
					}));
			}
		});
	}
});

// Routes end

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err    = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error   = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
