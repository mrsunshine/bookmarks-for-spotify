/**
 * Created by dkd-dehl on 21/04/2017.
 */
Ext.define('Spotify.view.tracks.ListController', {
	extend: 'Ext.app.ViewController',
	alias : 'controller.spotify-tracks-list',

	/**
	 * On item disclosure tap open spotify track link
	 *
	 * @param list
	 * @param record
	 */
	onItemDisclosureHandler(list, record) {
		window.open(record.get('link', '_blank'));
	}
});
