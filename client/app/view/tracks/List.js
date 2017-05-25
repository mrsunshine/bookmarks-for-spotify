Ext.define('Spotify.view.tracks.List', {
	extend: 'Ext.dataview.List',

	xtype: 'spotify-track-list',
	cls: 'spotify-track-list',

	requires: [
		'Spotify.view.tracks.ListController'
	],

	controller      : 'spotify-tracks-list',

	itemTpl         :
	'<div class="track hbox ">' +

		'<div class="track-bookmark hbox cross-center main-center ">' +
			'<span class="icon x-fa  {[values.bookmarked ? "fa-bookmark" : "fa-bookmark-o"]}" />' +
		'</div>' +

		'<div class="track-info flex">' +
			'<span class="track-played-at">{played_at:date("d.m.Y - H:i")}</span>' +
			'<br /> {name} - {artist} ({progress_ms_display}/{duration_ms_display})' +

		'</div>' +

		'<div class="track-play hbox cross-center main-center ">' +
			'<span class="icon x-fa fa-play-circle-o" />' +
		'</div>' +

	'</div>'
});
