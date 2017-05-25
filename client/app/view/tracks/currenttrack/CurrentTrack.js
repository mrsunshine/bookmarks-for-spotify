/**
 * Created by dkd-dehl on 22.05.17.
 */
Ext.define('Spotify.view.tracks.currenttrack.CurrentTrack', {
	extend: 'Ext.Container',

	requires: [
		'Ext.layout.HBox',
		'Spotify.view.tracks.currenttrack.CurrentTrackController',
		'Spotify.view.tracks.currenttrack.CurrentTrackModel'
	],

	xtype: 'spotify-track-currenttrack',

	viewModel: {
		type: 'currenttrack'
	},
	cls: 'spotify-track-currenttrack',
	controller: 'currenttrack',
	layout: {
		type: 'hbox'
	},
	items: [
		{
			xtype: 'button',
			reference: 'bookmark',
			iconCls: 'x-fa fa-bookmark-o',
			ui: 'plain',
			width: 64,
			handler: 'bookmarkCurrentTrack'
		},
		{
			xtype: 'image',
			bind: {
				src: '{currentPlayback.item.album.images.2.url}',
				height: '{currentPlayback.item.album.images.2.height}',
				width: '{currentPlayback.item.album.images.2.width}'
			}
		},
		{
			xtype: 'component',
			flex: 1,
			bind: {
				data: {
					artist: '{currentPlayback.item.artists.0.name}',
					track: '{currentPlayback.item.name}',
					progress_ms: '{progress_ms}',
					duration_ms: '{duration_ms}'
				}
			},
			tpl: '{track} - {artist} ({progress_ms}/{duration_ms})',
			cls: 'spotify-track-currenttrack-info'
		},
		{
			xtype: 'button',
			iconCls: 'x-fa fa-play-circle-o',
			ui: 'plain',
			width: 64,
			handler: 'playCurrentTrack'
		},
		{
			xtype: 'progress',
			docked: 'top',
			height: 2,
			bind: {
				value: '{currentPlayback.progress_ms / currentPlayback.item.duration_ms}',
			}
		}
	]

});
