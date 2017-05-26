/**
 * Created by dkd-dehl on 22.05.17.
 */
Ext.define('Spotify.view.tracks.currenttrack.CurrentTrackController', {
	extend: 'Ext.app.ViewController',
	alias : 'controller.currenttrack',

	listen: {
		controller: {
			'*': {
				'refreshTracks': 'loadCurrentPlayback'
			}
		}
	},
	/**
	 * Called when the view is created
	 */
	init() {
	},


	bindings: {
		onChangeToken: {
			token: '{token}'
		}
	},

	/**
	 * when token changes trigger load of current playback
	 * @param data
	 */
	onChangeToken(data){
		if (data.token) {
			this.loadCurrentPlayback()
		}
	},

	/**
	 * load current playback
	 * trigger ajax request to server side and set respond object in viewmodel
	 */
	loadCurrentPlayback() {
		const vm    = this.getViewModel();
		const token = vm.get('token');

		if (token) {
			Ext.Ajax.request({
				url: '/current-playback?token=' + token
			}).then((response, opts) => {
					const obj = Ext.decode(response.responseText);

					vm.set('currentPlayback', obj);
				},
				(response, opts) => {
					console.log(`server-side failure with status code ${response.status}`);
				});
		}
	},

	/**
	 * bookmark current track
	 * - change button iconCls
	 * - fire event bookmarkCurrentTrack with current playback object
	 *
	 */
	bookmarkCurrentTrack() {
		const vm = this.getViewModel();
		const button = this.lookup('bookmark');
		if (button.getIconCls() === 'x-fa fa-bookmark-o') {
			button.setIconCls('x-fa fa-bookmark');
		} else {
			button.setIconCls('x-fa fa-bookmark-o');
		}

		this.fireEvent('bookmarkCurrentTrack', vm.get('currentPlayback'));
	},

	/**
	 * play current track
	 *
	 * fire event playCurrentTrack with currentPlayback object
	 */
	playCurrentTrack() {
		const vm = this.getViewModel();
		this.fireEvent('playCurrentTrack', vm.get('currentPlayback'));
	}
});
