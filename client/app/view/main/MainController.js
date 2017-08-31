/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 *
 */
Ext.define('Spotify.view.main.MainController', {
	extend: 'Ext.app.ViewController',

	alias: 'controller.main',

	requires: [
		'Ext.util.History',
		'Spotify.model.BookmarkedTrack',
		'Spotify.util.Format'
	],

	routes: {
		'token/:token'                  : 'onToken',
		'spotify/recently-played-tracks': 'showSpotifyRecentlyPlayedTracks',
		'spotify/bookmarked'            : 'showSpotifyBookmarked',
		'app/info'                      : 'showAppInfo'
	},

	listen: {
		controller: {
			'*': {
				bookmarkCurrentTrack: 'onBookmarkCurrentTrack',
				playCurrentTrack    : 'onPlayCurrentTrack'
			}
		}
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
	 * Open link to Spotify on item tap
	 */
	onItemTap(grid, index, target, record, e) {
		// Bookmark track
		if (e.getTarget('.track-bookmark')) {
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
		// start playback track
		if (e.getTarget('.track-play')) {
			this.playTrack(record.get('uri'), record.get('progress_ms'), record.get('link'));
		}
	},

	/**
	 * on on play current track handler
	 * -> play track
	 *
	 * @param currentTrack
	 */
	onPlayCurrentTrack(currentTrack) {
		this.playTrack(currentTrack.item.uri, currentTrack.progress_ms, currentTrack.item.external_urls.spotify);
	},

	/**
	 * play track
	 * trigger the playback of given track via ajax request
	 * if progress_ms is given, start playback and seek to position
	 *
	 * @param uri
	 * @param progress_ms
	 */
	playTrack(uri, progress_ms, link) {
		const vm    = this.getViewModel();
		const token = vm.get('token');
		const me    = this;
		if (token) {
			// open player
			window.open(link, '_blank');
			// start playback and seek to position
			Ext.Ajax.request({
				url: '/play-track?token=' + token + '&uri=' + uri + '&progress_ms=' + progress_ms
			}).then((response, opts) => {
					const obj = Ext.decode(response.responseText);
					me.refreshTracks();
					console.log(`server-side success with status code ${response.status}`);
				},
				(response, opts) => {
					console.log(`server-side failure with status code ${response.status}`);
				});
		}
	},

	/**
	 * Open link to Spotify on item tap
	 */
	onBookmarkedItemTap(grid, index, target, record, e) {
		// bookmark
		if (e.getTarget('.track-bookmark')) {
			const vm    = this.getViewModel();
			const store = vm.getStore('bookmarked');
			const playedTracksStore = vm.getStore('playedTracks');

			record.set('bookmarked', !record.get('bookmarked'));
			store.remove(record);
			store.sync();

			trackRecord = playedTracksStore.findRecord('id', record.get('id'));
			if (trackRecord) {
				trackRecord.set('bookmarked', false);
			}
		}

		// play
		if (e.getTarget('.track-play')) {
			this.playTrack(record.get('uri'), record.get('progress_ms'), record.get('link'));
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

	/**
	 * Logout from Spotify locally
	 */
	onSpotifyLogout() {
		const vm = this.getViewModel();

		vm.set('token', '');
		localStorage.setItem('spotify-auth-token', '');
/*
		Ext.defer(() => {
				const store = vm.getStore('playedTracks');
				store.load();
			},
			300
		);
*/
		this.redirectTo('spotify/recently-played-tracks');
	},

	/**
	 * Bookmark currently playing track
	 * persist in localstorage
	 *
	 * @param currentTrack
	 */
	onBookmarkCurrentTrack(currentTrack) {
		const vm          = this.getViewModel();
		const store       = vm.getStore('bookmarked');
		const recordIndex = store.findExact('id', currentTrack.item.id);

		if (recordIndex === -1) {

			console.log(currentTrack);
			const record = Ext.create('Spotify.model.BookmarkedTrack', {
				//	id: currentTrack.item.id,
				name               : currentTrack.item.name,
				link               : currentTrack.item.external_urls.spotify,
				artist             : currentTrack.item.artists[0].name,
				bookmarked         : true,
				progress_ms        : currentTrack.progress_ms,
				duration_ms        : currentTrack.item.duration_ms,
				progress_ms_display: Spotify.util.Format.msToMinuteSecondString(currentTrack.progress_ms),
				duration_ms_display: Spotify.util.Format.msToMinuteSecondString(currentTrack.item.duration_ms),
				uri                : currentTrack.item.uri

			});
			store.add(record);
		} else {
			store.removeAt(recordIndex);
		}
		store.sync();
	},

	/**
	 * refresh track list and fire event
	 */
	refreshTracks() {
		const vm    = this.getViewModel();
		const store = vm.getStore('playedTracks');

		store.load();
		this.fireEvent('refreshTracks')
	}
});
