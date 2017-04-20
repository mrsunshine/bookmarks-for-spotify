/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('Spotify.view.main.MainController', {
	extend: 'Ext.app.ViewController',

	alias: 'controller.main',

	requires: [
		'Ext.util.History',
		'Spotify.model.BookmarkedTrack'
	],

	routes: {
		'token/:token'                  : 'onToken',
		'spotify/login'                 : 'doSpotifyLogin',
		'spotify/recently-played-tracks': 'showSpotifyRecentlyPlayedTracks',
		'spotify/bookmarked'            : 'showSpotifyBookmarked',
		'app/info'                      : 'showAppInfo'
	},

	/**
	 * Lets check if we have a token in localStorage
	 * if so load the track store
	 */
	init: function () {
		var vm    = this.getViewModel();
		var token = localStorage.getItem('spotify-auth-token') || false;

		if (token) {
			vm.set('token', token);

			Ext.defer(function () {
				var store = vm.getStore('playedTracks');
				store.load();
			}, 300);

		}
	},

	/**
	 * On played tracks store load event we check the success
	 *
	 * if we get a false we unset the token and redirect to the start
	 */
	onPlayedTracksStoreLoad: function (store, records, success) {
		if (!success) {
			var vm = this.getViewModel();
			vm.set('token', '');
			localStorage.setItem('spotify-auth-token', '');
		} else {
			this.markBookmarked();
		}
	},

	/**
	 * Open link to spotify on item tap
	 */
	onItemTap: function (grid, index, target, record, e) {
		if (e.getTarget('.track-bookmark-icon')) {
			var vm    = this.getViewModel();
			var store = vm.getStore('bookmarked');

			record.set('bookmarked', !record.get('bookmarked'));

			if (record.get('bookmarked')) {
				store.add(record);

			} else {
				var recordIndex = store.findExact('id', record.get('id'));
				store.removeAt(recordIndex);
			}
			store.sync();
		} else {
			window.open(record.get('link', '_blank'));
		}
	},

	/**
	 * On item disclosure tap open spotify track link
	 *
	 * @param list
	 * @param record
	 */
	onItemDisclosureHandler: function (list, record) {
		window.open(record.get('link', '_blank'));
	},

	/**
	 * Open link to spotify on item tap
	 */
	onBookmarkedItemTap: function (grid, index, target, record, e) {
		if (e.getTarget('.track-bookmark-icon')) {
			var vm    = this.getViewModel();
			var store = vm.getStore('bookmarked');

			record.set('bookmarked', !record.get('bookmarked'));
			store.remove(record);
			store.sync();
		}
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
	},

	/**
	 * on token we can load the played tracks store
	 */
	onToken: function (token) {
		var vm = this.getViewModel();

		vm.set('token', token);
		localStorage.setItem('spotify-auth-token', token);

		Ext.defer(function () {
			var store = vm.getStore('playedTracks');
			store.load();
		}, 300);

		this.redirectTo('spotify/recently-played-tracks');

	},

	/**
	 * mark all bookmarked tracks also as bookmarked in the last played track list
	 */
	markBookmarked: function () {
		var vm              = this.getViewModel();
		var storeBookmarked = vm.getStore('bookmarked');
		var storeTracks     = vm.getStore('playedTracks');

		storeBookmarked.each(function (item) {
			var record = storeTracks.findRecord('id', item.get('id'));
			if (record) {
				record.set('bookmarked', true);
			}
		}, this);
	},

	/**
	 * redirect to recently played track route if current route is not token
	 */
	onActivateSpotifyRecentlyPlayedTracks: function () {
		var currentToken = Ext.util.History.getToken();

		if (!Ext.String.startsWith(currentToken, 'token/')) {
			this.redirectTo('spotify/recently-played-tracks');
		}
	},

	showSpotifyRecentlyPlayedTracks: function () {
		this.activateTab('spotify-recently-played-tracks');
	},

	onActivateSpotifyBookmarked: function () {
		this.redirectTo('spotify/bookmarked');
	},

	showSpotifyBookmarked: function () {
		this.activateTab('spotify-bookmarked');
	},

	onActivateAppInfo: function () {
		this.redirectTo('app/info');
	},

	showAppInfo: function () {
		this.activateTab('app-info');
	},

	/**
	 * activate tab for a given view reference
	 * @param reference
	 */
	activateTab: function (reference) {
		var tabPanel = this.lookup('main-tabpanel');
		var tab      = this.lookup(reference);

		if (tabPanel.getActiveItem() !== tab) {
			tabPanel.setActiveItem(tab);
		}
	},

	/**
	 * @param {Ext.dom.Element} component
	 */
	onTabPanelPainted: function (component) {
		var vm              = this.getViewModel();
		var storeBookmarked = vm.getStore('bookmarked');

		storeBookmarked.on('datachanged', this.updateBookmarkedTabBadgeText, this);

		this.updateBookmarkedTabBadgeText();
	},

	/**
	 * update badge text of the bookmarked tab
	 */
	updateBookmarkedTabBadgeText: function() {
		var vm              = this.getViewModel();
		var storeBookmarked = vm.getStore('bookmarked');
		var count = storeBookmarked.getCount();
		var view = this.lookup('spotify-bookmarked');

		view.tab.setBadgeText(count);
	}
});
