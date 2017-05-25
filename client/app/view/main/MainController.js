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
		'Ext.util.History'
	],

	routes: {
		'token/:token'                  : 'onToken',
		'spotify/recently-played-tracks': 'showSpotifyRecentlyPlayedTracks',
		'spotify/bookmarked'            : 'showSpotifyBookmarked',
		'app/info'                      : 'showAppInfo'
	},

	/**
	 * Lets check if we have a token in localStorage
	 * if so load the track store
	 */
	init() {
		const vm    = this.getViewModel();
		const token = localStorage.getItem('spotify-auth-token') || false;

		if (token) {
			vm.set('token', token);

			Ext.defer(() => {
					const store = vm.getStore('playedTracks');
					store.load();
				},
				300
			);
		}
	},

	/**
	 * On played tracks store load event we check the success
	 *
	 * if we get a false we unset the token and redirect to the start
	 */
	onPlayedTracksStoreLoad(store, records, success) {
		if (!success) {
			const vm = this.getViewModel();
			vm.set('token', '');
			localStorage.setItem('spotify-auth-token', '');
		} else {
			this.markBookmarked();
		}
	},

	/**
	 * Open link to spotify on item tap
	 */
	onItemTap(grid, index, target, record, e) {

		if (e.getTarget('.track-bookmark')) {
			console.log('bookmark');
			const vm    = this.getViewModel();
			const store = vm.getStore('bookmarked');

			record.set('bookmarked', !record.get('bookmarked'));

			if (record.get('bookmarked')) {
				store.add(record);

			} else {
				const recordIndex = store.findExact('id', record.get('id'));
				store.removeAt(recordIndex);
			}
			store.sync();
		}

		if (e.getTarget('.track-play')) {
			console.log('play');
			const vm    = this.getViewModel();
			const token = vm.get('token');

			if (token) {
				Ext.Ajax.request({
					url: '/play-track?token=' + token + '&uri=' + record.get('uri') + '&progress_ms='+ record.get('progress_ms')
				}).then((response, opts) => {
						const obj = Ext.decode(response.responseText);
						console.dir(obj);

						vm.set('currentPlayback', obj);
					},
					(response, opts) => {
						console.log(`server-side failure with status code ${response.status}`);
					});
			}
		}
	},

	/**
	 * Open link to spotify on item tap
	 */
	onBookmarkedItemTap(grid, index, target, record, e) {
		if (e.getTarget('.track-bookmark-icon')) {
			const vm    = this.getViewModel();
			const store = vm.getStore('bookmarked');

			record.set('bookmarked', !record.get('bookmarked'));
			store.remove(record);
			store.sync();
		}
	},

	/**
	 * on token we can load the played tracks store
	 */
	onToken(token) {
		const vm = this.getViewModel();

		vm.set('token', token);
		localStorage.setItem('spotify-auth-token', token);

		Ext.defer(() => {
				const store = vm.getStore('playedTracks');
				store.load();
			},
			300
		);

		this.redirectTo('spotify/recently-played-tracks');

	},

	/**
	 * mark all bookmarked tracks also as bookmarked in the last played track list
	 */
	markBookmarked() {
		const vm              = this.getViewModel();
		const storeBookmarked = vm.getStore('bookmarked');
		const storeTracks     = vm.getStore('playedTracks');

		storeBookmarked.each(item => {
				const record = storeTracks.findRecord('id', item.get('id'));
				if (record) {
					record.set('bookmarked', true);
				}
			},
			this
		);
	},

	/**
	 * redirect to recently played track route if current route is not token
	 */
	onActivateSpotifyRecentlyPlayedTracks() {
		const currentToken = Ext.util.History.getToken();

		if (!Ext.String.startsWith(currentToken, 'token/')) {
			this.redirectTo('spotify/recently-played-tracks');
		}
	},

	showSpotifyRecentlyPlayedTracks() {
		this.activateTab('spotify-recently-played-tracks');
	},

	onActivateSpotifyBookmarked() {
		this.redirectTo('spotify/bookmarked');
	},

	showSpotifyBookmarked() {
		this.activateTab('spotify-bookmarked');
	},

	onActivateAppInfo() {
		this.redirectTo('app/info');
	},

	showAppInfo() {
		this.activateTab('app-info');
	},

	/**
	 * activate tab for a given view reference
	 * @param reference
	 */
	activateTab(reference) {
		const tabPanel = this.lookup('main-tabpanel');
		const tab      = this.lookup(reference);

		if (tabPanel.getActiveItem() !== tab) {
			tabPanel.setActiveItem(tab);
		}
	},

	/**
	 * @param {Ext.dom.Element} component
	 */
	onTabPanelPainted(component) {
		const vm              = this.getViewModel();
		const storeBookmarked = vm.getStore('bookmarked');

		storeBookmarked.on('datachanged', this.updateBookmarkedTabBadgeText, this);

		this.updateBookmarkedTabBadgeText();
	},

	/**
	 * update badge text of the bookmarked tab
	 */
	updateBookmarkedTabBadgeText() {
		const vm              = this.getViewModel();
		const storeBookmarked = vm.getStore('bookmarked');
		const count           = storeBookmarked.getCount();
		const view            = this.lookup('spotify-bookmarked');

		view.tab.setBadgeText(count);
	},

	onSpotifyLogout() {
		const vm = this.getViewModel();

		vm.set('token', '');
		localStorage.setItem('spotify-auth-token', '');

		Ext.defer(() => {
				const store = vm.getStore('playedTracks');
				store.load();
			},
			300
		);

		this.redirectTo('spotify/recently-played-tracks');
	}
});
