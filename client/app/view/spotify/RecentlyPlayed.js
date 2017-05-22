Ext.define('Spotify.view.spotify.RecentlyPlayed', {
	extend: 'Spotify.view.tracks.List',
	xtype : 'spotify-recentlyplayed',

	requires: [
		'Ext.plugin.PullRefresh'
	],

	plugins: [
		{
			xclass   : 'Ext.plugin.PullRefresh',
			mergeData: false,
			pullText : 'Pull down for to update track list!'
		}
	]
});
