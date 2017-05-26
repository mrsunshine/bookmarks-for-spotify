/**
 * Created by dkd-dehl on 22.05.17.
 */
Ext.define('Spotify.view.tracks.currenttrack.CurrentTrackModel', {
	extend: 'Ext.app.ViewModel',
	alias : 'viewmodel.currenttrack',

	data    : {
		currentPlayback: null
	},
	formulas: {

		// format progress ms to "00:00"
		progress_ms: function (get) {
			const ms = get('currentPlayback.progress_ms');
			return parseInt(ms / 1000 / 60) + ":" + parseInt(ms / 1000 % 60);
		},

		// format duration ms to "00:00"
		duration_ms: function (get) {
			const ms = get('currentPlayback.item.duration_ms');
			return parseInt(ms / 1000 / 60) + ":" + parseInt(ms / 1000 % 60);
		}
	}
});
