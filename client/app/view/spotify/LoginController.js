/**
 * Created by dkd-dehl on 21/04/2017.
 */
Ext.define('Spotify.view.spotify.LoginController', {
	extend: 'Ext.app.ViewController',
	alias : 'controller.spotify-login',

	routes: {
		'spotify/login': 'doSpotifyLogin'
	},

	/**
	 * redirect to spotify login
	 */
	onSpotifyLogin: function () {
		this.redirectTo('spotify/login');
	},

	/**
	 * trigger spotify login
	 */
	doSpotifyLogin: function () {
		location.href = '/login';
	}
});
