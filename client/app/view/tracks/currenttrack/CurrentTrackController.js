/**
 * Created by dkd-dehl on 22.05.17.
 */
Ext.define('Spotify.view.tracks.currenttrack.CurrentTrackController', {
	extend: 'Ext.app.ViewController',
	alias : 'controller.currenttrack',

	/**
	 * Called when the view is created
	 */
	init() {
	//	this.loadCurrentPlayback();
	},

	bindings: {
		onChangeToken: {
			token: '{token}'
		}
	},

	onChangeToken(data){
		if (data.token) {
			this.loadCurrentPlayback()
		}
	},

	loadCurrentPlayback() {
		const vm    = this.getViewModel();
	  const token = vm.get('token');

		if (token) {
			Ext.Ajax.request({
				url: '/current-playback?token=' + token
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
});
