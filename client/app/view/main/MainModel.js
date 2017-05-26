/**
 * This class is the view model for the Main view of the application.
 */
Ext.define('Spotify.view.main.MainModel', {
	extend  : 'Ext.app.ViewModel',
	requires: [
		'Ext.data.proxy.Ajax',
		'Ext.data.proxy.LocalStorage',
		'Spotify.model.BookmarkedTrack',
		'Spotify.model.PlayedTrack'
	],
	alias   : 'viewmodel.main',

	data: {
		name : 'Spotify',
		// Spotify auth token
		token: ''
	},

	formulas: {
		// check if token is set
		hasToken: function (get) {
			return !(get('token') === '');
		}
	},

	stores: {
		// recently played tracks from Spotify
		playedTracks: {
			model    : 'Spotify.model.PlayedTrack',
			listeners: {
				load: 'onPlayedTracksStoreLoad'
			},
			proxy    : {
				type       : 'ajax',
				url        : '/played',

				extraParams: {
					'token': '{token}'
				},

				reader: {
					rootProperty: 'items'
				}
			}
		},

		// bookmarked tracks persisted in localstorage
		bookmarked  : {
			autoLoad: true,
			storeId : 'bookmarked',
			model   : 'Spotify.model.BookmarkedTrack',
			proxy   : {
				type: 'localstorage',
				id  : 'bookmarked-tracks'
			}
		}
	}

});
